import crypto from "crypto";

import { withCors, readJson, json } from "../../_lib/http.mjs";
import { createAccessToken } from "../../_lib/auth.mjs";

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return json(res, 500, { ok: false, error: "missing_admin_password" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { ok: false, error: "bad_json" });
  }

  const { password } = body ?? {};
  if (!password) return json(res, 400, { ok: false, error: "password_required" });

  if (!safeEqual(password, ADMIN_PASSWORD)) {
    return json(res, 401, { ok: false, error: "invalid_credentials" });
  }

  const access_token = createAccessToken({ sub: "admin", email: "admin@met71spain.com", role: "owner" }, { expiresIn: "7d" });

  return json(res, 200, {
    ok: true,
    access_token,
    user: { id: "admin", email: "admin@met71spain.com", role: "owner" },
    expires_in: 60 * 60 * 24 * 7, // 7 days (token itself is signed with expiresIn below)
  });
}
