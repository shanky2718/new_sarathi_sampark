import { initDatabase } from './database';

export const connectDB = async () => {
  return initDatabase();
};

export default connectDB;
