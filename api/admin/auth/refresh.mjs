import { withCors, json } from "../../_lib/http.mjs";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  return json(res, 404, { ok: false, error: "not_supported" });
}
