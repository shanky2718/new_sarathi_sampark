import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ALL RETURN LOADS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM return_loads ORDER BY id DESC');
      const formatted = rows.map((l: any) => ({
        loadId: l.load_id,
        pickup: l.pickup,
        destination: l.destination,
        distance: l.distance,
        cargo: l.cargo,
        weight: l.weight,
        offeredPrice: Number(l.offered_price),
        estimatedFuelCost: Number(l.estimated_fuel_cost),
        estimatedProfit: Number(l.estimated_profit),
        verifiedShipper: Boolean(l.verified_shipper),
        shipperName: l.shipper_name,
        shipperRating: Number(l.shipper_rating),
        postedTime: l.posted_time,
        status: l.status,
        pickupDate: l.pickup_date ? new Date(l.pickup_date).toISOString().split('T')[0] : '2026-08-29',
        requiredTruckType: l.required_truck_type,
        acceptedByTruck: l.accepted_by_truck,
        acceptedAt: l.accepted_at
      }));
      return res.json(formatted);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST NEW RETURN LOAD
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { pickup, destination, distance, cargo, weight, offeredPrice, estimatedFuelCost, shipperName, requiredTruckType } = req.body;
    const loadId = `LOAD #SS-${Math.floor(2050 + Math.random() * 500)}`;
    const price = Number(offeredPrice) || 20000;
    const fuelCost = Number(estimatedFuelCost) || 6000;
    const profit = price - fuelCost;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO return_loads (load_id, pickup, destination, distance, cargo, weight, offered_price, estimated_fuel_cost, estimated_profit, verified_shipper, shipper_name, shipper_rating, posted_time, status, pickup_date, required_truck_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, 4.80, 'Just now', 'Available', CURRENT_DATE(), ?)`,
        [loadId, pickup, destination, distance || 350, cargo, weight || '10 Tons', price, fuelCost, profit, shipperName || 'Verified Shipper', requiredTruckType || 'Container']
      );

      // Create notification
      await pool.execute(
        `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'info', ?, 'Just now', FALSE)`,
        [`NOT-${Date.now().toString().slice(-4)}`, `New Return Load ${loadId} posted for ${pickup} → ${destination}.`]
      );
    }

    return res.status(201).json({
      loadId,
      pickup,
      destination,
      distance: distance || 350,
      cargo,
      weight: weight || '10 Tons',
      offeredPrice: price,
      estimatedFuelCost: fuelCost,
      estimatedProfit: profit,
      verifiedShipper: true,
      shipperName: shipperName || 'Verified Shipper',
      shipperRating: 4.80,
      postedTime: 'Just now',
      status: 'Available'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ACCEPT RETURN LOAD
router.post('/accept', async (req: AuthRequest, res: Response) => {
  try {
    const { loadId, truckId } = req.body;
    if (!loadId || !truckId) {
      return res.status(400).json({ error: 'loadId and truckId are required' });
    }

    if (isMySQLConnected && pool) {
      // 1. Fetch load details
      const [loads]: any = await pool.execute('SELECT * FROM return_loads WHERE load_id = ?', [loadId]);
      if (loads.length === 0) return res.status(404).json({ error: 'Load not found' });
      const load = loads[0];

      if (load.status !== 'Available') {
        return res.status(400).json({ error: 'Load is no longer available' });
      }

      // 2. Fetch selected truck details
      const [trucks]: any = await pool.execute('SELECT * FROM trucks WHERE truck_id = ?', [truckId]);
      const driverName = trucks.length > 0 && trucks[0].driver !== 'Unassigned' ? trucks[0].driver : 'Rahul Kumar';

      // 3. Update Return Load status to Accepted
      await pool.execute(
        `UPDATE return_loads SET status = 'Accepted', accepted_by_truck = ?, accepted_at = NOW() WHERE load_id = ?`,
        [truckId, loadId]
      );

      // 4. Create Trip
      const tripId = `TRP-${Math.floor(550 + Math.random() * 450)}`;
      await pool.execute(
        `INSERT INTO trips (trip_id, truck, driver, origin, destination, distance, start_time, eta, status, progress, current_lat, current_lng)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Progress', 0, 12.971598, 77.594566)`,
        [tripId, truckId, driverName, load.pickup, load.destination, load.distance]
      );

      // 5. Update Truck status to Active
      await pool.execute(
        `UPDATE trucks SET status = 'Active', location = ? WHERE truck_id = ?`,
        [load.pickup, truckId]
      );

      // 6. Create Delivery Record
      const deliveryId = `DLV-${Math.floor(300 + Math.random() * 600)}`;
      await pool.execute(
        `INSERT INTO deliveries (delivery_id, customer, pickup, destination, truck, driver, expected_delivery, status)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Transit')`,
        [deliveryId, load.shipper_name, load.pickup, load.destination, truckId, driverName]
      );

      // 7. Push Notification
      await pool.execute(
        `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'success', ?, 'Just now', FALSE)`,
        [`NOT-${Date.now().toString().slice(-4)}`, `Return Load ${loadId} (${load.pickup} → ${load.destination}) ACCEPTED! Assigned to Truck ${truckId}.`]
      );

      return res.json({
        success: true,
        message: `Load ${loadId} accepted and assigned to Truck ${truckId}`,
        tripId
      });
    }

    return res.json({ success: true, message: `Load ${loadId} accepted` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
