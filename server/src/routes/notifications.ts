import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL NOTIFICATIONS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM notifications ORDER BY id DESC');
      const formatted = rows.map((n: any) => ({
        id: n.notif_id,
        type: n.type,
        message: n.message,
        time: n.time_ago,
        read: Boolean(n.is_read)
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// MARK NOTIFICATION READ
router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const notifId = req.params.id;

    if (isMySQLConnected && pool) {
      await pool.execute('UPDATE notifications SET is_read = TRUE WHERE notif_id = ?', [notifId]);
    }
    return res.json({ success: true, id: notifId, read: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
