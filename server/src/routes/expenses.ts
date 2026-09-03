import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';
import memoryStore from '../config/memoryStore';

const router = Router();

// GET ALL EXPENSES
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows]: any = await pool.execute('SELECT * FROM expenses ORDER BY id DESC');
      const formatted = rows.map((e: any) => ({
        expenseId: e.expense_id,
        category: e.category,
        amount: Number(e.amount),
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : '2026-08-28',
        truck: e.truck,
        description: e.description
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.getExpenses());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE EXPENSE
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { category, amount, date, truck, description } = req.body;
    const expenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;

    if (isMySQLConnected && pool) {
      await pool.execute(
        `INSERT INTO expenses (expense_id, category, amount, date, truck, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [expenseId, category || 'Other', amount || 1000, date || '2026-08-28', truck || 'TRK-101', description || 'Fleet Expense']
      );
    }

    const created = memoryStore.addExpense({
      category: category || 'Other',
      amount: amount || 1000,
      date: date || new Date().toISOString().split('T')[0],
      truck: truck || 'TRK-101',
      description: description || 'Fleet Expense'
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
