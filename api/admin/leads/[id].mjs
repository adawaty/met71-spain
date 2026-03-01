import { getPool } from "../_lib/db.mjs";
import { withCors, readJson, json } from "../_lib/http.mjs";
import { requireAuth } from "../_lib/auth.mjs";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const user = requireAuth(req, res, "sales");
  if (!user) return;

  if (req.method !== "PATCH") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const url = new URL(req.url, "http://local");
  const id = Number(url.pathname.split("/").pop());
  if (!Number.isFinite(id)) return json(res, 400, { ok: false, error: "bad_id" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { ok: false, error: "bad_json" });
  }

  const { status, sales_note } = body ?? {};

  const allowed = new Set(["new", "contacted", "qualified", "won", "lost", "spam"]);
  if (status ? !allowed.has(status) : false) {
    return json(res, 400, { ok: false, error: "bad_status" });
  }

  try {
    const pool = getPool();
    const r = await pool.query(
      "update public.leads set status = coalesce($1,status), sales_note = coalesce($2,sales_note) where id=$3 returning id, status, sales_note",
      [status ?? null, sales_note ?? null, id],
    );
    if (r.rowCount === 0) return json(res, 404, { ok: false, error: "not_found" });
    return json(res, 200, { ok: true, item: r.rows[0] });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
