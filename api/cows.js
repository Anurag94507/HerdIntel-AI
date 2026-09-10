export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const cows = [
    { id: 1, tag_number: '401', breed: 'Holstein', birth_date: '2020-03-15', current_status: 'Healthy' },
    { id: 2, tag_number: '402', breed: 'Holstein', birth_date: '2019-11-22', current_status: 'Under Observation' },
    { id: 3, tag_number: '403', breed: 'Jersey', birth_date: '2021-06-10', current_status: 'Healthy' },
    { id: 4, tag_number: '404', breed: 'Guernsey', birth_date: '2020-09-05', current_status: 'Healthy' },
    { id: 5, tag_number: '405', breed: 'Brown Swiss', birth_date: '2021-01-18', current_status: 'Healthy' },
    { id: 6, tag_number: '406', breed: 'Ayrshire', birth_date: '2022-04-30', current_status: 'Healthy' },
    { id: 7, tag_number: '407', breed: 'Holstein', birth_date: '2020-07-12', current_status: 'Healthy' },
    { id: 8, tag_number: '408', breed: 'Jersey', birth_date: '2021-11-03', current_status: 'Healthy' },
    { id: 9, tag_number: '409', breed: 'Holstein', birth_date: '2019-08-25', current_status: 'Lactating' },
    { id: 10, tag_number: '410', breed: 'Brown Swiss', birth_date: '2022-02-14', current_status: 'Healthy' }
  ];

  const telemetry = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1, cow_id: 2, timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    location_zone: i % 2 === 0 ? 'Barn-A' : 'Pasture-North', isolation_score: 40 + (i * 2), audio_cough_count: Math.floor(i / 3)
  }));

  const alerts = [
    {
      id: 1, cow_id: 2, created_at: new Date(Date.now() - 3600000).toISOString(),
      risk_level: 'High', alert_type: 'Severe Isolation & Cough Spike',
      description: 'Cow #402 exhibits 94% isolation score and 9 coughs/hr.', resolution_status: 'Open'
    }
  ];

  return res.status(200).json({
    cow: cows[1],
    stats: { avgIsolation: 34.2, maxIsolation: 94, avgCough: 1.4, maxCough: 9 },
    telemetry,
    alerts
  });
}
