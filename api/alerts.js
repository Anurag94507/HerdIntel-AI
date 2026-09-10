export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json([
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
  ]);
}
