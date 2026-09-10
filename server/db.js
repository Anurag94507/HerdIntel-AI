import Database from 'better-sqlite3';
import { readFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let dbPath = join(__dirname, '..', 'cownet.db');

// In serverless environments (like Vercel / Netlify), write permissions are only available in /tmp
if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpDbPath = '/tmp/cownet.db';
  try {
    if (!existsSync(tmpDbPath) && existsSync(dbPath)) {
      copyFileSync(dbPath, tmpDbPath);
    }
    if (existsSync(tmpDbPath)) {
      dbPath = tmpDbPath;
    }
  } catch (err) {
    console.warn('Could not copy db to /tmp, using default path:', err);
  }
}

let db;
try {
  db = new Database(dbPath);
  try { db.pragma('journal_mode = WAL'); } catch (e) {}
  try { db.pragma('foreign_keys = ON'); } catch (e) {}
} catch (err) {
  console.warn('SQLite init warning, fallback to memory database:', err);
  db = new Database(':memory:');
}

const schemaPath = join(__dirname, '..', 'schema.sql');
if (existsSync(schemaPath)) {
  try {
    const schema = readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
  } catch (e) {
    console.warn('Schema exec skipped:', e);
  }
}

export default db;
