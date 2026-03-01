import { json, withCors, readJson } from "../_lib/http.mjs";
import { requireAuth } from "../_lib/auth.mjs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct";

function promptFor(type) {
  if (type === "reply") {
    return (
      "You are an import/export sales coordinator at Met71 Spain. " +
      "Write a short, professional email reply to the lead. " +
      "Ask only for missing info. Keep it actionable. Output plain text only."
    );
  }
  return (
    "You are a sales assistant. Summarize the lead in 4 bullets and propose the next action. " +
    "Output plain text only."
  );
}

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const user = requireAuth(req, res, "sales");
  if (!user) return;

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

  const type = (body?.type || "summary").toString();
  const lead = body?.lead;
  const lang = (body?.lang || "en").toString();

  if (!lead || !lead.name || !lead.email || !lead.message) {
    return json(res, 400, { ok: false, error: "lead_required" });
  }

  const system = promptFor(type) + (lang === "ar" ? " Respond in Arabic." : lang === "es" ? " Respond in Spanish." : " Respond in English.");

  const userMsg =
    `Lead details:\n` +
    `Name: ${lead.name}\n` +
    `Email: ${lead.email}\n` +
    `Phone: ${lead.phone || ""}\n` +
    `Topic: ${lead.topic || ""}\n` +
    `Message: ${lead.message}\n` +
    `Source: ${lead.source_page || ""} Lang: ${lead.lang || ""}`;

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://met71-spain.vercel.app",
        "X-Title": "Met71 Spain Admin",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return json(res, 500, { ok: false, error: "openrouter_error", detail: txt.slice(0, 500) });
    }

    const data = await r.json();
    const output = data?.choices?.[0]?.message?.content?.toString?.() || "";
    return json(res, 200, { ok: true, output });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
