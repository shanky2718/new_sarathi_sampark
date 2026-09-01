import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
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
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { truck, driver, origin, destination, distance, status } = await req.json();
    const tripId = `TRP-${Math.floor(500 + Math.random() * 500)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO trips (trip_id, truck, driver, origin, destination, distance, start_time, eta, status, progress)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR), ?, 0)`,
        [tripId, truck, driver, origin, destination, distance || 300, status || 'In Progress']
      );

      await pool.execute('UPDATE trucks SET status = "Active", location = ? WHERE truck_id = ?', [origin, truck]);
    }

    return NextResponse.json({
      tripId,
      truck,
      driver,
      origin,
      destination,
      distance: distance || 300,
      status: status || 'In Progress',
      progress: 0
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
