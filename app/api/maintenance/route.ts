import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
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
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { truckId, serviceType, scheduledDate, cost, mechanicCenter, notes } = await req.json();
    const recordId = `MNT-${Math.floor(400 + Math.random() * 600)}`;

    const pool = await getDbPool();
    if (pool) {
      const [trucks]: any = await pool.execute('SELECT plate_number FROM trucks WHERE truck_id = ?', [truckId]);
      const plateNumber = trucks.length > 0 ? trucks[0].plate_number : truckId;

      await pool.execute(
        `INSERT INTO maintenance_records (record_id, truck_id, plate_number, service_type, scheduled_date, cost, status, mechanic_center, notes)
         VALUES (?, ?, ?, ?, ?, ?, 'Scheduled', ?, ?)`,
        [recordId, truckId, plateNumber, serviceType, scheduledDate || '2026-09-05', cost || 12000, mechanicCenter || 'Authorized Service Hub', notes || '']
      );

      await pool.execute('UPDATE trucks SET status = "Maintenance" WHERE truck_id = ?', [truckId]);
    }

    return NextResponse.json({
      id: recordId,
      truckId,
      serviceType,
      scheduledDate: scheduledDate || '2026-09-05',
      cost: cost || 12000,
      status: 'Scheduled',
      mechanicCenter: mechanicCenter || 'Authorized Service Hub',
      notes: notes || ''
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
