import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');
const directory = fileURLToPath(new URL('../../../database/migrations/', import.meta.url));
const pool = new Pool({ connectionString, max: 1 });

try {
  await pool.query('CREATE SCHEMA IF NOT EXISTS platform');
  await pool.query('CREATE TABLE IF NOT EXISTS platform.schema_migrations(filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const files = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
  for (const filename of files) {
    const exists = await pool.query('SELECT 1 FROM platform.schema_migrations WHERE filename=$1', [filename]);
    if (exists.rowCount) continue;
    const sql = await readFile(`${directory}/${filename}`, 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO platform.schema_migrations(filename) VALUES($1)', [filename]);
      await client.query('COMMIT');
      console.log(`applied ${filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }
} finally { await pool.end(); }
