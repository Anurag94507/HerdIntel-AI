-- CowNet-AI Advanced — Database Schema
-- SQLite-compatible DDL

CREATE TABLE IF NOT EXISTS cows (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tag_number    VARCHAR(20)  UNIQUE NOT NULL,
  breed         VARCHAR(50)  NOT NULL,
  birth_date    DATE         NOT NULL,
  current_status VARCHAR(20) DEFAULT 'Healthy'
);

CREATE TABLE IF NOT EXISTS sensor_telemetry (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  cow_id             INTEGER  NOT NULL,
  timestamp          DATETIME NOT NULL,
  location_zone      VARCHAR(50),
  isolation_score    INTEGER  CHECK(isolation_score >= 0 AND isolation_score <= 100),
  audio_cough_count  INTEGER  DEFAULT 0,
  FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_alerts (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  cow_id             INTEGER  NOT NULL,
  created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
  risk_level         VARCHAR(10) CHECK(risk_level IN ('Low', 'Medium', 'High')),
  alert_type         VARCHAR(100),
  description        TEXT,
  resolution_status  VARCHAR(20) DEFAULT 'Open',
  FOREIGN KEY (cow_id) REFERENCES cows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS welfare_audits (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  generated_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  overall_welfare_score REAL,
  report_data           TEXT,  -- JSON string
  signature_status      VARCHAR(20) DEFAULT 'Unsigned'
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_telemetry_cow_ts    ON sensor_telemetry(cow_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_cow          ON ai_alerts(cow_id);
CREATE INDEX IF NOT EXISTS idx_alerts_risk         ON ai_alerts(risk_level);
CREATE INDEX IF NOT EXISTS idx_alerts_created      ON ai_alerts(created_at);

-- Farmer Finance Ledger Table
CREATE TABLE IF NOT EXISTS farmer_finances (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_type   VARCHAR(20) CHECK(entry_type IN ('Sale', 'Expenditure')) NOT NULL,
  amount       REAL NOT NULL,
  category     VARCHAR(50),
  description  TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

