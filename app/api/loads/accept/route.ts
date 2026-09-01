import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { loadId, truckId } = await req.json();
    if (!loadId || !truckId) {
      return NextResponse.json({ error: 'loadId and truckId are required' }, { status: 400 });
    }

    const pool = await getDbPool();
    if (pool) {
      const [loads]: any = await pool.execute('SELECT * FROM return_loads WHERE load_id = ?', [loadId]);
      if (loads.length === 0) return NextResponse.json({ error: 'Load not found' }, { status: 404 });
      const load = loads[0];

      if (load.status !== 'Available') {
        return NextResponse.json({ error: 'Load is no longer available' }, { status: 400 });
      }

      const [trucks]: any = await pool.execute('SELECT * FROM trucks WHERE truck_id = ?', [truckId]);
      const driverName = trucks.length > 0 && trucks[0].driver !== 'Unassigned' ? trucks[0].driver : 'Rahul Kumar';

      await pool.execute(
        `UPDATE return_loads SET status = 'Accepted', accepted_by_truck = ?, accepted_at = NOW() WHERE load_id = ?`,
        [truckId, loadId]
      );

      const tripId = `TRP-${Math.floor(550 + Math.random() * 450)}`;
      await pool.execute(
        `INSERT INTO trips (trip_id, truck, driver, origin, destination, distance, start_time, eta, status, progress, current_lat, current_lng)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Progress', 0, 12.971598, 77.594566)`,
        [tripId, truckId, driverName, load.pickup, load.destination, load.distance]
      );

      await pool.execute(
        `UPDATE trucks SET status = 'Active', location = ? WHERE truck_id = ?`,
        [load.pickup, truckId]
      );

      const deliveryId = `DLV-${Math.floor(300 + Math.random() * 600)}`;
      await pool.execute(
        `INSERT INTO deliveries (delivery_id, customer, pickup, destination, truck, driver, expected_delivery, status)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Transit')`,
        [deliveryId, load.shipper_name, load.pickup, load.destination, truckId, driverName]
      );

      await pool.execute(
        `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'success', ?, 'Just now', FALSE)`,
        [`NOT-${Date.now().toString().slice(-4)}`, `Return Load ${loadId} (${load.pickup} → ${load.destination}) ACCEPTED! Assigned to Truck ${truckId}.`]
      );

      return NextResponse.json({
        success: true,
        message: `Load ${loadId} accepted and assigned to Truck ${truckId}`,
        tripId
      });
    }

    return NextResponse.json({ success: true, message: `Load ${loadId} accepted` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
