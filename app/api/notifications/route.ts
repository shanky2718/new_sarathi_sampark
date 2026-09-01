import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows]: any = await pool.execute('SELECT * FROM notifications ORDER BY id DESC');
      const formatted = rows.map((n: any) => ({
        id: n.notif_id,
        type: n.type,
        message: n.message,
        time: n.time_ago,
        read: Boolean(n.is_read)
      }));
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
