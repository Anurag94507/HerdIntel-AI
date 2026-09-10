import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.js';
import engineRoutes from './routes/engine.js';
import reportsRoutes from './routes/reports.js';
import alertsRoutes from './routes/alerts.js';
import cowsRoutes from './routes/cows.js';
import chatRoutes from './routes/chat.js';
import financesRoutes from './routes/finances.js';


const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Request logging ─────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// ── API Routes ──────────────────────────────────────────────────────
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/engine',    engineRoutes);
app.use('/api/reports',   reportsRoutes);
app.use('/api/alerts',    alertsRoutes);
app.use('/api/cows',      cowsRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/finances',  financesRoutes);



// ── Health check ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🐄  CowNet-AI Server running on http://localhost:${PORT}\n`);
});
