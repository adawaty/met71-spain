import { json, withCors, readJson } from "../_lib/http.mjs";
import { getPool } from "../_lib/db.mjs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct";

function systemPrompt(lang) {
  const base =
    "You are Met71 Spain's assistant for import/export between Spain/Europe and Egypt/North Africa. " +
    "Be concise, professional, and helpful. " +
    "If the user requests a quote, you must gather contact details and shipment details. " +
    "You MUST output ONLY valid JSON (no markdown)." +
    "\n\nReturn JSON with this exact schema:\n" +
    "{\n" +
    "  \"reply\": string,\n" +
    "  \"quote_intent\": boolean,\n" +
    "  \"lead\": {\n" +
    "    \"name\": string|null,\n" +
    "    \"email\": string|null,\n" +
    "    \"phone\": string|null,\n" +
    "    \"origin\": string|null,\n" +
    "    \"destination\": string|null,\n" +
    "    \"product\": string|null,\n" +
    "    \"timeline\": string|null,\n" +
    "    \"notes\": string|null\n" +
    "  }\n" +
    "}\n\n" +
    "Rules:\n" +
    "- quote_intent=true when the user asks for a quote / price / offer / proposal / shipment booking.\n" +
    "- Extract lead fields from the conversation when possible; otherwise null.\n" +
    "- If quote_intent=true and name/email are missing, ask for them in reply.\n";

  if (lang === "ar") return base + "Reply language: Arabic.";
  if (lang === "es") return base + "Reply language: Spanish.";
  return base + "Reply language: English.";
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function isValidEmail(e) {
  return typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

function normalizeStr(v, max = 200) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
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
  const source_page = normalizeStr(body?.source_page, 80) || "ai_chat";

  if (!message) return json(res, 400, { ok: false, error: "message_required" });

  const messages = [
    { role: "system", content: systemPrompt(lang) },
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
        max_tokens: 550,
        response_format: { type: "json_object" },
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return json(res, 500, { ok: false, error: "openrouter_error", detail: txt.slice(0, 500) });
    }

    const data = await r.json();
    const raw = data?.choices?.[0]?.message?.content?.toString?.() || "";
    const parsed = safeJsonParse(raw);

    if (!parsed || typeof parsed.reply !== "string") {
      // fallback to raw content
      return json(res, 200, { ok: true, reply: raw || "" });
    }

    const reply = parsed.reply;
    const quote_intent = Boolean(parsed.quote_intent);

    let saved_lead = null;

    if (quote_intent) {
      const lead = parsed.lead || {};

      const name = normalizeStr(lead.name, 200);
      const email = normalizeStr(lead.email, 250);
      const phone = normalizeStr(lead.phone, 80);
      const origin = normalizeStr(lead.origin, 120);
      const destination = normalizeStr(lead.destination, 120);
      const product = normalizeStr(lead.product, 200);
      const timeline = normalizeStr(lead.timeline, 120);
      const notes = normalizeStr(lead.notes, 1200);

      // Only save to leads table when we have the minimum required fields.
      if (name && isValidEmail(email)) {
        const transcript = [...history, { role: "user", content: message }]
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-12)
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n");

        const leadMessage = [
          "AI Chat Quote Request",
          product ? `Product/Service: ${product}` : null,
          origin ? `Origin: ${origin}` : null,
          destination ? `Destination: ${destination}` : null,
          timeline ? `Timeline: ${timeline}` : null,
          notes ? `Notes: ${notes}` : null,
          "---",
          transcript ? `Transcript:\n${transcript}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        const pool = getPool();
        const ua = req.headers["user-agent"] ?? null;
        const xf = req.headers["x-forwarded-for"];
        const ip = (Array.isArray(xf) ? xf[0] : xf || "")
          .toString()
          .split(",")[0]
          .trim() || null;

        const q =
          "insert into public.leads (name, email, phone, topic, message, lang, source_page, user_agent, ip) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id, created_at";

        const ins = await pool.query(q, [
          name,
          email,
          phone,
          "Quote request (AI chat)",
          leadMessage.slice(0, 5000),
          lang ? String(lang).slice(0, 8) : null,
          source_page,
          ua ? String(ua).slice(0, 500) : null,
          ip,
        ]);

        saved_lead = { id: ins.rows[0].id, created_at: ins.rows[0].created_at };
      }
    }

    return json(res, 200, { ok: true, reply, quote_intent, saved_lead });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: "server_error" });
  }
}
