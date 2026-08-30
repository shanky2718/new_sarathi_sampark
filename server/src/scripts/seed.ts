import { initDatabase } from '../config/database';

async function runSeed() {
  console.log('🌱 Starting Sarathi Sampark MySQL Database Seed script...');
  await initDatabase();
  console.log('✅ MySQL Database seeding completed.');
  process.exit(0);
}

runSeed();
