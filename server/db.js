import { readFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let dbPath = join(__dirname, '..', 'cownet.db');

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
    console.warn('Could not copy db to /tmp:', err);
  }
}

function getDatabase() {
  try {
    // Synchronous require for serverless Node execution
    const Database = require('better-sqlite3');
    const instance = new Database(dbPath);
    try { instance.pragma('journal_mode = WAL'); } catch (e) {}
    try { instance.pragma('foreign_keys = ON'); } catch (e) {}
    const schemaPath = join(__dirname, '..', 'schema.sql');
    if (existsSync(schemaPath)) {
      try {
        const schema = readFileSync(schemaPath, 'utf-8');
        instance.exec(schema);
      } catch (e) {}
    }
    return instance;
  } catch (err) {
    console.warn('SQLite native module unavailable, using fallback mock:', err?.message);
    return {
      prepare: () => ({
        get: () => ({}),
        all: () => [],
        run: () => ({ lastInsertRowid: 1, changes: 1 })
      }),
      exec: () => {},
      pragma: () => {}
    };
  }
}

const db = getDatabase();

export default db;
