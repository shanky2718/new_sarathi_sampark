import { pool, isMySQLConnected } from '../config/database';

export async function logAuditAction(
  userId: number | string | null,
  userEmail: string,
  action: string,
  details?: string,
  ipAddress?: string
): Promise<void> {
  try {
    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO audit_logs (user_id, user_email, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
        [userId || null, userEmail || 'system@sarathi.in', action, details || null, ipAddress || '127.0.0.1']
      );
    }
    console.log(`📌 [AUDIT LOG] ${action} | User: ${userEmail} | Details: ${details || 'N/A'}`);
  } catch (err) {
    console.error('Audit Logging Error:', err);
  }
}
