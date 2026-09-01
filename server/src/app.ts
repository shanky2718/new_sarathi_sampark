import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isMySQLConnected } from './config/database';

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
app.use(cors());
app.use(express.json());

// Initialize MySQL asynchronously if connected
initDatabase().catch(err => console.error('Database initialization error:', err));

// Mount API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/loads', loadsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/fuel', fuelRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/revenue', revenueRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(), 
    database: isMySQLConnected ? 'MySQL (Connected)' : 'Fallback Local Data Mode'
  });
});

// Centralized Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
