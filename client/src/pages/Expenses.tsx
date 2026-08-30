import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Calendar, ClipboardList, TrendingDown, ArrowUpRight, CreditCard, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Expense creation form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Fuel',
    amount: '',
    date: '',
    truck: 'TRK-101',
    description: ''
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await api.expenses.getAll();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.truck) return;

    try {
      const created = await api.expenses.create(formData);
      setExpenses(prev => [created, ...prev]);
      setShowAddForm(false);
      setFormData({
        category: 'Fuel',
        amount: '',
        date: '',
        truck: 'TRK-101',
        description: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const totalOutlay = expenses.reduce((sum, item) => sum + item.amount, 0);
  const fuelOutlay = expenses.filter(e => e.category === 'Fuel').reduce((sum, item) => sum + item.amount, 0);
  const maintOutlay = expenses.filter(e => e.category === 'Maintenance').reduce((sum, item) => sum + item.amount, 0);
  const tollOutlay = expenses.filter(e => e.category === 'Toll').reduce((sum, item) => sum + item.amount, 0);

  // Group by category for chart
  const categories = ['Fuel', 'Maintenance', 'Toll', 'Driver Expenses', 'Insurance', 'Other'];
  const chartColors = ['#1E1E1C', '#C59B27', '#C62828', '#2E7D32', '#EF6C00', '#7E57C2'];

  const chartData = categories.map(cat => {
    const val = expenses.filter(e => e.category === cat).reduce((sum, item) => sum + item.amount, 0);
    return { name: cat, value: val };
  }).filter(item => item.value > 0);

  return (
    <div className="p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Financial Auditing</p>
          <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Fleet Expense Logs</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 text-[#C59B27]" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Financial overview grids */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm">
          <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block">Total Outlay</span>
          <p className="text-2xl font-extrabold text-charcoal mt-1 font-mono">₹{totalOutlay.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm">
          <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block">Fuel Refills</span>
          <p className="text-2xl font-extrabold text-charcoal mt-1 font-mono">₹{fuelOutlay.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm">
          <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block">Diagnostics/Repair</span>
          <p className="text-2xl font-extrabold text-charcoal mt-1 font-mono">₹{maintOutlay.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm">
          <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block">Tolls FASTag</span>
          <p className="text-2xl font-extrabold text-charcoal mt-1 font-mono">₹{tollOutlay.toLocaleString()}</p>
        </div>
      </div>

      {/* Form and Chart row */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Record form */}
        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm h-full">
          <div className="border-b border-charcoal/5 pb-3.5 mb-4">
            <h4 className="text-sm font-bold text-charcoal brand-heading">Record Outlay Transaction</h4>
            <p className="text-[10px] text-charcoal/50 font-medium">Log diesel refills, tolls, or salary dispatches</p>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck ID</label>
                <input
                  type="text"
                  value={formData.truck}
                  onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                  placeholder="TRK-101"
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Amount (₹) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="15000"
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Date Logged</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Description / Memo</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="HP Fuel Station - diesel refuel"
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-charcoal text-[#F5F2EB] py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-sm"
            >
              Add Expense Outlay
            </button>
          </form>
        </div>

        {/* Categories Pie Chart */}
        <div className="lg:col-span-2 rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm flex flex-col justify-between">
          <div className="border-b border-charcoal/5 pb-3.5">
            <h4 className="text-sm font-bold text-charcoal brand-heading">Outlay Allocations</h4>
            <p className="text-[10px] text-charcoal/50 font-medium">Categorized cost breakdowns across fleet dispatches</p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-around py-4">
            <div className="w-48 h-48">
              {loading ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/40">Loading...</div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/40 font-medium">No expenses logged</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`₹${Number(val || 0).toLocaleString()}`, 'Cost']}
                      contentStyle={{ background: '#FAF9F6', borderRadius: '8px', border: '1px solid rgba(30,30,28,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Chart Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mt-4 md:mt-0">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded" style={{ backgroundColor: chartColors[idx % chartColors.length] }} />
                  <span className="truncate max-w-[120px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Expense Logs table */}
      <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm">
        <div className="border-b border-charcoal/5 pb-4 mb-4">
          <h4 className="text-base font-bold text-charcoal brand-heading">Transaction History Ledger</h4>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/40 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Expense ID</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Transaction Date</th>
                <th className="py-3 px-2">Memo / Description</th>
                <th className="py-3 px-2 text-right">Amount Outlay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 font-medium">
              {expenses.map((exp) => (
                <tr key={exp.expenseId} className="hover:bg-charcoal/5 transition-colors">
                  <td className="py-3 px-2 font-mono text-charcoal font-bold">{exp.expenseId}</td>
                  <td className="py-3 px-2 text-charcoal/70">{exp.category}</td>
                  <td className="py-3 px-2 font-mono text-charcoal/70">{exp.truck}</td>
                  <td className="py-3 px-2 text-charcoal/70">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="py-3 px-2 text-charcoal">{exp.description}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-charcoal">
                    ₹{exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Expenses;
