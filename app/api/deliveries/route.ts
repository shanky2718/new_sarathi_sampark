import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
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
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { customer, pickup, destination, truck, driver } = await req.json();
    const deliveryId = `DLV-${Math.floor(200 + Math.random() * 800)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO deliveries (delivery_id, customer, pickup, destination, truck, driver, expected_delivery, status)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR), 'In Transit')`,
        [deliveryId, customer, pickup, destination, truck, driver]
      );
    }

    return NextResponse.json({
      deliveryId,
      customer,
      pickup,
      destination,
      truck,
      driver,
      status: 'In Transit'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
