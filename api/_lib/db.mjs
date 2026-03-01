import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  if (pool) return pool;

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}
