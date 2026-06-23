$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
  param([string]$Message)
  Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warn {
  param([string]$Message)
  Write-Host "UYARI: $Message" -ForegroundColor Yellow
}

function Fail {
  param([string]$Message)
  Write-Host "HATA: $Message" -ForegroundColor Red
  exit 1
}

function Invoke-External {
  param(
    [string]$Command,
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command $($Arguments -join ' ') komutu başarısız oldu. Çıkış kodu: $LASTEXITCODE"
  }
}

function Set-EnvValue {
  param(
    [string]$Path,
    [string]$Key,
    [string]$Value
  )

  $lines = @()
  if (Test-Path -LiteralPath $Path) {
    $lines = @(Get-Content -LiteralPath $Path)
  }

  $pattern = "^$([regex]::Escape($Key))="
  $replacement = "$Key=$Value"
  $found = $false
  $updated = foreach ($line in $lines) {
    if ($line -match $pattern) {
      $found = $true
      $replacement
    } else {
      $line
    }
  }

  if (-not $found) {
    $updated += $replacement
  }

  Set-Content -LiteralPath $Path -Value $updated -Encoding UTF8
}

$Root = (Get-Location).Path
$BackendDir = Join-Path $Root "backend"
$BackendEnv = Join-Path $BackendDir ".env"
$BackendEnvExample = Join-Path $BackendDir ".env.example"
$FrontendEnvLocal = Join-Path $Root ".env.local"

Write-Step "Modeweb Windows local backend kurulumu başlıyor"
Write-Host "Proje root: $Root"

if ($Root -match "OneDrive") {
  Write-Warn "Proje OneDrive içinde. Prisma dosya kilidi hatası devam ederse projeyi C:\Projects\WebDashboard gibi OneDrive dışı bir klasöre taşı."
}

if (-not (Test-Path -LiteralPath $BackendDir)) {
  Fail "backend klasörü bulunamadı. Script'i proje root dizininde çalıştırdığından emin ol."
}

Write-Step "Çalışan Node processleri kapatılıyor"
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Ok "Node processleri temizlendi"

Write-Step "4000 portunu kullanan process temizleniyor"
$portLines = netstat -ano | Select-String ":4000\s+.*LISTENING"
$processIds = @()
foreach ($line in $portLines) {
  $parts = ($line.ToString() -split "\s+") | Where-Object { $_ }
  if ($parts.Count -gt 0) {
    $processIds += $parts[-1]
  }
}
$processIds = $processIds | Sort-Object -Unique
foreach ($processId in $processIds) {
  if ($processId -match "^\d+$") {
    taskkill /PID $processId /F | Out-Null
    Write-Ok "Port 4000 process kapatıldı. PID: $processId"
  }
}
if (-not $processIds.Count) {
  Write-Ok "Port 4000 boş"
}

Write-Step "backend/.env hazırlanıyor"
if (-not (Test-Path -LiteralPath $BackendEnv)) {
  if (-not (Test-Path -LiteralPath $BackendEnvExample)) {
    Fail "backend/.env.example bulunamadı"
  }
  Copy-Item -LiteralPath $BackendEnvExample -Destination $BackendEnv
  Write-Ok "backend/.env, backend/.env.example üzerinden oluşturuldu"
} else {
  Write-Ok "backend/.env zaten var; güvenli local değerler güncellenecek"
}

