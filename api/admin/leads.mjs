import { getPool } from "../_lib/db.mjs";
import { withCors, json } from "../_lib/http.mjs";
import { requireAuth } from "../_lib/auth.mjs";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const user = requireAuth(req, res, "sales");
  if (!user) return;

  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  try {
    const pool = getPool();

    const url = new URL(req.url, "http://local");
    const limit = Math.min(Number(url.searchParams.get("limit") || 25), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
    const status = (url.searchParams.get("status") || "").toString().trim();
    const q = (url.searchParams.get("q") || "").toString().trim();

    const filters = [];
    const values = [];

    if (status) {
      values.push(status);
      filters.push(`status = $${values.length}`);
    }

    if (q) {
      const like = `%${q}%`;
      values.push(like);
      values.push(like);
      filters.push(`(name ilike $${values.length - 1} or email ilike $${values.length})`);
    }

    const where = filters.length ? `where ${filters.join(" and ")}` : "";

    const rows = await pool.query(
      `select id, created_at, name, email, phone, topic, message, lang, source_page, status, sales_note from public.leads ${where} order by created_at desc limit $${values.length + 1} offset $${values.length + 2}`,
      [...values, limit, offset],
    );

    const total = await pool.query(
      `select count(*)::int as count from public.leads ${where}`,
      values,
    );

    return json(res, 200, { ok: true, items: rows.rows, total: total.rows[0].count });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
