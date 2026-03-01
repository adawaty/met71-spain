import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const { Pool } = pg;

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_PEPPER = process.env.REFRESH_TOKEN_PEPPER;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL env var");
  process.exit(1);
}

if (!JWT_ACCESS_SECRET) {
  console.error("Missing JWT_ACCESS_SECRET env var");
  process.exit(1);
}

if (!REFRESH_TOKEN_PEPPER) {
  console.error("Missing REFRESH_TOKEN_PEPPER env var");
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
  } catch (_e) {
    res.status(500).json({ ok: false });
  }
});

function csvEscape(v) {
  const s = (v ?? "").toString();
  const needs = /[\n\r,\"]/g.test(s);
  const out = s.replace(/\"/g, '""');
  return needs ? `"${out}"` : out;
}

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function createAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

function parseBearer(req) {
  const header = req.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

function requireAuth(minRole = "sales") {
  const allowOwnerOnly = minRole === "owner";

  return (req, res, next) => {
    const token = parseBearer(req);
    if (!token) return res.status(401).json({ ok: false, error: "unauthorized" });

    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
      const role = decoded?.role;
      if (allowOwnerOnly && role !== "owner") {
        return res.status(403).json({ ok: false, error: "forbidden" });
      }
      req.adminUser = decoded;
      next();
    } catch (_e) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
  };
}

app.post("/api/leads", async (req, res) => {
  const { name, email, phone, topic, message, lang, source_page } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "name, email, message required" });
  }

  try {
    const ua = req.get("user-agent") ?? null;
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
      .toString()
      .split(",")[0]
      .trim() || null;

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

app.post("/api/admin/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ ok: false, error: "email_password_required" });

  try {
    const r = await pool.query(
      "select id, email, password_hash, role, is_active from public.admin_users where email=$1 limit 1",
      [String(email).toLowerCase().trim()],
    );

    const user = r.rows[0];
    if (!user || !user.is_active) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const ok = bcrypt.compareSync(String(password), user.password_hash);
    if (!ok) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const access_token = createAccessToken({ sub: String(user.id), email: user.email, role: user.role });

    const refresh_token = crypto.randomBytes(48).toString("base64url");
    const token_hash = sha256Hex(`${REFRESH_TOKEN_PEPPER}:${refresh_token}`);
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await pool.query(
      "insert into public.refresh_tokens (user_id, token_hash, expires_at) values ($1,$2,$3)",
      [user.id, token_hash, expires_at.toISOString()],
    );

    res.json({
      ok: true,
      access_token,
      refresh_token,
      user: { id: String(user.id), email: user.email, role: user.role },
      expires_in: 60 * 15,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.post("/api/admin/auth/refresh", async (req, res) => {
  const { refresh_token } = req.body ?? {};
  if (!refresh_token) return res.status(400).json({ ok: false, error: "refresh_token_required" });

  try {
    const token_hash = sha256Hex(`${REFRESH_TOKEN_PEPPER}:${String(refresh_token)}`);

    const r = await pool.query(
      "select rt.id as rt_id, rt.user_id, rt.expires_at, u.email, u.role, u.is_active from public.refresh_tokens rt join public.admin_users u on u.id=rt.user_id where rt.token_hash=$1 limit 1",
      [token_hash],
    );

    const row = r.rows[0];
    if (!row) return res.status(401).json({ ok: false, error: "invalid_refresh" });
    if (!row.is_active) return res.status(401).json({ ok: false, error: "invalid_refresh" });

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await pool.query("delete from public.refresh_tokens where id=$1", [row.rt_id]);
      return res.status(401).json({ ok: false, error: "expired_refresh" });
    }

    const access_token = createAccessToken({ sub: String(row.user_id), email: row.email, role: row.role });

    const next_refresh_token = crypto.randomBytes(48).toString("base64url");
    const next_hash = sha256Hex(`${REFRESH_TOKEN_PEPPER}:${next_refresh_token}`);
    const next_expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await pool.query(
      "update public.refresh_tokens set token_hash=$1, expires_at=$2, created_at=now() where id=$3",
      [next_hash, next_expires_at.toISOString(), row.rt_id],
    );

    res.json({
      ok: true,
      access_token,
      refresh_token: next_refresh_token,
      user: { id: String(row.user_id), email: row.email, role: row.role },
      expires_in: 60 * 15,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.post("/api/admin/auth/logout", async (req, res) => {
  const { refresh_token } = req.body ?? {};
  if (!refresh_token) return res.json({ ok: true });

  try {
    const token_hash = sha256Hex(`${REFRESH_TOKEN_PEPPER}:${String(refresh_token)}`);
    await pool.query("delete from public.refresh_tokens where token_hash=$1", [token_hash]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.get("/api/admin/leads", requireAuth("sales"), async (req, res) => {
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

app.patch("/api/admin/leads/:id", requireAuth("sales"), async (req, res) => {
  const id = Number(req.params.id);
  const { status, sales_note } = req.body ?? {};

  if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "bad_id" });

  const allowed = new Set(["new", "contacted", "qualified", "won", "lost", "spam"]);
  if (status ? !allowed.has(status) : false) {
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

app.get("/api/admin/leads.csv", requireAuth("owner"), async (req, res) => {
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
