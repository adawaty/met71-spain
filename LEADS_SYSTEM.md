# Met71 Leads System (Neon)

This repo contains:
- A **static** marketing website (React/Vite)
- A small **Leads API** (Node/Express) that stores enquiries in **Neon Postgres**

Because a static site runs in the browser, it must **not** connect directly to Neon (it would expose database credentials). The API is the secure bridge.

## Architecture

**Flow**
1. Visitor submits the Contact form.
2. Website sends `POST` to the Leads API.
3. Leads API validates input and writes a row into Neon table `public.leads`.
4. Sales team consumes leads via:
   - a simple internal dashboard (next step), or
   - email notifications, or
   - CRM integration (HubSpot, Zoho, Salesforce), or
   - Notion/Slack webhook.

## Neon database

**Table**: `public.leads`

Columns:
- `id` (bigserial, pk)
- `created_at` (timestamptz, default now())
- `name` (text)
- `email` (text)
- `phone` (text, nullable)
- `topic` (text, nullable)
- `message` (text)
- `lang` (text)
- `source_page` (text)
- `user_agent` (text)
- `ip` (text)

## Leads API

Location: `server/`

Endpoints:
- `GET /health`
- `POST /api/leads`

Expected payload:
```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "topic": "...",
  "message": "...",
  "lang": "en|es|ar",
  "source_page": "contact"
}
```

### Configure (local)

1) In `server/.env`
```bash
DATABASE_URL="<Neon connection string>"
PORT=8787
```

2) Install + run
```bash
cd server
pnpm install
pnpm dev
```

### Wire website (local)

Set in your environment when running Vite:
```bash
VITE_LEADS_API_URL="http://localhost:8787/api/leads"
```

## Sales / inquiry workflow options

Pick one (or combine):

1) **Neon-only (fastest)**
- Sales checks Neon table (via SQL editor or client).
- Good for early stage.

2) **Email notifications**
- Add SMTP or provider (SendGrid/Mailgun) to API.
- On successful insert, send an email to sales.

3) **CRM integration**
- API forwards lead to CRM (recommended once you run campaigns).

4) **Slack / Notion**
- API posts to a Slack channel or creates a Notion DB row.

## Next recommended step: Admin dashboard

Add a small authenticated dashboard (separate route/app) that:
- lists leads (pagination)
- shows lead detail
- marks status (new/contacted/won/lost)
- exports CSV

This needs a backend (or serverless functions) + auth. If you want it, I can extend the system design and implement it.
