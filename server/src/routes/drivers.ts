import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import memoryStore from '../config/memoryStore';

const router = Router();

// GET ALL DRIVERS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM drivers ORDER BY id DESC');
      const formatted = rows.map((d: any) => ({
        name: d.name,
        phone: d.phone,
        photo: d.photo || '',
        assignedTruck: d.assigned_truck,
        tripsCompleted: d.trips_completed,
        rating: Number(d.rating),
        safetyScore: d.safety_score,
        licenseNumber: d.license_number,
        status: d.status
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.getDrivers());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE DRIVER
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, assignedTruck, licenseNumber } = req.body;
    const lNo = licenseNumber || `DL-${Math.floor(10000000000 + Math.random() * 89999999999)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO drivers (name, phone, assigned_truck, license_number, trips_completed, rating, safety_score, status)
         VALUES (?, ?, ?, ?, 0, 4.80, 95, 'Active')`,
        [name, phone, assignedTruck || 'Unassigned', lNo]
      );
    }

    const created = memoryStore.addDriver({
      name,
      phone,
      assignedTruck: assignedTruck || 'Unassigned',
      licenseNumber: lNo
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE DRIVER
router.put('/:name', async (req: AuthRequest, res: Response) => {
  try {
    const driverName = req.params.name;
    const { assignedTruck, status, rating } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `UPDATE drivers SET assigned_truck = COALESCE(?, assigned_truck), status = COALESCE(?, status), rating = COALESCE(?, rating)
         WHERE name = ?`,
        [assignedTruck || null, status || null, rating || null, driverName]
      );
    }
    return res.json({ success: true, driverName, updates: req.body });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
