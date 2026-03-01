# Met71 Leads API (Neon)

This small Node/Express API receives leads from the website contact form and stores them in Neon Postgres.

It also exposes an **admin API** protected by:
- short-lived **JWT access tokens**
- rotating **refresh tokens** stored (hashed) in Postgres

## 1) Configure

Create a file `server/.env`:

```bash
DATABASE_URL="<your Neon connection string>"
PORT=8787

# Admin auth
JWT_ACCESS_SECRET="<long random secret>"
REFRESH_TOKEN_PEPPER="<long random secret>"
```

## 2) Install + run

```bash
cd server
pnpm install
pnpm dev
```

Health check:
- http://localhost:8787/health

## 3) Wire the website

Set the website env var (for dev/build):

```bash
VITE_LEADS_API_URL="http://localhost:8787/api/leads"
# Optional: if Admin API is hosted on another origin
VITE_ADMIN_API_BASE="http://localhost:8787"
```

In production, deploy this API somewhere (Render/Fly.io/Railway/etc.), then set `VITE_LEADS_API_URL` to that public URL.

## Admin auth endpoints

- `POST /api/admin/auth/login` body: `{ "email": "...", "password": "..." }`
- `POST /api/admin/auth/refresh` body: `{ "refresh_token": "..." }`
- `POST /api/admin/auth/logout` body: `{ "refresh_token": "..." }`

## Admin leads endpoints

All admin endpoints require:
- Header: `Authorization: Bearer <access_token>`

Endpoints:
- `GET /api/admin/leads?limit=25&offset=0&status=new`
- `PATCH /api/admin/leads/:id` body: `{ "status": "contacted", "sales_note": "..." }`
- `GET /api/admin/leads.csv?status=new` (**owner role only**, downloads CSV)

Admin UI:
- Website route: `/admin`

## Notes
- This repo is a static site; it cannot securely write to Neon directly from the browser without an API layer (secrets must stay server-side).
- To revoke all sessions, delete all rows from `public.refresh_tokens`.
