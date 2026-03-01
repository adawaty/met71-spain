import { withCors, json } from "../../_lib/http.mjs";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });
  return json(res, 200, { ok: true });
}
