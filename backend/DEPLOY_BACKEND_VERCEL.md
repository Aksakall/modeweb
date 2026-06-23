# Backend Vercel Deploy

1. Vercel’de yeni proje oluştur.
2. Aynı GitHub repo seç: `Aksakall/modeweb`
3. Root Directory: `backend`
4. Install Command: `npm install`
5. Build Command: `npm run vercel-build`
6. Output Directory boş bırakılır.

## Backend Vercel Environment Variables

```env
NODE_ENV=production
API_BASE_PATH=/api
DATABASE_URL=postgresql://CANLI_POSTGRES_CONNECTION_STRING
JWT_ACCESS_SECRET=strong-random-access-secret
JWT_REFRESH_SECRET=strong-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_NAME=modeweb_refresh_token
COOKIE_SECURE=true
CORS_ORIGIN=https://silasarioglu.vercel.app
ADMIN_EMAIL=admin@silasarioglu.com
ADMIN_PASSWORD=strong-admin-password
ADMIN_FULL_NAME=Sıla Sarıoğlu Admin
```

## Notlar

- `DATABASE_URL` GitHub’a eklenmez.
- Localhost `DATABASE_URL` Vercel’de çalışmaz.
- Canlı PostgreSQL için Neon, Supabase, Vercel Postgres, Prisma Postgres veya Railway kullanılabilir.
- `DATABASE_URL` `sslmode=require` içermelidir.
- Env değişkenleri girildikten sonra backend project redeploy yapılmalıdır.

## Deploy sonrası test

```txt
https://backend-domain.vercel.app/api/health
https://backend-domain.vercel.app/api/products
```

## Frontend Vercel Environment Variables

```env
VITE_API_BASE_URL=https://backend-domain.vercel.app
VITE_APP_ENV=production
VITE_WHATSAPP_PHONE=05416963726
```

Frontend env güncellendikten sonra frontend redeploy yapılmalıdır.
