import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from process.env, root .env, or server/.env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'Shashv@2715';
const DB_NAME = process.env.DB_NAME || 'sarathi_sampark_db';

let pool: mysql.Pool | null = null;
export let isMySQLConnected = false;
export let lastConnectionError: string | null = null;

export async function getDbPool(): Promise<mysql.Pool | null> {
  if (pool) return pool;
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
      connectTimeout: 5000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
    isMySQLConnected = true;
    return pool;
  } catch (err: any) {
    isMySQLConnected = false;
    lastConnectionError = err.message;
    console.warn('MySQL pool initialization error:', err.message);
    return null;
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = await getDbPool();
  if (!p) {
    throw new Error(`Database Error: ${lastConnectionError || 'Database connection pool offline'}`);
  }
  const [results] = await p.execute(sql, params);
  return results as T;
}

export default { query, getDbPool };
