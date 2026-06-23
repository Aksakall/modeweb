# Windows Local Backend Çalıştırma

PowerShell’i proje root dizininde aç:

```powershell
.\scripts\setup-local-windows.ps1
```

Eğer PowerShell script çalıştırmaya izin vermezse:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Sonra tekrar:

```powershell
.\scripts\setup-local-windows.ps1
```

Kurulum bitince:

```powershell
cd backend
npm run dev
```

Test:

http://localhost:4000/api/health

Admin:

- email: `admin@silasarioglu.com`
- password: `Admin123456!`
