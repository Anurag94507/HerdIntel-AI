import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/finances — Retrieve financial summary and transactions
router.get('/', (req, res) => {
  try {
    const summary = db.prepare(`
      SELECT 
        SUM(CASE WHEN entry_type = 'Sale' THEN amount ELSE 0 END) as totalSales,
        SUM(CASE WHEN entry_type = 'Expenditure' THEN amount ELSE 0 END) as totalExpenditures
      FROM farmer_finances
    `).get();

    const transactions = db.prepare(`
      SELECT * FROM farmer_finances 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all();

    const sales = summary.totalSales || 0;
    const expenses = summary.totalExpenditures || 0;
    const profit = sales - expenses;

    res.json({
      summary: {
        totalSales: sales,
        totalExpenditures: expenses,
        netProfit: profit
      },
      transactions
    });
  } catch (err) {
    console.error('Finances fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch financial record' });
  }
});

// POST /api/finances — Add manual transaction entry
router.post('/', (req, res) => {
  try {
    const { entry_type, amount, category, description } = req.body;

    if (!entry_type || !amount) {
      return res.status(400).json({ error: 'Entry type and amount are required' });
    }

    const result = db.prepare(`
      INSERT INTO farmer_finances (entry_type, amount, category, description)
      VALUES (?, ?, ?, ?)
    `).run(entry_type, Number(amount), category || 'General', description || '');

    res.json({
      success: true,
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Finances log error:', err);
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

// DELETE /api/finances/:id — Delete transaction entry
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM farmer_finances WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Finances delete error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
