import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import memoryStore from '../config/memoryStore';

const router = Router();

router.use(authenticateToken);

// GET ALL TRUCKS (Filtered by user_id for normal users, all for Admin)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'Admin';
      let sql = 'SELECT * FROM trucks ORDER BY id DESC';
      let params: any[] = [];

      if (!isAdmin && userId) {
        sql = 'SELECT * FROM trucks WHERE user_id = ? OR user_id IS NULL ORDER BY id DESC';
        params = [userId];
      }

      const [rows]: any = await pool.execute(sql, params);
      const formatted = rows.map((t: any) => ({
        truckId: t.truck_id,
        plateNumber: t.plate_number,
        model: t.model,
        type: t.type,
        capacity: t.capacity,
        driver: t.driver,
        status: t.status,
        location: t.location,
        fuel: t.fuel,
        mileage: t.mileage,
        nextService: t.next_service ? new Date(t.next_service).toISOString().split('T')[0] : '2026-09-15',
        insuranceExpiry: t.insurance_expiry ? new Date(t.insurance_expiry).toISOString().split('T')[0] : '2027-02-14',
        fitnessExpiry: t.fitness_expiry ? new Date(t.fitness_expiry).toISOString().split('T')[0] : '2027-05-10',
        pucExpiry: t.puc_expiry ? new Date(t.puc_expiry).toISOString().split('T')[0] : '2026-12-05'
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.getTrucks());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE TRUCK (Persists with user_id)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { truckId, plateNumber, model, type, capacity, driver, status, location, fuel, mileage } = req.body;
    const userId = req.user?.id || null;
    const tId = truckId || `TRK-${Math.floor(120 + Math.random() * 800)}`;
    const pNo = plateNumber || `KA-01-MJ-${Math.floor(1000 + Math.random() * 8999)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO trucks (user_id, truck_id, plate_number, model, type, capacity, driver, status, location, fuel, mileage, next_service, insurance_expiry, fitness_expiry, puc_expiry)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2026-12-01', '2027-06-15', '2027-09-20', '2027-01-10')`,
        [userId, tId, pNo, model || 'Tata Prima', type || 'Container', capacity || '20 Tons', driver || 'Unassigned', status || 'Available', location || 'Bengaluru', fuel || 100, mileage || 0]
      );
    }

    const newTruck = memoryStore.addTruck({
      truckId: tId,
      plateNumber: pNo,
      model: model || 'Tata Prima',
      type: type || 'Container',
      capacity: capacity || '20 Tons',
      driver: driver || 'Unassigned',
      status: status || 'Available',
      location: location || 'Bengaluru',
      fuel: fuel || 100,
      mileage: mileage || 0
    });

    return res.status(201).json(newTruck);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE TRUCK
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const truckId = req.params.id;
    const { status, driver, location, fuel, mileage } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `UPDATE trucks SET status = COALESCE(?, status), driver = COALESCE(?, driver), location = COALESCE(?, location), fuel = COALESCE(?, fuel), mileage = COALESCE(?, mileage)
         WHERE truck_id = ?`,
        [status || null, driver || null, location || null, fuel || null, mileage || null, truckId]
      );
    }
    return res.json({ success: true, truckId, updates: req.body });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
