import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isMySQLConnected } from './config/database';

// Import Routers
import authRouter from './routes/auth';
import trucksRouter from './routes/trucks';
import driversRouter from './routes/drivers';
import loadsRouter from './routes/loads';
import tripsRouter from './routes/trips';
import deliveriesRouter from './routes/deliveries';
import documentsRouter from './routes/documents';
import fuelRouter from './routes/fuel';
import maintenanceRouter from './routes/maintenance';
import expensesRouter from './routes/expenses';
import notificationsRouter from './routes/notifications';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/loads', loadsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/fuel', fuelRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(), 
    database: isMySQLConnected ? 'MySQL (Connected)' : 'Fallback Local Data Mode'
  });
});

// Initialize MySQL Database & Start Express API Server
const startServer = async () => {
  await initDatabase();
  
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Sarathi Sampark Express API running on port ${PORT}`);
  });
};

startServer();
