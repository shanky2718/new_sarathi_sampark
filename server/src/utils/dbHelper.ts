import { query, pool, isMySQLConnected } from '../config/database';

export const isDbConnected = () => isMySQLConnected;

export const executeQuery = async (sql: string, params: any[] = []) => {
  return query(sql, params);
};

export default { isDbConnected, executeQuery };
