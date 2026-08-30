export interface IExpense {
  id: number;
  userId?: number;
  expenseId: string;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Driver Expenses' | 'Insurance' | 'Other';
  amount: number;
  date: string;
  truck: string;
  description: string;
}
