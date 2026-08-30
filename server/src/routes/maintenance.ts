import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL MAINTENANCE RECORDS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM maintenance_records ORDER BY id DESC');
      const formatted = rows.map((m: any) => ({
        id: m.record_id,
        truckId: m.truck_id,
        plateNumber: m.plate_number,
        serviceType: m.service_type,
        scheduledDate: m.scheduled_date ? new Date(m.scheduled_date).toISOString().split('T')[0] : '2026-08-25',
        completedDate: m.completed_date ? new Date(m.completed_date).toISOString().split('T')[0] : null,
        cost: Number(m.cost),
        status: m.status,
        mechanicCenter: m.mechanic_center,
        notes: m.notes
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE MAINTENANCE RECORD
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { truckId, serviceType, scheduledDate, cost, mechanicCenter, notes } = req.body;
    const recordId = `MNT-${Math.floor(400 + Math.random() * 600)}`;

    if (isMySQLConnected && pool) {
      const [trucks]: any = await pool.execute('SELECT plate_number FROM trucks WHERE truck_id = ?', [truckId]);
      const plateNumber = trucks.length > 0 ? trucks[0].plate_number : truckId;

      await pool.execute(
        `INSERT INTO maintenance_records (record_id, truck_id, plate_number, service_type, scheduled_date, cost, status, mechanic_center, notes)
         VALUES (?, ?, ?, ?, ?, ?, 'Scheduled', ?, ?)`,
        [recordId, truckId, plateNumber, serviceType, scheduledDate || '2026-09-05', cost || 12000, mechanicCenter || 'Authorized Service Hub', notes || '']
      );

      // Update truck status to Maintenance
      await pool.execute('UPDATE trucks SET status = "Maintenance" WHERE truck_id = ?', [truckId]);
    }

    return res.status(201).json({
      id: recordId,
      truckId,
      serviceType,
      scheduledDate: scheduledDate || '2026-09-05',
      cost: cost || 12000,
      status: 'Scheduled',
      mechanicCenter: mechanicCenter || 'Authorized Service Hub',
      notes: notes || ''
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE STATUS
router.put('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const recordId = req.params.id;
    const { status } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `UPDATE maintenance_records SET status = ?, completed_date = IF(? = 'Completed', CURRENT_DATE(), completed_date) WHERE record_id = ?`,
        [status, status, recordId]
      );
    }
    return res.json({ success: true, recordId, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
