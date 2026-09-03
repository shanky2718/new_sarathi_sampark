import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import memoryStore from '../config/memoryStore';

const router = Router();

// POST /api/contact - Submit public website contact form
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, mobile, company, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields' });
    }

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO contact_messages (name, email, mobile, company, subject, message, status)
         VALUES (?, ?, ?, ?, ?, ?, 'Unread')`,
        [name, email, mobile || null, company || null, subject || 'Platform Inquiry', message]
      );

      // Create Admin notification
      await pool.execute(
        `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'info', ?, 'Just now', FALSE)`,
        [`NOT-${Date.now().toString().slice(-4)}`, `New Contact Inquiry from ${name} (${email}): "${subject}"`]
      );
    }

    memoryStore.addContactMessage({ name, email, mobile, company, subject, message });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Samparka Sarathi! Our logistics technical specialist will contact you shortly.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error while saving contact message' });
  }
});

// GET /api/contact - Retrieve all contact messages (Admin)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM contact_messages ORDER BY id DESC');
      return res.json(rows);
    }
    return res.json(memoryStore.getContactMessages());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
