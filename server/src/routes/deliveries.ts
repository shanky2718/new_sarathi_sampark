import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL DELIVERIES
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM deliveries ORDER BY id DESC');
      const formatted = rows.map((d: any) => ({
        deliveryId: d.delivery_id,
        customer: d.customer,
        pickup: d.pickup,
        destination: d.destination,
        truck: d.truck,
        driver: d.driver,
        expectedDelivery: d.expected_delivery,
        status: d.status
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE DELIVERY
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { customer, pickup, destination, truck, driver } = req.body;
    const deliveryId = `DLV-${Math.floor(200 + Math.random() * 800)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO deliveries (delivery_id, customer, pickup, destination, truck, driver, expected_delivery, status)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Transit')`,
        [deliveryId, customer, pickup, destination, truck, driver]
      );
    }

    return res.status(201).json({
      deliveryId,
      customer,
      pickup,
      destination,
      truck,
      driver,
      status: 'In Transit'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE DELIVERY STATUS
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const deliveryId = req.params.id;
    const { status } = req.body;

    if (isMySQLConnected && pool) {
      await pool.execute('UPDATE deliveries SET status = ? WHERE delivery_id = ?', [status, deliveryId]);
      if (status === 'Delivered') {
        await pool.execute(
          `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'success', ?, 'Just now', FALSE)`,
          [`NOT-${Date.now().toString().slice(-4)}`, `Delivery ${deliveryId} has been DELIVERED successfully.`]
        );
      }
    }
    return res.json({ success: true, deliveryId, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
