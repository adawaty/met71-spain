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

function adminAuth(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return res.status(500).json({ ok: false, error: "missing_admin_token" });
  }
  const header = req.get("authorization") || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  const got = header.slice(7).trim();
  if (got !== token) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

function csvEscape(v) {
  const s = (v ?? "").toString();
  const needs = /[\n\r,\"]/g.test(s);
  const out = s.replace(/\"/g, '""');
  return needs ? `"${out}"` : out;
}

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

app.get("/api/admin/leads", adminAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 25), 200);
  const offset = Math.max(Number(req.query.offset || 0), 0);
  const status = (req.query.status || "").toString().trim();

  try {
    const where = status ? "where status = $3" : "";
    const params = status ? [limit, offset, status] : [limit, offset];

    const rows = await pool.query(
      `select id, created_at, name, email, phone, topic, message, lang, source_page, status, sales_note from public.leads ${where} order by created_at desc limit $1 offset $2`,
      params,
    );

    const total = await pool.query(
      status
        ? "select count(*)::int as count from public.leads where status = $1"
        : "select count(*)::int as count from public.leads",
      status ? [status] : [],
    );

    res.json({ ok: true, items: rows.rows, total: total.rows[0].count });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.patch("/api/admin/leads/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { status, sales_note } = req.body ?? {};

  if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "bad_id" });

  const allowed = new Set(["new", "contacted", "qualified", "won", "lost", "spam"]);
  if (status 																																				? !allowed.has(status) : false) {
    return res.status(400).json({ ok: false, error: "bad_status" });
  }

  try {
    const r = await pool.query(
      "update public.leads set status = coalesce($1,status), sales_note = coalesce($2,sales_note) where id=$3 returning id, status, sales_note",
      [status ?? null, sales_note ?? null, id],
    );
    if (r.rowCount === 0) return res.status(404).json({ ok: false, error: "not_found" });
    res.json({ ok: true, item: r.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.get("/api/admin/leads.csv", adminAuth, async (req, res) => {
  const status = (req.query.status || "").toString().trim();

  try {
    const where = status ? "where status = $1" : "";
    const params = status ? [status] : [];

    const r = await pool.query(
      `select id, created_at, name, email, phone, topic, message, lang, source_page, status, sales_note from public.leads ${where} order by created_at desc`,
      params,
    );

    const header = [
      "id",
      "created_at",
      "name",
      "email",
      "phone",
      "topic",
      "message",
      "lang",
      "source_page",
      "status",
      "sales_note",
    ].join(",");

    const lines = r.rows.map((row) =>
      [
        row.id,
        row.created_at,
        row.name,
        row.email,
        row.phone,
        row.topic,
        row.message,
        row.lang,
        row.source_page,
        row.status,
        row.sales_note,
      ]
        .map(csvEscape)
        .join(","),
    );

    const csv = [header, ...lines].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=met71-leads.csv");
    res.send(csv);
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`Met71 Leads API listening on :${PORT}`);
});
