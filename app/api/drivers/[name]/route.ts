import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function PUT(req: Request, props: { params: Promise<{ name: string }> }) {
  try {
    const params = await props.params;
    const driverName = decodeURIComponent(params.name);
    const { assignedTruck, status, rating } = await req.json();

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `UPDATE drivers SET assigned_truck = COALESCE(?, assigned_truck), status = COALESCE(?, status), rating = COALESCE(?, rating)
         WHERE name = ?`,
        [assignedTruck || null, status || null, rating || null, driverName]
      );
    }
    return NextResponse.json({ success: true, driverName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
