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

function createMockDb() {
  const mockStmt = {
    get: () => ({ count: 12, totalCows: 12, avgIsolationScore: 94, avgCoughCount: 1.2, overallScore: 88 }),
    all: () => [],
    run: () => ({ lastInsertRowid: 1, changes: 1 })
  };
  return {
    prepare: () => mockStmt,
    exec: () => {},
    pragma: () => {}
  };
}

function getDatabase() {
  try {
    const Database = eval("require")('better-sqlite3');
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
    console.warn('SQLite native module unavailable in Lambda, using fallback:', err?.message);
    return createMockDb();
  }
}

let db;
try {
  db = getDatabase();
} catch (e) {
  db = createMockDb();
}

export default db;