Set-EnvValue $BackendEnv "NODE_ENV" "development"
Set-EnvValue $BackendEnv "PORT" "4000"
Set-EnvValue $BackendEnv "API_BASE_PATH" "/api"
Set-EnvValue $BackendEnv "CORS_ORIGIN" "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173"
Set-EnvValue $BackendEnv "DATABASE_URL" '"postgresql://postgres:postgres@localhost:5432/modeweb?schema=public"'
Set-EnvValue $BackendEnv "JWT_ACCESS_SECRET" "dev-access-secret-change-before-production"
Set-EnvValue $BackendEnv "JWT_REFRESH_SECRET" "dev-refresh-secret-change-before-production"
Set-EnvValue $BackendEnv "JWT_ACCESS_EXPIRES_IN" "15m"
Set-EnvValue $BackendEnv "JWT_REFRESH_EXPIRES_IN" "7d"
Set-EnvValue $BackendEnv "COOKIE_NAME" "modeweb_refresh_token"
Set-EnvValue $BackendEnv "COOKIE_SECURE" "false"
Set-EnvValue $BackendEnv "ADMIN_EMAIL" "admin@silasarioglu.com"
Set-EnvValue $BackendEnv "ADMIN_PASSWORD" "Admin123456!"
Set-EnvValue $BackendEnv "ADMIN_FULL_NAME" "Sıla Sarıoğlu Admin"
Write-Ok "backend/.env local Docker PostgreSQL ayarlarıyla hazır"

Write-Step "Docker kontrol ediliyor"
try {
  Invoke-External "docker" @("--version")
} catch {
  Write-Host ""
  Write-Host "Docker Desktop kurulu değil. Yönetici PowerShell açıp şu komutu çalıştır:" -ForegroundColor Yellow
  Write-Host "winget install -e --id Docker.DockerDesktop" -ForegroundColor White
  Write-Host "Kurulumdan sonra bilgisayarı yeniden başlat, Docker Desktop'ı aç, sonra bu scripti tekrar çalıştır." -ForegroundColor Yellow
  exit 1
}

Write-Step "PostgreSQL Docker container başlatılıyor"
Invoke-External "docker" @("compose", "up", "-d")

Write-Step "modeweb-postgres container durumu kontrol ediliyor"
$containerState = docker inspect -f "{{.State.Running}}" modeweb-postgres 2>$null
if ($LASTEXITCODE -ne 0 -or $containerState -ne "true") {
  Fail "modeweb-postgres container çalışmıyor. Docker Desktop'ın açık olduğundan emin ol."
}
Write-Ok "modeweb-postgres çalışıyor"

Write-Step "Backend bağımlılıkları kuruluyor"
Push-Location $BackendDir
try {
  Invoke-External "npm" @("install")

  Write-Step "Prisma EPERM riskini azaltmak için .prisma cache temizleniyor"
  $PrismaCache = Join-Path $BackendDir "node_modules\.prisma"
  if (Test-Path -LiteralPath $PrismaCache) {
    Remove-Item -LiteralPath $PrismaCache -Recurse -Force
    Write-Ok "node_modules/.prisma temizlendi"
  } else {
    Write-Ok "node_modules/.prisma zaten yok"
  }

  Write-Step "Prisma client generate"
  Invoke-External "npx" @("prisma", "generate")

  Write-Step "Prisma migration"
  Invoke-External "npx" @("prisma", "migrate", "dev", "--name", "init")

  Write-Step "Admin seed"
  Invoke-External "npm" @("run", "prisma:seed")
} finally {
  Pop-Location
}

Write-Step "Frontend .env.local kontrol ediliyor"
if (-not (Test-Path -LiteralPath $FrontendEnvLocal)) {
  @(
    "VITE_API_BASE_URL=http://localhost:4000",
    "VITE_APP_ENV=development",
    "VITE_WHATSAPP_PHONE=905xxxxxxxxx"
  ) | Set-Content -LiteralPath $FrontendEnvLocal -Encoding UTF8
  Write-Ok ".env.local oluşturuldu"
} else {
  Write-Ok ".env.local zaten var; dokunulmadı"
}

Write-Host ""
Write-Host "Kurulum tamamlandı. Backend başlatmak için: cd backend && npm run dev" -ForegroundColor Green
Write-Host "Test: http://localhost:4000/api/health" -ForegroundColor Green
Write-Host "Admin: admin@silasarioglu.com / Admin123456!" -ForegroundColor Green
