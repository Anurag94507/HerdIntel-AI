import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/engine/analyze
// Multi-Modal AI Fusion Engine (mocked)
router.post('/analyze', (_req, res) => {
  try {
    const newAlerts = [];

    // Get all cows
    const cows = db.prepare('SELECT * FROM cows').all();

    for (const cow of cows) {
      // ── Step 1: Check isolation score over last 48 hours ──────────
      const isolationData = db.prepare(
        `SELECT AVG(isolation_score) AS avg_isolation,
                MIN(isolation_score) AS min_isolation,
                MAX(isolation_score) AS max_isolation,
                COUNT(*) AS readings
         FROM sensor_telemetry
         WHERE cow_id = ? AND timestamp >= datetime('now', '-48 hours')`
      ).get(cow.id);

      if (!isolationData || isolationData.readings < 2) continue;

      const avgIsolation = isolationData.avg_isolation;

      // ── Step 2: Calculate cough baseline vs recent ────────────────
      // Baseline = readings from 48–24 hours ago
      const baseline = db.prepare(
        `SELECT AVG(audio_cough_count) AS avg_cough
         FROM sensor_telemetry
         WHERE cow_id = ?
           AND timestamp >= datetime('now', '-168 hours')
           AND timestamp < datetime('now', '-48 hours')`
      ).get(cow.id);

      // Recent = last 12 hours
      const recent = db.prepare(
        `SELECT AVG(audio_cough_count) AS avg_cough
         FROM sensor_telemetry
         WHERE cow_id = ?
           AND timestamp >= datetime('now', '-12 hours')`
      ).get(cow.id);

      if (!baseline || !recent || !baseline.avg_cough) continue;

      const baselineCough = baseline.avg_cough;
      const recentCough = recent.avg_cough;
      const coughIncreasePct = ((recentCough - baselineCough) / baselineCough) * 100;

      // ── Step 3: FUSION RULE ──────────────────────────────────────
      // If isolation > 85 for 48h AND cough increase > 80%
      if (avgIsolation > 85 && coughIncreasePct > 80) {
        // Check if alert already exists for this cow (avoid duplicates)
        const existingAlert = db.prepare(
          `SELECT id FROM ai_alerts
           WHERE cow_id = ?
             AND alert_type = 'Pre-Clinical Illness'
             AND resolution_status = 'Open'
             AND created_at >= datetime('now', '-24 hours')`
        ).get(cow.id);

        if (!existingAlert) {
          const description = `🚨 AI Fusion Engine detected converging risk factors for Cow #${cow.tag_number}:\n` +
            `• Social Isolation: ${Math.round(avgIsolation)}% average over 48h (threshold: 85%)\n` +
            `• Respiratory Audio: ${Math.round(coughIncreasePct)}% increase in cough frequency over baseline (threshold: 80%)\n` +
            `• Max isolation observed: ${isolationData.max_isolation}%\n` +
            `• Recent cough rate: ${recentCough.toFixed(1)}/reading vs baseline ${baselineCough.toFixed(1)}/reading\n` +
            `\nRecommendation: Immediate veterinary examination recommended. Isolate from herd for clinical assessment.`;

          const result = db.prepare(
            `INSERT INTO ai_alerts (cow_id, risk_level, alert_type, description, resolution_status)
             VALUES (?, 'High', 'Pre-Clinical Illness', ?, 'Open')`
          ).run(cow.id, description);

          newAlerts.push({
            id: result.lastInsertRowid,
            cowId: cow.id,
            tagNumber: cow.tag_number,
            riskLevel: 'High',
            alertType: 'Pre-Clinical Illness',
            avgIsolation: Math.round(avgIsolation),
            coughIncreasePct: Math.round(coughIncreasePct),
            description,
          });
        }
      }
      // Medium risk: elevated isolation OR elevated cough (but not both critical)
      else if (avgIsolation > 60 || coughIncreasePct > 50) {
        const existingAlert = db.prepare(
          `SELECT id FROM ai_alerts
           WHERE cow_id = ?
             AND resolution_status = 'Open'
             AND created_at >= datetime('now', '-24 hours')`
        ).get(cow.id);

        if (!existingAlert) {
          const factors = [];
          if (avgIsolation > 60) factors.push(`elevated isolation (${Math.round(avgIsolation)}%)`);
          if (coughIncreasePct > 50) factors.push(`increased cough activity (+${Math.round(coughIncreasePct)}%)`);

          const description = `⚠️ Monitoring advisory for Cow #${cow.tag_number}: ${factors.join(', ')}. ` +
            `Factors have not yet converged to critical thresholds but warrant continued observation.`;

          const result = db.prepare(
            `INSERT INTO ai_alerts (cow_id, risk_level, alert_type, description, resolution_status)
             VALUES (?, 'Medium', 'Behavioral Anomaly', ?, 'Open')`
          ).run(cow.id, description);

          newAlerts.push({
            id: result.lastInsertRowid,
            cowId: cow.id,
            tagNumber: cow.tag_number,
            riskLevel: 'Medium',
            alertType: 'Behavioral Anomaly',
            avgIsolation: Math.round(avgIsolation),
            coughIncreasePct: Math.round(coughIncreasePct),
            description,
          });
        }
      }
    }

    res.json({
      analyzed: cows.length,
      newAlertsGenerated: newAlerts.length,
      alerts: newAlerts,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Engine analyze error:', err);
    res.status(500).json({ error: 'AI Fusion Engine analysis failed' });
  }
});

export default router;
