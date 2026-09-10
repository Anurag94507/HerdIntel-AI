import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/cows — List all cows
router.get('/', (_req, res) => {
  try {
    const cows = db.prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM ai_alerts WHERE cow_id = c.id AND resolution_status = 'Open') AS active_alerts
       FROM cows c
       ORDER BY c.tag_number`
    ).all();
    res.json(cows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cows' });
  }
});

// GET /api/cows/:id — Cow profile with 7-day telemetry
router.get('/:id', (req, res) => {
  try {
    const cow = db.prepare(
      `SELECT * FROM cows WHERE id = ?`
    ).get(req.params.id);

    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }

    // 7 days of telemetry
    const telemetry = db.prepare(
      `SELECT timestamp, location_zone, isolation_score, audio_cough_count
       FROM sensor_telemetry
       WHERE cow_id = ? AND timestamp >= datetime('now', '-168 hours')
       ORDER BY timestamp ASC`
    ).all(req.params.id);

    // Alerts for this cow
    const alerts = db.prepare(
      `SELECT * FROM ai_alerts
       WHERE cow_id = ?
       ORDER BY created_at DESC`
    ).all(req.params.id);

    // Calculate stats
    const stats = db.prepare(
      `SELECT
         ROUND(AVG(isolation_score), 1)   AS avgIsolation,
         MAX(isolation_score)              AS maxIsolation,
         ROUND(AVG(audio_cough_count), 1) AS avgCough,
         MAX(audio_cough_count)            AS maxCough
       FROM sensor_telemetry
       WHERE cow_id = ? AND timestamp >= datetime('now', '-168 hours')`
    ).get(req.params.id);

    res.json({
      ...cow,
      telemetry,
      alerts,
      stats,
    });
  } catch (err) {
    console.error('Cow profile error:', err);
    res.status(500).json({ error: 'Failed to fetch cow profile' });
  }
});

export default router;
