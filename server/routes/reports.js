import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/reports/generate
// Aggregate last 30 days into a formal welfare audit report
router.post('/generate', (_req, res) => {
  try {
    // ── Gather 30-day statistics ────────────────────────────────────
    const totalCows = db.prepare('SELECT COUNT(*) AS c FROM cows').get().c;

    const alertStats = db.prepare(
      `SELECT
         COUNT(*)                                          AS total_alerts,
         SUM(CASE WHEN risk_level = 'High'   THEN 1 ELSE 0 END) AS high_alerts,
         SUM(CASE WHEN risk_level = 'Medium' THEN 1 ELSE 0 END) AS medium_alerts,
         SUM(CASE WHEN risk_level = 'Low'    THEN 1 ELSE 0 END) AS low_alerts,
         SUM(CASE WHEN resolution_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved
       FROM ai_alerts
       WHERE created_at >= datetime('now', '-30 days')`
    ).get();

    const telemetryStats = db.prepare(
      `SELECT
         ROUND(AVG(isolation_score), 2)    AS avg_isolation,
         ROUND(AVG(audio_cough_count), 2)  AS avg_cough,
         MAX(isolation_score)               AS max_isolation,
         MAX(audio_cough_count)             AS max_cough,
         COUNT(*)                           AS total_readings
       FROM sensor_telemetry
       WHERE timestamp >= datetime('now', '-30 days')`
    ).get();

    // ── Per-cow health summary ──────────────────────────────────────
    const cowSummaries = db.prepare(
      `SELECT
         c.tag_number,
         c.breed,
         c.current_status,
         ROUND(AVG(st.isolation_score), 1)   AS avg_isolation,
         ROUND(AVG(st.audio_cough_count), 1) AS avg_cough,
         COUNT(DISTINCT a.id)                 AS alert_count
       FROM cows c
       LEFT JOIN sensor_telemetry st ON st.cow_id = c.id AND st.timestamp >= datetime('now', '-30 days')
       LEFT JOIN ai_alerts a ON a.cow_id = c.id AND a.created_at >= datetime('now', '-30 days')
       GROUP BY c.id
       ORDER BY alert_count DESC`
    ).all();

    // ── Calculate Five Freedoms scores ──────────────────────────────
    const highRiskPenalty = (alertStats.high_alerts || 0) * 8;
    const mediumRiskPenalty = (alertStats.medium_alerts || 0) * 3;
    const lowRiskPenalty = (alertStats.low_alerts || 0) * 1;

    const freedomFromDisease = Math.max(0, 100 - highRiskPenalty - mediumRiskPenalty);
    const freedomFromDiscomfort = Math.max(0, 100 - Math.round((telemetryStats.avg_isolation || 0) * 0.8));
    const freedomFromPain = Math.max(0, 100 - highRiskPenalty * 1.5);
    const freedomToExpressBehavior = Math.max(0, 100 - Math.round((telemetryStats.avg_isolation || 0) * 1.2) - lowRiskPenalty);
    const freedomFromFear = Math.max(0, 95 - mediumRiskPenalty);

    const overallScore = Math.round(
      (freedomFromDisease + freedomFromDiscomfort + freedomFromPain +
       freedomToExpressBehavior + freedomFromFear) / 5
    );

    // ── Build report ────────────────────────────────────────────────
    const reportData = {
      reportPeriod: {
        start: new Date(Date.now() - 30 * 86400_000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
      herdOverview: {
        totalCows,
        totalTelemetryReadings: telemetryStats.total_readings,
        avgIsolationScore: telemetryStats.avg_isolation,
        avgCoughCount: telemetryStats.avg_cough,
        maxIsolationObserved: telemetryStats.max_isolation,
        maxCoughObserved: telemetryStats.max_cough,
      },
      alertSummary: {
        totalAlerts: alertStats.total_alerts,
        highRisk: alertStats.high_alerts,
        mediumRisk: alertStats.medium_alerts,
        lowRisk: alertStats.low_alerts,
        resolved: alertStats.resolved,
        resolutionRate: alertStats.total_alerts > 0
          ? Math.round((alertStats.resolved / alertStats.total_alerts) * 100)
          : 100,
      },
      fiveFreedoms: {
        freedomFromDisease,
        freedomFromDiscomfort,
        freedomFromPain,
        freedomToExpressBehavior,
        freedomFromFear,
        overallScore,
      },
      cowSummaries,
      generatedBy: 'CowNet-AI Advanced Fusion Engine v2.1',
      complianceStandard: 'EU Regulation 2019/6 & OIE Terrestrial Animal Health Code',
    };

    // ── Save to database ────────────────────────────────────────────
    const result = db.prepare(
      `INSERT INTO welfare_audits (overall_welfare_score, report_data, signature_status)
       VALUES (?, ?, 'Unsigned')`
    ).run(overallScore, JSON.stringify(reportData));

    res.json({
      auditId: result.lastInsertRowid,
      overallWelfareScore: overallScore,
      report: reportData,
    });
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: 'Failed to generate audit report' });
  }
});

// GET /api/reports/audits — list past audits
router.get('/audits', (_req, res) => {
  try {
    const audits = db.prepare(
      `SELECT id, generated_at, overall_welfare_score, signature_status
       FROM welfare_audits ORDER BY generated_at DESC LIMIT 20`
    ).all();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
});

// GET /api/reports/:id — fetch details of a specific audit
router.get('/:id', (req, res) => {
  try {
    const audit = db.prepare(
      `SELECT * FROM welfare_audits WHERE id = ?`
    ).get(req.params.id);
    if (!audit) return res.status(404).json({ error: 'Audit not found' });
    res.json({
      id: audit.id,
      generated_at: audit.generated_at,
      overall_welfare_score: audit.overall_welfare_score,
      signature_status: audit.signature_status,
      report: JSON.parse(audit.report_data)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit details' });
  }
});

// PATCH /api/reports/:id/sign — digitally sign an audit report
router.patch('/:id/sign', (req, res) => {
  try {
    db.prepare(
      `UPDATE welfare_audits SET signature_status = 'Signed' WHERE id = ?`
    ).run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign audit report' });
  }
});

export default router;
