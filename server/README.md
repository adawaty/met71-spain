# Met71 Leads API (Neon)

This small Node/Express API receives leads from the website contact form and stores them in Neon Postgres.

## 1) Configure

Create a file `server/.env`:

```bash
DATABASE_URL="<your Neon connection string>"
PORT=8787
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
```

In production, deploy this API somewhere (Render/Fly.io/Railway/etc.), then set `VITE_LEADS_API_URL` to that public URL.

## Notes
- This repo is a static site; it cannot securely write to Neon directly from the browser without an API layer (secrets must stay server-side).
