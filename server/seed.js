import db from './db.js';

// ── Helper ──────────────────────────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

// ── Clear existing data ─────────────────────────────────────────────
db.exec('DELETE FROM ai_alerts');
db.exec('DELETE FROM sensor_telemetry');
db.exec('DELETE FROM welfare_audits');
db.exec('DELETE FROM cows');

// ── Seed Cows ───────────────────────────────────────────────────────
const cowData = [
  { tag: '401', breed: 'Holstein',       dob: '2020-03-15', status: 'Healthy' },
  { tag: '402', breed: 'Holstein',       dob: '2019-11-22', status: 'Under Observation' },
  { tag: '403', breed: 'Jersey',         dob: '2021-06-10', status: 'Healthy' },
  { tag: '404', breed: 'Guernsey',       dob: '2020-09-05', status: 'Healthy' },
  { tag: '405', breed: 'Brown Swiss',    dob: '2021-01-18', status: 'Healthy' },
  { tag: '406', breed: 'Ayrshire',       dob: '2022-04-30', status: 'Healthy' },
  { tag: '407', breed: 'Holstein',       dob: '2020-07-12', status: 'Healthy' },
  { tag: '408', breed: 'Jersey',         dob: '2021-11-03', status: 'Healthy' },
  { tag: '409', breed: 'Holstein',       dob: '2019-08-25', status: 'Lactating' },
  { tag: '410', breed: 'Brown Swiss',    dob: '2022-02-14', status: 'Healthy' },
];

const insertCow = db.prepare(
  `INSERT INTO cows (tag_number, breed, birth_date, current_status) VALUES (?, ?, ?, ?)`
);

const cowIds = {};
for (const c of cowData) {
  const info = insertCow.run(c.tag, c.breed, c.dob, c.status);
  cowIds[c.tag] = info.lastInsertRowid;
}

console.log('✅  Seeded 10 cows');

// ── Seed Sensor Telemetry ───────────────────────────────────────────
const zones = ['Barn-A', 'Barn-B', 'Pasture-North', 'Pasture-South', 'Milking-Parlor', 'Feed-Lot'];

const insertTelemetry = db.prepare(
  `INSERT INTO sensor_telemetry (cow_id, timestamp, location_zone, isolation_score, audio_cough_count)
   VALUES (?, ?, ?, ?, ?)`
);

const insertMany = db.transaction(() => {
  // Generate 7 days of data (every 2 hours = 84 readings per cow)
  for (const [tag, cowId] of Object.entries(cowIds)) {
    for (let h = 168; h >= 0; h -= 2) {
      const ts = hoursAgo(h);
      const zone = zones[randomInt(0, zones.length - 1)];

      let isolation, coughCount;

      if (tag === '402') {
        // ── COW #402 SCENARIO ──
        // Last 48 hours: isolation ramps 40 → 92, cough ramps 2 → 9
        if (h <= 48) {
          const progress = 1 - (h / 48); // 0 at 48h ago → 1 at now
          isolation = Math.round(40 + progress * 52 + randomInt(-3, 3));
          isolation = Math.min(100, Math.max(0, isolation));

          const baseCough = 2;
          coughCount = Math.round(baseCough + progress * 7 + randomInt(0, 1));
        } else {
          // Before 48h: normal baseline
          isolation = randomInt(20, 45);
          coughCount = randomInt(1, 3);
        }
      } else {
        // ── Normal cows ──
        isolation = randomInt(10, 40);
        coughCount = randomInt(0, 2);
      }

      insertTelemetry.run(cowId, ts, zone, isolation, coughCount);
    }
  }
});

insertMany();
console.log('✅  Seeded ~840 telemetry readings (7 days × 10 cows)');

// ── Seed some pre-existing alerts for other cows ────────────────────
const insertAlert = db.prepare(
  `INSERT INTO ai_alerts (cow_id, created_at, risk_level, alert_type, description, resolution_status)
   VALUES (?, ?, ?, ?, ?, ?)`
);

insertAlert.run(
  cowIds['404'], hoursAgo(72), 'Low', 'Mild Isolation Detected',
  'Cow #404 showed slightly elevated isolation score (52) during night hours. Likely normal resting behavior.',
  'Resolved'
);

insertAlert.run(
  cowIds['407'], hoursAgo(36), 'Medium', 'Elevated Respiratory Activity',
  'Cow #407 audio cough count above average (4/hr). Monitoring recommended.',
  'Open'
);

insertAlert.run(
  cowIds['403'], hoursAgo(120), 'Low', 'Zone Deviation',
  'Cow #403 spent 6 consecutive hours in Feed-Lot, deviating from normal pasture pattern.',
  'Resolved'
);

console.log('✅  Seeded 3 historical alerts');
console.log('');
console.log('🐄  Database seeded successfully!');
console.log('    Run "POST /api/engine/analyze" to trigger AI analysis on Cow #402.');
