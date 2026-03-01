import { json, withCors, readJson } from "../_lib/http.mjs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct";

function buildSystemPrompt({ lang }) {
  const base =
    "You are Met71 Spain's assistant. Answer concisely and professionally. " +
    "The company helps import/export between Spain/Europe and Egypt/North Africa, including documentation, customs support, market intelligence, and logistics coordination. " +
    "If the user asks for a quote, request: name, email, phone, product/service, origin, destination, timeline.";

  if (lang === "ar") return base + " Respond in Arabic.";
  if (lang === "es") return base + " Respond in Spanish.";
  return base + " Respond in English.";
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (!OPENROUTER_API_KEY) {
    return json(res, 500, { ok: false, error: "missing_openrouter_key" });
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { ok: false, error: "bad_json" });
  }

  const message = (body?.message || "").toString().trim();
  const history = Array.isArray(body?.history) ? body.history : [];
  const lang = (body?.lang || "en").toString();

  if (!message) return json(res, 400, { ok: false, error: "message_required" });

  const messages = [
    { role: "system", content: buildSystemPrompt({ lang }) },
    ...history
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-10),
    { role: "user", content: message },
  ];

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://met71-spain.vercel.app",
        "X-Title": "Met71 Spain Website",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 450,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return json(res, 500, { ok: false, error: "openrouter_error", detail: txt.slice(0, 500) });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.toString?.() || "";
    return json(res, 200, { ok: true, reply });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
