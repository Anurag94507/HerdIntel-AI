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

// In-Memory Seed Data for Serverless Environment
const mockCows = [
  { id: 1, tag_number: '401', breed: 'Holstein', birth_date: '2020-03-15', current_status: 'Healthy' },
  { id: 2, tag_number: '402', breed: 'Holstein', birth_date: '2019-11-22', current_status: 'Under Observation' },
  { id: 3, tag_number: '403', breed: 'Jersey', birth_date: '2021-06-10', current_status: 'Healthy' },
  { id: 4, tag_number: '404', breed: 'Guernsey', birth_date: '2020-09-05', current_status: 'Healthy' },
  { id: 5, tag_number: '405', breed: 'Brown Swiss', birth_date: '2021-01-18', current_status: 'Healthy' },
  { id: 6, tag_number: '406', breed: 'Ayrshire', birth_date: '2022-04-30', current_status: 'Healthy' },
  { id: 7, tag_number: '407', breed: 'Holstein', birth_date: '2020-07-12', current_status: 'Healthy' },
  { id: 8, tag_number: '408', breed: 'Jersey', birth_date: '2021-11-03', current_status: 'Healthy' },
  { id: 9, tag_number: '409', breed: 'Holstein', birth_date: '2019-08-25', current_status: 'Lactating' },
  { id: 10, tag_number: '410', breed: 'Brown Swiss', birth_date: '2022-02-14', current_status: 'Healthy' }
];

const mockAlerts = [
  {
    id: 1, cow_id: 2, created_at: new Date(Date.now() - 3600000).toISOString(),
    risk_level: 'High', alert_type: 'Severe Isolation & Cough Spike',
    description: 'Cow #402 exhibits 94% isolation score and 9 coughs/hr. Potential respiratory infection.',
    resolution_status: 'Open', tag_number: '402', breed: 'Holstein', current_status: 'Under Observation'
  },
  {
    id: 2, cow_id: 7, created_at: new Date(Date.now() - 86400000).toISOString(),
    risk_level: 'Medium', alert_type: 'Elevated Respiratory Activity',
    description: 'Cow #407 audio cough count above average (4/hr). Monitoring recommended.',
    resolution_status: 'Open', tag_number: '407', breed: 'Holstein', current_status: 'Healthy'
  },
  {
    id: 3, cow_id: 4, created_at: new Date(Date.now() - 172800000).toISOString(),
    risk_level: 'Low', alert_type: 'Mild Isolation Detected',
    description: 'Cow #404 showed slightly elevated isolation score (52) during night hours.',
    resolution_status: 'Resolved', tag_number: '404', breed: 'Guernsey', current_status: 'Healthy'
  }
];

const mockTelemetry = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  cow_id: 2,
  timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
  location_zone: i % 2 === 0 ? 'Barn-A' : 'Pasture-North',
  isolation_score: 40 + (i * 2),
  audio_cough_count: Math.floor(i / 3)
}));

const mockFinances = [
  { id: 1, date: new Date().toISOString().split('T')[0], type: 'Sale', category: 'Milk Sales', amount: 15400, description: 'Bulk morning milk delivery (350L)' },
  { id: 2, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: 'Expense', category: 'Cattle Feed', amount: 4800, description: 'High-protein fodder & mineral supplement' }
];

function createFallbackDb() {
  return {
    prepare: (sql) => {
      const lowerSql = sql.toLowerCase();
      return {
        get: (...params) => {
          if (lowerSql.includes('from cows') && lowerSql.includes('count')) {
            return { count: mockCows.length };
          }
          if (lowerSql.includes('from ai_alerts') && lowerSql.includes('count')) {
            if (lowerSql.includes("risk_level = 'high'")) {
              return { count: mockAlerts.filter(a => a.risk_level === 'High' && a.resolution_status === 'Open').length };
            }
            return { count: mockAlerts.filter(a => a.resolution_status === 'Open').length };
          }
          if (lowerSql.includes('avg(isolation_score)') || lowerSql.includes('sensor_telemetry')) {
            if (lowerSql.includes('avg')) return { avg: 34.2, count: 240 };
            return { count: 240 };
          }
          if (lowerSql.includes('from cows where id =')) {
            const id = params[0] || 1;
            return mockCows.find(c => c.id === Number(id)) || mockCows[0];
          }
          return { count: 10, avg: 28.5 };
        },
        all: (...params) => {
          if (lowerSql.includes('from cows')) {
            if (params.length > 0) {
              const id = Number(params[0]);
              return mockCows.filter(c => c.id === id);
            }
            return mockCows;
          }
          if (lowerSql.includes('from ai_alerts')) {
            return mockAlerts;
          }
          if (lowerSql.includes('from sensor_telemetry')) {
            return mockTelemetry;
          }
          if (lowerSql.includes('from farm_finances')) {
            return mockFinances;
          }
          return [];
        },
        run: (...params) => {
          return { lastInsertRowid: Date.now(), changes: 1 };
        }
      };
    },
    exec: () => {},
    pragma: () => {},
    transaction: (fn) => fn
  };
}

let db = null;

try {
  const req = eval("require");
  const Database = req('better-sqlite3');
  db = new Database(dbPath);
  try { db.pragma('journal_mode = WAL'); } catch (e) {}
  try { db.pragma('foreign_keys = ON'); } catch (e) {}

  const schemaPath = join(__dirname, '..', 'schema.sql');
  if (existsSync(schemaPath)) {
    try {
      const schema = readFileSync(schemaPath, 'utf-8');
      db.exec(schema);
    } catch (e) {}
  }
} catch (err) {
  console.warn('Native SQLite module not bound (Serverless Lambda mode). Active fallback enabled.');
  db = createFallbackDb();
}

export default db;
