import { getPool } from "./db.mjs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_EMBED_MODEL = process.env.OPENROUTER_EMBED_MODEL || "text-embedding-3-small";

function vecToSqlLiteral(vec) {
  return `[${vec.map((x) => Number(x).toFixed(8)).join(",")}]`;
}

export async function embedText(text) {
  if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://met71-spain.vercel.app",
      "X-Title": "Met71 Spain RAG",
    },
    body: JSON.stringify({ model: OPENROUTER_EMBED_MODEL, input: text }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`OpenRouter embeddings failed: ${r.status} ${txt.slice(0, 300)}`);
  }

  const data = await r.json();
  const vec = data?.data?.[0]?.embedding;
  if (!Array.isArray(vec)) throw new Error("Invalid embedding response");
  return vec;
}

export async function retrieveChunks({ lang, query, k = 6 }) {
  const pool = getPool();
  const vec = await embedText(query);
  const vecLit = vecToSqlLiteral(vec);

  // Using L2 distance (<->). Requires pgvector.
  const r = await pool.query(
    "select title, source, content from public.ai_kb_chunks where lang=$1 order by embedding <-> $2::vector limit $3",
    [lang, vecLit, k],
  );

  return r.rows || [];
}
