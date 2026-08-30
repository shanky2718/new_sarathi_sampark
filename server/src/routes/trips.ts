import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL TRIPS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM trips ORDER BY id DESC');
      const formatted = rows.map((t: any) => ({
        tripId: t.trip_id,
        truck: t.truck,
        driver: t.driver,
        origin: t.origin,
        destination: t.destination,
        distance: t.distance,
        startTime: t.start_time,
        eta: t.eta,
        status: t.status,
        progress: t.progress,
        currentLatLng: { lat: Number(t.current_lat || 12.97), lng: Number(t.current_lng || 77.59) }
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE TRIP
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { truck, driver, origin, destination, distance, status } = req.body;
    const tripId = `TRP-${Math.floor(500 + Math.random() * 500)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO trips (trip_id, truck, driver, origin, destination, distance, start_time, eta, status, progress)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR), ?, 0)`,
        [tripId, truck, driver, origin, destination, distance || 300, status || 'In Progress']
      );

      // Update truck status
      await pool.execute('UPDATE trucks SET status = "Active", location = ? WHERE truck_id = ?', [origin, truck]);
    }

    return res.status(201).json({
      tripId,
      truck,
      driver,
      origin,
      destination,
      distance: distance || 300,
      status: status || 'In Progress',
      progress: 0
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE TRIP
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id;
    const { status, progress } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `UPDATE trips SET status = COALESCE(?, status), progress = COALESCE(?, progress) WHERE trip_id = ?`,
        [status || null, progress !== undefined ? progress : null, tripId]
      );
    }
    return res.json({ success: true, tripId, updates: req.body });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
