import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows]: any = await pool.execute('SELECT * FROM expenses ORDER BY id DESC');
      const formatted = rows.map((e: any) => ({
        expenseId: e.expense_id,
        category: e.category,
        amount: Number(e.amount),
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : '2026-08-28',
        truck: e.truck,
        description: e.description
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
    const { category, amount, date, truck, description } = await req.json();
    const expenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO expenses (expense_id, category, amount, date, truck, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [expenseId, category || 'Other', amount || 1000, date || '2026-08-28', truck || 'TRK-101', description || 'Fleet Expense']
      );
    }

    return NextResponse.json({
      expenseId,
      category: category || 'Other',
      amount: amount || 1000,
      date: date || '2026-08-28',
      truck: truck || 'TRK-101',
      description: description || 'Fleet Expense'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
