import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL env var");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/health", async (_req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: true, db: r.rows[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/leads", async (req, res) => {
  const { name, email, phone, topic, message, lang, source_page } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "name, email, message required" });
  }

  try {
    const ua = req.get("user-agent") ?? null;
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim() || null;

    const q =
      "insert into public.leads (name, email, phone, topic, message, lang, source_page, user_agent, ip) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id, created_at";

    const r = await pool.query(q, [
      String(name).slice(0, 200),
      String(email).slice(0, 250),
      phone ? String(phone).slice(0, 80) : null,
      topic ? String(topic).slice(0, 200) : null,
      String(message).slice(0, 5000),
      lang ? String(lang).slice(0, 8) : null,
      source_page ? String(source_page).slice(0, 80) : null,
      ua ? String(ua).slice(0, 500) : null,
      ip,
    ]);

    return res.json({ ok: true, id: r.rows[0].id, created_at: r.rows[0].created_at });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`Met71 Leads API listening on :${PORT}`);
});
