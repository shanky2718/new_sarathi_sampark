import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows]: any = await pool.execute('SELECT * FROM drivers ORDER BY id DESC');
      const formatted = rows.map((d: any) => ({
        name: d.name,
        phone: d.phone,
        photo: d.photo || '',
        assignedTruck: d.assigned_truck,
        tripsCompleted: d.trips_completed,
        rating: Number(d.rating),
        safetyScore: d.safety_score,
        licenseNumber: d.license_number,
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
    const { name, phone, assignedTruck, licenseNumber } = await req.json();
    const lNo = licenseNumber || `DL-${Math.floor(10000000000 + Math.random() * 89999999999)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO drivers (name, phone, assigned_truck, license_number, trips_completed, rating, safety_score, status)
         VALUES (?, ?, ?, ?, 0, 4.80, 95, 'Active')`,
        [name, phone, assignedTruck || 'Unassigned', lNo]
      );
    }
    return NextResponse.json({
      name,
      phone,
      assignedTruck: assignedTruck || 'Unassigned',
      licenseNumber: lNo,
      tripsCompleted: 0,
      rating: 4.80,
      safetyScore: 95,
      status: 'Active'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
