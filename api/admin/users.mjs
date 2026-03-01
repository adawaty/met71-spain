import bcrypt from "bcryptjs";
import crypto from "crypto";

import { getPool } from "../_lib/db.mjs";
import { withCors, readJson, json } from "../_lib/http.mjs";
import { requireAuth } from "../_lib/auth.mjs";

function randomPassword() {
  return crypto.randomBytes(9).toString("base64url"); // ~12 chars
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const me = requireAuth(req, res, "owner");
  if (!me) return;

  const pool = getPool();

  if (req.method === "GET") {
    try {
      const url = new URL(req.url, "http://local");
      const q = (url.searchParams.get("q") || "").toString().trim();

      const values = [];
      let where = "";
      if (q) {
        values.push(`%${q}%`);
        where = `where email ilike $1`;
      }

      const r = await pool.query(
        `select id, created_at, email, role, is_active from public.admin_users ${where} order by created_at desc`,
        values,
      );
      return json(res, 200, { ok: true, items: r.rows });
    } catch (e) {
      console.error(e);
      return json(res, 500, { ok: false, error: "server_error" });
    }
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await readJson(req);
    } catch {
      return json(res, 400, { ok: false, error: "bad_json" });
    }

    const { email, role } = body ?? {};
    if (!email) return json(res, 400, { ok: false, error: "email_required" });

    const rRole = (role || "sales").toString();
    if (!["owner", "sales"].includes(rRole)) return json(res, 400, { ok: false, error: "bad_role" });

    const generated_password = randomPassword();
    const password_hash = bcrypt.hashSync(generated_password, 12);

    try {
      const r = await pool.query(
        "insert into public.admin_users (email, password_hash, role, is_active) values ($1,$2,$3,true) returning id, created_at, email, role, is_active",
        [String(email).toLowerCase().trim(), password_hash, rRole],
      );

      return json(res, 200, {
        ok: true,
        item: r.rows[0],
        generated_password,
      });
    } catch (e) {
      console.error(e);
      return json(res, 500, { ok: false, error: "server_error" });
    }
  }

  return json(res, 405, { ok: false, error: "method_not_allowed" });
}
