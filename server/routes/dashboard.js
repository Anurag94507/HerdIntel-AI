import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', (_req, res) => {
  try {
    const totalCows = db.prepare('SELECT COUNT(*) AS count FROM cows').get().count;

    const activeAlerts = db.prepare(
      `SELECT COUNT(*) AS count FROM ai_alerts WHERE resolution_status = 'Open'`
    ).get().count;

    // Herd health = % of cows WITHOUT an active High-risk alert
    const cowsWithHighRisk = db.prepare(
      `SELECT COUNT(DISTINCT cow_id) AS count FROM ai_alerts
       WHERE risk_level = 'High' AND resolution_status = 'Open'`
    ).get().count;

    const herdHealthPct = totalCows > 0
      ? Math.round(((totalCows - cowsWithHighRisk) / totalCows) * 100)
      : 100;

    // Average isolation score across last 24h
    const avgIsolation = db.prepare(
      `SELECT ROUND(AVG(isolation_score), 1) AS avg
       FROM sensor_telemetry
       WHERE timestamp >= datetime('now', '-24 hours')`
    ).get().avg || 0;

    // Total telemetry readings today
    const telemetryToday = db.prepare(
      `SELECT COUNT(*) AS count FROM sensor_telemetry
       WHERE timestamp >= datetime('now', '-24 hours')`
    ).get().count;

    res.json({
      totalCows,
      activeAlerts,
      herdHealthPct,
      avgIsolation,
      telemetryToday,
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

export default router;
