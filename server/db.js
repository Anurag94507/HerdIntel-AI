import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'cownet.db');

const db = new Database(dbPath);

// Performance & safety pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema from SQL file
const schemaPath = join(__dirname, '..', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

export default db;
