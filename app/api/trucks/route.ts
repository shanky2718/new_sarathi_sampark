import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const pool = await getDbPool();
    if (pool) {
      const user = getUserFromRequest(req);
      const userId = user?.id;
      const isAdmin = user?.role === 'Admin';
      
      let sql = 'SELECT * FROM trucks ORDER BY id DESC';
      let params: any[] = [];

      if (!isAdmin && userId) {
        sql = 'SELECT * FROM trucks WHERE user_id = ? OR user_id IS NULL ORDER BY id DESC';
        params = [userId];
      }

      const [rows]: any = await pool.execute(sql, params);
      const formatted = rows.map((t: any) => ({
        truckId: t.truck_id,
        plateNumber: t.plate_number,
        model: t.model,
        type: t.type,
        capacity: t.capacity,
        driver: t.driver,
        status: t.status,
        location: t.location,
        fuel: t.fuel,
        mileage: t.mileage,
        nextService: t.next_service ? new Date(t.next_service).toISOString().split('T')[0] : '2026-09-15',
        insuranceExpiry: t.insurance_expiry ? new Date(t.insurance_expiry).toISOString().split('T')[0] : '2027-02-14',
        fitnessExpiry: t.fitness_expiry ? new Date(t.fitness_expiry).toISOString().split('T')[0] : '2027-05-10',
        pucExpiry: t.puc_expiry ? new Date(t.puc_expiry).toISOString().split('T')[0] : '2026-12-05'
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
    const body = await req.json();
    const user = getUserFromRequest(req);
    const userId = user?.id || null;
    const { truckId, plateNumber, model, type, capacity, driver, status, location, fuel, mileage } = body;
    const tId = truckId || `TRK-${Math.floor(120 + Math.random() * 800)}`;
    const pNo = plateNumber || `KA-01-MJ-${Math.floor(1000 + Math.random() * 8999)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO trucks (user_id, truck_id, plate_number, model, type, capacity, driver, status, location, fuel, mileage, next_service, insurance_expiry, fitness_expiry, puc_expiry)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2026-12-01', '2027-06-15', '2027-09-20', '2027-01-10')`,
        [userId, tId, pNo, model || 'Tata Prima', type || 'Container', capacity || '20 Tons', driver || 'Unassigned', status || 'Available', location || 'Bengaluru', fuel || 100, mileage || 0]
      );
    }
    return NextResponse.json({
      truckId: tId,
      plateNumber: pNo,
      model: model || 'Tata Prima',
      type: type || 'Container',
      capacity: capacity || '20 Tons',
      driver: driver || 'Unassigned',
      status: status || 'Available',
      location: location || 'Bengaluru',
      fuel: fuel || 100,
      mileage: mileage || 0
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
