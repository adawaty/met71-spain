import bcrypt from "bcryptjs";
import crypto from "crypto";

import { getPool } from "../../_lib/db.mjs";
import { withCors, readJson, json } from "../../_lib/http.mjs";
import { requireAuth } from "../../_lib/auth.mjs";

function randomPassword() {
  return crypto.randomBytes(9).toString("base64url");
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const me = requireAuth(req, res, "owner");
  if (!me) return;

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

  const { role, is_active, reset_password } = body ?? {};

  if (role !== undefined && !["owner", "sales"].includes(String(role))) {
    return json(res, 400, { ok: false, error: "bad_role" });
  }

  if (is_active !== undefined && typeof is_active !== "boolean") {
    return json(res, 400, { ok: false, error: "bad_is_active" });
  }

  const pool = getPool();

  try {
    const values = [];
    const sets = [];

    let generated_password = null;

    if (role !== undefined) {
      values.push(String(role));
      sets.push(`role = $${values.length}`);
    }

    if (is_active !== undefined) {
      values.push(Boolean(is_active));
      sets.push(`is_active = $${values.length}`);
    }

    if (reset_password) {
      generated_password = randomPassword();
      const password_hash = bcrypt.hashSync(generated_password, 12);
      values.push(password_hash);
      sets.push(`password_hash = $${values.length}`);

      // revoke all refresh tokens for the user
      await pool.query("delete from public.refresh_tokens where user_id=$1", [id]);
    }

    if (!sets.length) return json(res, 400, { ok: false, error: "no_changes" });

    values.push(id);

    const r = await pool.query(
      `update public.admin_users set ${sets.join(", ")} where id = $${values.length} returning id, created_at, email, role, is_active`,
      values,
    );

    if (r.rowCount === 0) return json(res, 404, { ok: false, error: "not_found" });

    return json(res, 200, { ok: true, item: r.rows[0], generated_password });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
