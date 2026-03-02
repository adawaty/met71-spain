import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_EMBED_MODEL = process.env.OPENROUTER_EMBED_MODEL || "text-embedding-3-small";
const DATABASE_URL = process.env.DATABASE_URL;

if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY");
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

function chunkText(text, maxLen = 900) {
  const paras = String(text)
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const out = [];
  let buf = "";
  for (const p of paras.length ? paras : [text]) {
    if ((buf + "\n\n" + p).trim().length > maxLen && buf.trim().length) {
      out.push(buf.trim());
      buf = p;
    } else {
      buf = (buf ? buf + "\n\n" : "") + p;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

async function embed(text) {
  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://met71-spain.vercel.app",
      "X-Title": "Met71 Spain KB Ingestion",
    },
    body: JSON.stringify({
      model: OPENROUTER_EMBED_MODEL,
      input: text,
    }),
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

function vecToSqlLiteral(vec) {
  return `[${vec.map((x) => Number(x).toFixed(8)).join(",")}]`;
}

async function main() {
  const seedPath = path.join(process.cwd(), "kb", "seed.json");
  const raw = fs.readFileSync(seedPath, "utf-8");
  const items = JSON.parse(raw);

  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  // Ensure pgvector extension + table exist (safe idempotent)
  await pool.query("create extension if not exists vector");
  await pool.query(
    "create table if not exists public.ai_kb_chunks (id bigserial primary key, created_at timestamptz not null default now(), lang text not null, source text not null, title text, content text not null, embedding vector(1536) not null)",
  );

  let inserted = 0;

  for (const item of items) {
    const lang = String(item.lang);
    const source = String(item.source);
    const title = item.title ? String(item.title) : null;
    const content = String(item.content);

    const chunks = chunkText(content, 900);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vec = await embed(chunk);
      const vecLit = vecToSqlLiteral(vec);

      await pool.query(
        "insert into public.ai_kb_chunks (lang, source, title, content, embedding) values ($1,$2,$3,$4,$5::vector)",
        [lang, source, title ? `${title}${chunks.length > 1 ? ` (part ${i + 1})` : ""}` : null, chunk, vecLit],
      );

      inserted++;
      process.stdout.write(`\rInserted ${inserted} chunks...`);
    }
  }

  console.log(`\nDone. Inserted ${inserted} chunks.`);
  await pool.end();
}

main().catch((e) => {
  console.error("\nFailed:", e);
  process.exit(1);
});
