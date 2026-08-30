import { Router, Response } from 'express';
import { AuthRequest, authenticateToken, requireAdmin } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import { logAuditAction } from '../utils/auditLogger';

const router = Router();

// ENFORCE STRICT BACKEND AUTHORIZATION:
// Every single endpoint in /api/admin/* requires authentication AND role === 'Admin'
// Non-admin users attempting to access any admin endpoint receive HTTP 403 Forbidden.
router.use(authenticateToken, requireAdmin);

// 1. GET ADMIN OVERVIEW DASHBOARD STATS
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [usersCount]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
      const [adminsCount]: any = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "Admin"');
      const [trucksCount]: any = await pool.execute('SELECT COUNT(*) as count FROM trucks');
      const [loadsCount]: any = await pool.execute('SELECT COUNT(*) as count FROM return_loads');
      const [tripsCount]: any = await pool.execute('SELECT COUNT(*) as count FROM trips');
      const [docsCount]: any = await pool.execute('SELECT COUNT(*) as count FROM digital_documents WHERE status = "Pending"');

      return res.json({
        totalUsers: usersCount[0].count,
        totalAdmins: adminsCount[0].count,
        totalTrucks: trucksCount[0].count,
        totalLoads: loadsCount[0].count,
        totalTrips: tripsCount[0].count,
        pendingDocuments: docsCount[0].count
      });
    }
    return res.json({ totalUsers: 0, totalAdmins: 0, totalTrucks: 0, totalLoads: 0, totalTrips: 0, pendingDocuments: 0 });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. GET ALL USERS (ADMIN)
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute(
        'SELECT id, name, email, mobile, role, company_name, gst_number, city, onboarded, created_at FROM users ORDER BY id DESC'
      );
      return res.json(rows);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. GET LOGIN HISTORY (ADMIN)
router.get('/login-history', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute(
        `SELECT lh.id, lh.user_id, lh.email, lh.login_time, lh.logout_time, lh.status, lh.ip_address, lh.user_agent, u.name, u.role 
         FROM login_history lh 
         LEFT JOIN users u ON lh.user_id = u.id 
         ORDER BY lh.id DESC LIMIT 100`
      );
      return res.json(rows);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. GET AUDIT LOGS (ADMIN)
router.get('/audit-logs', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100');
      return res.json(rows);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 5. GET TRANSPORTERS VERIFICATION QUEUE
router.get('/transporters', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM transporter_verifications ORDER BY id DESC');
      const formatted = rows.map((t: any) => ({
        id: t.verification_id,
        companyName: t.company_name,
        ownerName: t.owner_name,
        gstNumber: t.gst_number,
        truckCount: t.truck_count,
        mobile: t.mobile,
        city: t.city,
        status: t.status,
        submittedDate: t.submitted_date ? new Date(t.submitted_date).toISOString().split('T')[0] : '2026-08-27'
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 6. VERIFY TRANSPORTER
router.put('/transporters/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute('UPDATE transporter_verifications SET status = ? WHERE verification_id = ?', [status, id]);
      await logAuditAction(req.user?.id || 1, req.user?.email || 'admin@sarathi.in', 'admin_verify_transporter', `Transporter ${id} status set to ${status}`);
    }
    return res.json({ success: true, id, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 7. GET SHIPPERS VERIFICATION QUEUE
router.get('/shippers', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM shipper_verifications ORDER BY id DESC');
      const formatted = rows.map((s: any) => ({
        id: s.verification_id,
        companyName: s.company_name,
        contactPerson: s.contact_person,
        gstNumber: s.gst_number,
        loadsPosted: s.loads_posted,
        mobile: s.mobile,
        city: s.city,
        status: s.status,
        submittedDate: s.submitted_date ? new Date(s.submitted_date).toISOString().split('T')[0] : '2026-08-26'
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 8. VERIFY SHIPPER
router.put('/shippers/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute('UPDATE shipper_verifications SET status = ? WHERE verification_id = ?', [status, id]);
      await logAuditAction(req.user?.id || 1, req.user?.email || 'admin@sarathi.in', 'admin_verify_shipper', `Shipper ${id} status set to ${status}`);
    }
    return res.json({ success: true, id, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 9. GET ANALYTICS & USER DISTRIBUTIONS
router.get('/analytics', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [roleDist]: any = await pool.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
      const [loadDist]: any = await pool.execute('SELECT status, COUNT(*) as count FROM return_loads GROUP BY status');
      const [tripDist]: any = await pool.execute('SELECT status, COUNT(*) as count FROM trips GROUP BY status');
      return res.json({ roleDist, loadDist, tripDist });
    }
    return res.json({ roleDist: [], loadDist: [], tripDist: [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
