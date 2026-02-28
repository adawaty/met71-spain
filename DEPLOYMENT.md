# Deployment guide (Website + Leads API)

## Website (static)

This is a Vite static build.

### Build
```bash
pnpm install
pnpm build
```
The output is `dist/`.

### Deploy options
- GitHub Pages
- Netlify
- Vercel (static)
- Cloudflare Pages

> Make sure you also deploy the Leads API and then set the environment variable `VITE_LEADS_API_URL`.

## Leads API (Node/Express)

Location: `server/`

### Run locally
```bash
cd server
pnpm install
pnpm dev
```

### Deploy (recommended)
Deploy as a small Node service on:
- Render
- Fly.io
- Railway
- Northflank

### Environment variables
- `DATABASE_URL` = Neon Postgres connection string (keep secret)
- `PORT` = service port (platform will provide)

### CORS
The API currently enables CORS for all origins for simplicity.
In production, restrict it to your website domain.

## Hooking the form to the API

Set (in your hosting provider for the website build):
- `VITE_LEADS_API_URL=https://<your-api-domain>/api/leads`

Then rebuild/redeploy the website.

## Verifying end-to-end

1) Open `https://<api>/health` → should return `{ ok: true, db: true }`
2) Submit the website contact form
3) In Neon SQL editor:
```sql
select * from public.leads order by created_at desc limit 20;
```
