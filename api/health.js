export default function handler(_req, res) {
  res.status(200).json({ status: 'ok', service: 'HerdIntel-AI API', timestamp: new Date().toISOString() });
}
