# Backend integration contract

The storefront reads its base URL from `VITE_API_BASE_URL`, environment from `VITE_APP_ENV`, and WhatsApp phone from `VITE_WHATSAPP_PHONE`. Copy `.env.example` when configuring a deployment. Authentication requests use `credentials: include`; short-lived access tokens are kept in memory. Production authentication should prefer secure, HttpOnly, SameSite cookies.

## Response conventions

- Collection responses: `{ "items": [], "total": 0, "page": 1, "limit": 24, "totalPages": 0 }`
- Error responses: `{ "message": "User-facing error", "code": "MACHINE_CODE", "fields": {} }`
- Money values are numeric major currency units and use `currency: "TRY"`.
- Cart and favorite mutations should return the collection response (or `204`; the frontend then refreshes the collection).
- `PATCH /api/cart/items/:id` accepts `{ "quantity": 2 }`.
- Admin endpoints must enforce the authenticated user's `role` on the backend.

## Storefront endpoints

- Products: `GET /api/products`, `GET /api/products/:slug`
- Categories: `GET /api/categories`, `GET /api/categories/:slug`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- Cart: `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/:id`, `DELETE /api/cart/items/:id`, `DELETE /api/cart/clear`
- Favorites: `GET /api/favorites`, `POST /api/favorites`, `DELETE /api/favorites/:productId`
- Orders: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/cancel`
- Payments: `POST /api/payments/create`, `POST /api/payments/verify`, `GET /api/payments/options`
- Newsletter: `POST /api/newsletter/subscribe`
- Admin dashboard: `GET /api/admin/dashboard`
- Admin products: `GET|POST /api/admin/products`, `PATCH|DELETE /api/admin/products/:id`
- Admin categories: `GET|POST /api/admin/categories`, `PATCH|DELETE /api/admin/categories/:id`
- Admin orders: `GET /api/admin/orders`, `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status`
- Admin customers: `GET /api/admin/customers`
- Admin newsletter: `GET /api/admin/newsletter`
- Admin settings: `GET|PATCH /api/admin/settings`

`PATCH /api/admin/orders/:id/status` accepts `{ "status": "preparing" }`. Allowed values are `new`, `preparing`, `shipped`, `delivered`, and `cancelled`.

Product, variant, cart item, order and category payloads are represented directly in `data/mockProducts.js`, `data/mockCategories.js`, `services/cartService.js`, and `checkout.js`.
