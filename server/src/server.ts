import app from './app';
import { initDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Express Server
const startServer = async () => {
  await initDatabase();
  
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Sarathi Sampark Express API running on port ${PORT}`);
  });
};

startServer();
