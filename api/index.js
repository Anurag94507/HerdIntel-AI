import express from 'express';
import cors from 'cors';
import dashboardRoutes from '../server/routes/dashboard.js';
import engineRoutes from '../server/routes/engine.js';
import reportsRoutes from '../server/routes/reports.js';
import alertsRoutes from '../server/routes/alerts.js';
import cowsRoutes from '../server/routes/cows.js';
import chatRoutes from '../server/routes/chat.js';
import financesRoutes from '../server/routes/finances.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/engine',    engineRoutes);
app.use('/api/reports',   reportsRoutes);
app.use('/api/alerts',    alertsRoutes);
app.use('/api/cows',      cowsRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/finances',  financesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', platform: 'vercel', timestamp: new Date().toISOString() });
});

export default function handler(req, res) {
  return app(req, res);
}
