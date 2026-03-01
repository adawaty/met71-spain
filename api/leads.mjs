import { getPool } from "./_lib/db.mjs";
import { withCors, readJson, json } from "./_lib/http.mjs";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { ok: false, error: "bad_json" });
  }

  const { name, email, phone, topic, message, lang, source_page } = body ?? {};

  if (!name || !email || !message) {
    return json(res, 400, { ok: false, error: "name, email, message required" });
  }

  try {
    const pool = getPool();

    const ua = req.headers["user-agent"] ?? null;
    const xf = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(xf) ? xf[0] : xf || "")
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

    return json(res, 200, { ok: true, id: r.rows[0].id, created_at: r.rows[0].created_at });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
