import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isMySQLConnected, lastConnectionError } from './config/database';

// Import Routers
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import trucksRouter from './routes/trucks';
import driversRouter from './routes/drivers';
import loadsRouter from './routes/loads';
import tripsRouter from './routes/trips';
import deliveriesRouter from './routes/deliveries';
import documentsRouter from './routes/documents';
import fuelRouter from './routes/fuel';
import maintenanceRouter from './routes/maintenance';
import expensesRouter from './routes/expenses';
import revenueRouter from './routes/revenue';
import analyticsRouter from './routes/analytics';
import notificationsRouter from './routes/notifications';
import adminRouter from './routes/admin';
import contactRouter from './routes/contact';

dotenv.config();

export const app = express();

// Express Middleware
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Normalize API route prefix for Vercel serverless functions
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && !req.path.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Initialize MySQL asynchronously if connected
initDatabase().catch(err => console.error('Database initialization error:', err));

// Helper to mount routes on both /api/path and /path
const mount = (routePath: string, router: any) => {
  app.use(`/api${routePath}`, router);
  app.use(routePath, router);
};

mount('/auth', authRouter);
mount('/users', usersRouter);
mount('/trucks', trucksRouter);
mount('/drivers', driversRouter);
mount('/loads', loadsRouter);
mount('/trips', tripsRouter);
mount('/deliveries', deliveriesRouter);
mount('/documents', documentsRouter);
mount('/fuel', fuelRouter);
mount('/maintenance', maintenanceRouter);
mount('/expenses', expensesRouter);
mount('/revenue', revenueRouter);
mount('/analytics', analyticsRouter);
mount('/notifications', notificationsRouter);
mount('/admin', adminRouter);
mount('/contact', contactRouter);

// Health check API endpoint
app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(), 
    database: isMySQLConnected ? 'MySQL (Connected)' : 'Fallback Local Data Mode',
    connectionError: lastConnectionError || null
  });
});

// Centralized Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
