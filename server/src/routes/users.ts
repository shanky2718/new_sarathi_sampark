import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import { hashPassword } from '../utils/auth';

const router = Router();

// GET ALL USERS
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [users]: any = await pool.execute('SELECT id, name, email, mobile, role, company_name as companyName, gst_number as gstNumber, city, state, pincode, onboarded, created_at as createdAt FROM users ORDER BY id DESC');
      return res.json(users);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET USER BY ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (isMySQLConnected && pool) {
      const [users]: any = await pool.execute('SELECT id, name, email, mobile, role, company_name as companyName, gst_number as gstNumber, city, state, pincode, onboarded, created_at as createdAt FROM users WHERE id = ?', [id]);
      if (users.length === 0) return res.status(404).json({ error: 'User not found' });
      return res.json(users[0]);
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST CREATE USER
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, mobile, password, role, companyName, gstNumber, city, state, pincode } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashed = await hashPassword(password);
    const userRole = role || 'Transporter';

    if (isMySQLConnected && pool) {
      const [result]: any = await pool.execute(
        `INSERT INTO users (name, email, mobile, password_hash, role, company_name, gst_number, city, state, pincode, onboarded)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [name, email, mobile || null, hashed, userRole, companyName || 'Sarathi Transports', gstNumber || null, city || null, state || null, pincode || null]
      );
      return res.status(201).json({ id: result.insertId, name, email, mobile, role: userRole, companyName });
    }

    return res.status(201).json({ id: Date.now(), name, email, role: userRole });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT UPDATE USER
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mobile, role, companyName, gstNumber, city, state, pincode } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `UPDATE users SET name = ?, mobile = ?, role = ?, company_name = ?, gst_number = ?, city = ?, state = ?, pincode = ? WHERE id = ?`,
        [name, mobile || null, role, companyName, gstNumber || null, city || null, state || null, pincode || null, id]
      );
      return res.json({ message: 'User updated successfully' });
    }
    return res.json({ message: 'User updated' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE USER
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (isMySQLConnected && pool) {
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return res.json({ message: 'User deleted successfully' });
    }
    return res.json({ message: 'User deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
