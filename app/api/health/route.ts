import { NextResponse } from 'next/server';
import { getDbPool, isMySQLConnected } from '@/lib/db';

export async function GET() {
  const pool = await getDbPool();
  return NextResponse.json({
    status: 'UP',
    framework: 'Next.js App Router',
    timestamp: new Date().toISOString(),
    database: pool ? 'MySQL (Connected)' : 'Disconnected / Fallback Mode'
  });
}
