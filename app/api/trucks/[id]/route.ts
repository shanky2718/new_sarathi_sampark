import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const truckId = params.id;
    const { status, driver, location, fuel, mileage } = await req.json();

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `UPDATE trucks SET status = COALESCE(?, status), driver = COALESCE(?, driver), location = COALESCE(?, location), fuel = COALESCE(?, fuel), mileage = COALESCE(?, mileage)
         WHERE truck_id = ?`,
        [status || null, driver || null, location || null, fuel || null, mileage || null, truckId]
      );
    }
    return NextResponse.json({ success: true, truckId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
