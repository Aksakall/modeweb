# Local Backend Setup

Backend’i localde ayağa kaldırmak için:

```bash
cd backend
npm install
npm run env:setup
```

Root klasöre dönüp PostgreSQL’i başlat:

```bash
cd ..
docker compose up -d
```

Sonra backend klasöründe Prisma ve seed işlemlerini çalıştır:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Test endpointleri:

- GET `http://localhost:4000/api/health`
- POST `http://localhost:4000/api/auth/login`
- GET `http://localhost:4000/api/products`

Admin test bilgileri:

- email: `admin@silasarioglu.com`
- password: `Admin123456!`

Frontend’i backend’e bağlamak için root dizinde kendi `.env.local` dosyanı oluşturup şu değerleri kullan:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_ENV=development
VITE_WHATSAPP_PHONE=905xxxxxxxxx
```

Not: `backend/.env` ve root `.env.local` dosyaları local dosyalardır; GitHub’a gönderilmez.
