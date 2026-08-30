import React from 'react';
import { useData } from '../context/DataContext';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  BarChart3, 
  Fuel, 
  PieChart as PieIcon,
  PackageCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const Revenue: React.FC = () => {
  const { trips, loads, expenses } = useData();

  // Calculate financial statistics dynamically
  const completedTrips = trips.filter(t => t.status === 'Completed');
  const acceptedLoads = loads.filter(l => l.status === 'Accepted' || l.status === 'Completed');

  const baseTripRevenue = completedTrips.reduce((acc, t) => acc + t.distance * 85, 0);
  const returnLoadRevenue = acceptedLoads.reduce((acc, l) => acc + l.offeredPrice, 0);
  const totalRevenue = baseTripRevenue + returnLoadRevenue;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const netMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const totalDistanceDriven = trips.reduce((acc, t) => acc + t.distance, 0) || 1;
  const costPerKm = (totalExpenses / totalDistanceDriven).toFixed(2);

  // Chart data for monthly revenue growth
  const monthlyRevenueData = [
    { month: 'Mar', outboundRevenue: 420000, returnLoadBoost: 110000, expenses: 240000 },
    { month: 'Apr', outboundRevenue: 480000, returnLoadBoost: 165000, expenses: 280000 },
    { month: 'May', outboundRevenue: 510000, returnLoadBoost: 210000, expenses: 310000 },
    { month: 'Jun', outboundRevenue: 590000, returnLoadBoost: 290000, expenses: 350000 },
    { month: 'Jul', outboundRevenue: 640000, returnLoadBoost: 380000, expenses: 390000 },
    { month: 'Aug (YTD)', outboundRevenue: baseTripRevenue || 720000, returnLoadBoost: returnLoadRevenue || 440000, expenses: totalExpenses || 410000 },
  ];

  const expenseBreakdown = [
    { category: 'Fuel Expense', amount: expenses.filter(e => e.category === 'Fuel').reduce((a, e) => a + e.amount, 0) || 165000, color: '#F59E0B' },
    { category: 'Toll FASTag', amount: expenses.filter(e => e.category === 'Toll').reduce((a, e) => a + e.amount, 0) || 45000, color: '#3B82F6' },
    { category: 'Maintenance', amount: expenses.filter(e => e.category === 'Maintenance').reduce((a, e) => a + e.amount, 0) || 72000, color: '#EF4444' },
    { category: 'Driver Allowance', amount: expenses.filter(e => e.category === 'Driver Expenses').reduce((a, e) => a + e.amount, 0) || 38000, color: '#10B981' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Financial Intelligence
            </span>
            <span className="text-xs text-charcoal/60">Transporter P&L Ledger</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            Revenue & Profitability Analytics
          </h1>
          <p className="text-sm text-charcoal/70">
            Track gross freight earnings, return-load profit boosts, net margins, and cost-per-kilometer metrics.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm text-right">
          <p className="text-xs text-charcoal/50 font-semibold uppercase">Cost Per Kilometer</p>
          <p className="text-xl font-extrabold text-[#0B1320]">₹{costPerKm} <span className="text-xs font-normal text-charcoal/60">/ KM</span></p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Total Revenue</p>
            <p className="text-2xl font-extrabold text-[#0B1320] mt-1">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +24.8% vs last month
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Return Load Revenue</p>
            <p className="text-2xl font-extrabold text-amber-800 mt-1">₹{returnLoadRevenue.toLocaleString()}</p>
            <p className="text-xs text-amber-700 font-medium mt-1">38.4% of total profit</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <PackageCheck className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Total Operating Expenses</p>
            <p className="text-2xl font-extrabold text-rose-700 mt-1">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Fuel, tolls, maintenance</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <CreditCard className="h-6 w-6 text-rose-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Net Profit Margin</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{netMargin}%</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">₹{netProfit.toLocaleString()} Net Profit</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <TrendingUp className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Growth Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1320]">Monthly Revenue & Return Load Impact</h3>
              <p className="text-xs text-charcoal/60">Outbound Freight vs Sarathi Sampark Return Load Boost</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Outbound</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Return Load Boost</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="outboundRevenue" stackId="1" stroke="#059669" fill="#10B981" />
                <Area type="monotone" dataKey="returnLoadBoost" stackId="1" stroke="#D97706" fill="#F59E0B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Chart (1 Column) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1320]">Expense Category Breakdown</h3>
            <p className="text-xs text-charcoal/60">Operating cost breakdown (₹)</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#6B7280' }} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
            {expenseBreakdown.map(item => (
              <div key={item.category} className="flex items-center justify-between text-charcoal">
                <span className="text-charcoal/70">{item.category}:</span>
                <span className="font-bold">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Return Load Revenue Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <h3 className="font-bold text-base text-[#0B1320]">Accepted Return Load Earnings Ledger</h3>
            <p className="text-xs text-charcoal/60">Profit generated by utilizing empty return trips</p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-300">
            {acceptedLoads.length} Backhaul Runs Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                <th className="p-4">Load ID</th>
                <th className="p-4">Route</th>
                <th className="p-4">Cargo & Shipper</th>
                <th className="p-4">Offered Freight (₹)</th>
                <th className="p-4">Fuel Expense (₹)</th>
                <th className="p-4">Net Profit Addition (₹)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {acceptedLoads.map((load) => (
                <tr key={load.loadId} className="hover:bg-stone-50 transition">
                  <td className="p-4 font-mono font-bold text-[#0B1320]">{load.loadId}</td>
                  <td className="p-4 font-bold text-charcoal">{load.pickup} → {load.destination}</td>
                  <td className="p-4 text-charcoal/80">{load.cargo} ({load.shipperName})</td>
                  <td className="p-4 font-bold text-[#0B1320]">₹{load.offeredPrice.toLocaleString()}</td>
                  <td className="p-4 text-rose-700 font-medium">- ₹{load.estimatedFuelCost.toLocaleString()}</td>
                  <td className="p-4 font-extrabold text-emerald-700 text-sm">
                    + ₹{load.estimatedProfit.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Earned
                    </span>
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

export default Revenue;
