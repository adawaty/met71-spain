import crypto from "crypto";
import jwt from "jsonwebtoken";

export function getJwtSecret() {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s) throw new Error("Missing JWT_ACCESS_SECRET");
  return s;
}

export function getRefreshPepper() {
  const s = process.env.REFRESH_TOKEN_PEPPER;
  if (!s) throw new Error("Missing REFRESH_TOKEN_PEPPER");
  return s;
}

export function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function createAccessToken(payload, opts = {}) {
  const expiresIn = opts.expiresIn || "7d";
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function parseBearer(req) {
  const header = req.headers?.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export function requireAuth(req, res, minRole = "sales") {
  const token = parseBearer(req);
  if (!token) {
    res.statusCode = 401;
    res.json({ ok: false, error: "unauthorized" });
    return null;
  }

  try {
    const decoded = verifyAccessToken(token);
    const role = decoded?.role;
    if (minRole === "owner" && role !== "owner") {
      res.statusCode = 403;
      res.json({ ok: false, error: "forbidden" });
      return null;
    }
    return decoded;
  } catch {
    res.statusCode = 401;
    res.json({ ok: false, error: "unauthorized" });
    return null;
  }
}
