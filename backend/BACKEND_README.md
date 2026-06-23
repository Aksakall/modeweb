# Modeweb Backend

Express + Prisma API service for the Sıla Sarıoğlu storefront and admin panel.

## Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/modeweb?schema=public"
CORS_ORIGIN=http://localhost:4173,http://127.0.0.1:4173
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
ADMIN_EMAIL=admin@silasarioglu.com
ADMIN_PASSWORD=change-me-admin-password
ADMIN_FULL_NAME=Sıla Sarıoğlu Admin
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

## Run

```bash
npm run dev
```

Default API URL:

```txt
http://localhost:4000/api
```

## Health check

```bash
curl http://localhost:4000/api/health
```

Expected:

```json
{
  "ok": true,
  "service": "modeweb-backend"
}
```

## Frontend connection

When this backend is running locally, set the frontend environment to:

```env
VITE_API_BASE_URL=http://localhost:4000
```

The frontend app appends `/api/...` paths itself, so the base URL should not include `/api`.

## Admin login

Create or update the admin user with:

```bash
npm run prisma:seed
```

Then log into `/admin.html` using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Implemented endpoint groups

- `GET /api/health`
- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/cart`
- `/api/orders`
- `/api/newsletter`
- `/api/admin/dashboard`
- `/api/admin/products`
- `/api/admin/categories`
- `/api/admin/orders`
- `/api/admin/customers`
- `/api/admin/newsletter`
- `/api/admin/settings`

Collection responses use:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 24,
  "totalPages": 0
}
```
