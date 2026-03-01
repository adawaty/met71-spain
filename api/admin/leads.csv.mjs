import { getPool } from "../_lib/db.mjs";
import { withCors } from "../_lib/http.mjs";
import { requireAuth } from "../_lib/auth.mjs";

function csvEscape(v) {
  const s = (v ?? "").toString();
  const needs = /[\n\r,\"]/g.test(s);
  const out = s.replace(/\"/g, '""');
  return needs ? `"${out}"` : out;
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const user = requireAuth(req, res, "owner");
  if (!user) return;

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
    return;
  }

  try {
    const pool = getPool();
    const url = new URL(req.url, "http://local");
    const status = (url.searchParams.get("status") || "").toString().trim();

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

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=met71-leads.csv");
    res.end(csv);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "server_error" }));
  }
}
