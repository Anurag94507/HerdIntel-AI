import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/alerts — List all alerts with cow info
router.get('/', (req, res) => {
  try {
    const { status, risk } = req.query;

    let sql = `
      SELECT a.*, c.tag_number, c.breed, c.current_status
      FROM ai_alerts a
      JOIN cows c ON c.id = a.cow_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND a.resolution_status = ?';
      params.push(status);
    }
    if (risk) {
      sql += ' AND a.risk_level = ?';
      params.push(risk);
    }

    sql += ' ORDER BY a.created_at DESC';

    const alerts = db.prepare(sql).all(...params);
    res.json(alerts);
  } catch (err) {
    console.error('Alerts fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  try {
    db.prepare(
      `UPDATE ai_alerts SET resolution_status = 'Resolved' WHERE id = ?`
    ).run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

export default router;
