import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
const DB_NAME = process.env.DB_NAME || 'sarathi_sampark_db';

export let pool: mysql.Pool | null = null;
export let isMySQLConnected = false;
export let lastConnectionError: string | null = null;

// Initialize MySQL Pool strictly using environment variables
export async function initDatabase(): Promise<boolean> {
  try {
    // 1. Create Connection Pool directly using environment credentials
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      multipleStatements: true,
      connectTimeout: 5000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });

    // 2. Test pool connection
    const connection = await pool.getConnection();
    connection.release();
    
    isMySQLConnected = true;
    lastConnectionError = null;

    console.log('==========================================');
    console.log('MYSQL STATUS: CONNECTED');
    console.log(`DATABASE: ${DB_NAME}`);
    console.log(`HOST: ${DB_HOST}:${DB_PORT}`);
    console.log('==========================================');

    // 3. Run Schema DDL if tables do not exist
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ MySQL Database Schema verified/created successfully.');
    }

    return true;
  } catch (error: any) {
    isMySQLConnected = false;
    lastConnectionError = error.message;

    console.error('==========================================');
    console.error('MYSQL STATUS: DISCONNECTED');
    console.error(`DATABASE: ${DB_NAME}`);
    console.error(`ERROR REASON: ${error.message}`);
    console.error('==========================================');
    return false;
  }
}

// Parameterized Query Helper - strictly throws error if MySQL is disconnected
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  if (!isMySQLConnected || !pool) {
    throw new Error(`MySQL Database Error: ${lastConnectionError || 'Database connection pool is offline'}`);
  }
  const [results] = await pool.execute(sql, params);
  return results as T;
}

export default { initDatabase, query, pool, isMySQLConnected };
