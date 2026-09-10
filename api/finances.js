export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    summary: {
      totalSales: 15400,
      totalExpenditures: 4800,
      netProfit: 10600
    },
    transactions: [
      { id: 1, entry_type: 'Sale', amount: 15400, category: 'Milk Sales', description: 'Bulk morning milk delivery (350L)', created_at: new Date().toISOString() },
      { id: 2, entry_type: 'Expenditure', amount: 4800, category: 'Cattle Feed', description: 'High-protein fodder & mineral supplement', created_at: new Date(Date.now() - 86400000).toISOString() }
    ]
  });
}
