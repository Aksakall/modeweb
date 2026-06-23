$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
  param([string]$Message)
  Write-Host "OK: $Message" -ForegroundColor Green
}

function Write-Warn {
  param([string]$Message)
  Write-Host "WARNING: $Message" -ForegroundColor Yellow
}

function Fail {
  param([string]$Message)
  Write-Host "ERROR: $Message" -ForegroundColor Red
  exit 1
}

function Invoke-External {
  param(
    [string]$Command,
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command $($Arguments -join " ") failed. Exit code: $LASTEXITCODE"
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

Write-Step "Modeweb Windows local backend setup started"
Write-Host "Project root: $Root"

if ($Root -match "OneDrive") {
  Write-Warn "Project is inside OneDrive. If Prisma file lock errors continue, move the project to a folder outside OneDrive, for example C:\Projects\WebDashboard."
}

if (-not (Test-Path -LiteralPath $BackendDir)) {
  Fail "backend folder was not found. Run this script from the project root folder."
}

Write-Step "Stopping running Node processes"
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Ok "Node processes stopped"

Write-Step "Cleaning port 4000"
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
    Write-Ok "Port 4000 process killed. PID: $processId"
  }
}

if (-not $processIds.Count) {
  Write-Ok "Port 4000 is free"
}

Write-Step "Preparing backend .env"
if (-not (Test-Path -LiteralPath $BackendEnv)) {
  if (-not (Test-Path -LiteralPath $BackendEnvExample)) {
    Fail "backend/.env.example was not found"
  }
  Copy-Item -LiteralPath $BackendEnvExample -Destination $BackendEnv
  Write-Ok "backend/.env created from backend/.env.example"
} else {
  Write-Ok "backend/.env already exists. Local values will be updated."
}

Set-EnvValue $BackendEnv "NODE_ENV" "development"
Set-EnvValue $BackendEnv "PORT" "4000"
Set-EnvValue $BackendEnv "API_BASE_PATH" "/api"
Set-EnvValue $BackendEnv "CORS_ORIGIN" "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173"
Set-EnvValue $BackendEnv "DATABASE_URL" """postgresql://postgres:postgres@localhost:5432/modeweb?schema=public"""
Set-EnvValue $BackendEnv "JWT_ACCESS_SECRET" "dev-access-secret-change-before-production"
Set-EnvValue $BackendEnv "JWT_REFRESH_SECRET" "dev-refresh-secret-change-before-production"
Set-EnvValue $BackendEnv "JWT_ACCESS_EXPIRES_IN" "15m"
Set-EnvValue $BackendEnv "JWT_REFRESH_EXPIRES_IN" "7d"
Set-EnvValue $BackendEnv "COOKIE_NAME" "modeweb_refresh_token"
Set-EnvValue $BackendEnv "COOKIE_SECURE" "false"
Set-EnvValue $BackendEnv "ADMIN_EMAIL" "admin@silasarioglu.com"
Set-EnvValue $BackendEnv "ADMIN_PASSWORD" "Admin123456!"
Set-EnvValue $BackendEnv "ADMIN_FULL_NAME" "Sila Sarioglu Admin"
Write-Ok "backend/.env is ready for local Docker PostgreSQL"

Write-Step "Checking Docker"
try {
  Invoke-External "docker" @("--version")
} catch {
  Write-Host ""
  Write-Host "Docker Desktop is not installed. Open PowerShell as Administrator and run:" -ForegroundColor Yellow
  Write-Host "winget install -e --id Docker.DockerDesktop" -ForegroundColor White
  Write-Host "After installation, restart your computer, open Docker Desktop, then run this script again." -ForegroundColor Yellow
  exit 1
}

Write-Step "Starting PostgreSQL Docker container"
Invoke-External "docker" @("compose", "up", "-d")

Write-Step "Checking modeweb-postgres container"
$containerState = docker inspect -f "{{.State.Running}}" modeweb-postgres 2>$null
if ($LASTEXITCODE -ne 0 -or $containerState -ne "true") {
  Fail "modeweb-postgres container is not running. Make sure Docker Desktop is open."
}
Write-Ok "modeweb-postgres is running"

Write-Step "Installing backend dependencies"
Push-Location $BackendDir
try {
  Invoke-External "npm" @("install")

  Write-Step "Cleaning Prisma cache to reduce EPERM risk"
  $PrismaCache = Join-Path $BackendDir "node_modules\.prisma"
  if (Test-Path -LiteralPath $PrismaCache) {
    Remove-Item -LiteralPath $PrismaCache -Recurse -Force
    Write-Ok "node_modules/.prisma removed"
  } else {
    Write-Ok "node_modules/.prisma does not exist"
  }

  Write-Step "Generating Prisma client"
  Invoke-External "npx" @("prisma", "generate")

  Write-Step "Running Prisma migration"
  Invoke-External "npx" @("prisma", "migrate", "dev", "--name", "init")

  Write-Step "Seeding admin user"
  Invoke-External "npm" @("run", "prisma:seed")
} finally {
  Pop-Location
}

Write-Step "Checking frontend .env.local"
if (-not (Test-Path -LiteralPath $FrontendEnvLocal)) {
  @(
    "VITE_API_BASE_URL=http://localhost:4000",
    "VITE_APP_ENV=development",
    "VITE_WHATSAPP_PHONE=905xxxxxxxxx"
  ) | Set-Content -LiteralPath $FrontendEnvLocal -Encoding UTF8
  Write-Ok ".env.local created"
} else {
  Write-Ok ".env.local already exists. It was not changed."
}

Write-Host ""
Write-Host "Setup completed. Start backend with: cd backend && npm run dev" -ForegroundColor Green
Write-Host "Test: http://localhost:4000/api/health" -ForegroundColor Green
Write-Host "Admin: admin@silasarioglu.com / Admin123456!" -ForegroundColor Green
