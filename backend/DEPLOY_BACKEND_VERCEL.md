# Deploy Backend to Vercel

## Project setup

1. Create a new project in Vercel.
2. Select the same GitHub repository.
3. Set Root Directory to:

```txt
backend
```

4. Set Build Command to:

```bash
npm run vercel-build
```

5. Leave Output Directory empty.
6. Set Install Command to:

```bash
npm install
```

## Environment variables

Add these variables in the Vercel backend project:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `COOKIE_NAME`
- `COOKIE_SECURE`
- `CORS_ORIGIN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME`

Recommended production values:

```env
NODE_ENV=production
API_BASE_PATH=/api
COOKIE_SECURE=true
CORS_ORIGIN=https://silasarioglu.vercel.app
```

## Deploy tests

After deploy, test:

```txt
https://backend-domain.vercel.app/api/health
https://backend-domain.vercel.app/api/products
```

## Admin seed note

The first production deploy needs the admin user to be seeded once.

Run the seed as a separate manual step after the database and environment variables are ready. Be careful about running seed during every Vercel build: the seed uses upsert, but it can update the admin password from `ADMIN_PASSWORD` on each deploy.

For that reason, keep admin seed as a deliberate manual production step unless you intentionally want every deploy to reset the admin password from environment variables.
