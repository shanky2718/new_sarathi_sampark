'use client';

import React, { useState } from 'react';
import { 
  TrendingDown, 
  Leaf, 
  Fuel, 
  Award, 
  Truck as TruckIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart as RechartsBarChart, 
  Bar 
} from 'recharts';

export const Analytics: React.FC = () => {
  const [range, setRange] = useState('30 Days');

  const getChartData = (timeRange: string) => {
    switch (timeRange) {
      case '7 Days':
        return [
          { day: 'Mon', emptyTripsBefore: 34, emptyTripsAfter: 13, fuelEfficiency: 4.8 },
          { day: 'Tue', emptyTripsBefore: 35, emptyTripsAfter: 12, fuelEfficiency: 5.1 },
          { day: 'Wed', emptyTripsBefore: 34, emptyTripsAfter: 11, fuelEfficiency: 4.9 },
          { day: 'Thu', emptyTripsBefore: 33, emptyTripsAfter: 12, fuelEfficiency: 5.2 },
          { day: 'Fri', emptyTripsBefore: 36, emptyTripsAfter: 14, fuelEfficiency: 4.7 },
          { day: 'Sat', emptyTripsBefore: 32, emptyTripsAfter: 10, fuelEfficiency: 5.0 },
          { day: 'Sun', emptyTripsBefore: 34, emptyTripsAfter: 11, fuelEfficiency: 5.3 }
        ];
      case '3 Months':
        return [
          { day: 'May', emptyTripsBefore: 36, emptyTripsAfter: 15, fuelEfficiency: 4.9 },
          { day: 'Jun', emptyTripsBefore: 35, emptyTripsAfter: 13, fuelEfficiency: 5.0 },
          { day: 'Jul', emptyTripsBefore: 34, emptyTripsAfter: 12, fuelEfficiency: 5.1 }
        ];
      case '1 Year':
        return [
          { day: 'Q1', emptyTripsBefore: 38, emptyTripsAfter: 18, fuelEfficiency: 4.7 },
          { day: 'Q2', emptyTripsBefore: 36, emptyTripsAfter: 14, fuelEfficiency: 4.9 },
          { day: 'Q3', emptyTripsBefore: 34, emptyTripsAfter: 12, fuelEfficiency: 5.1 },
          { day: 'Q4', emptyTripsBefore: 32, emptyTripsAfter: 10, fuelEfficiency: 5.2 }
        ];
      default:
        return [
          { day: 'Week 1', emptyTripsBefore: 35, emptyTripsAfter: 14, fuelEfficiency: 4.9 },
          { day: 'Week 2', emptyTripsBefore: 34, emptyTripsAfter: 12, fuelEfficiency: 5.0 },
          { day: 'Week 3', emptyTripsBefore: 34, emptyTripsAfter: 11, fuelEfficiency: 5.2 },
          { day: 'Week 4', emptyTripsBefore: 33, emptyTripsAfter: 10, fuelEfficiency: 5.1 }
        ];
    }
  };

  const currentData = getChartData(range);

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Impact & Efficiency Analytics
            </span>
            <span className="text-xs text-charcoal/60 font-medium">Bharat Freight Optimization Index</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            Platform Impact & Fleet Analytics
          </h1>
        </div>
        
        <div className="flex items-center space-x-1.5 border border-stone-200 rounded-xl p-1 bg-white shadow-sm">
          {['7 Days', '30 Days', '3 Months', '1 Year'].map((t) => (
            <button
              key={t}
              onClick={() => setRange(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                range === t 
                  ? 'bg-[#0B1320] text-white shadow-xs' 
                  : 'text-charcoal/60 hover:bg-stone-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0B1320] text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Core Transformation Metric
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Empty Return Trip Elimination
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Sarathi Sampark matches unutilized return truck capacities with verified shippers across Indian industrial corridors.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-700/80 text-emerald-300">
            <TrendingDown className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-extrabold">-22% Net Reduction in Empty Runs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 uppercase">Traditional Logistics</span>
              <span className="text-[11px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">BEFORE</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-rose-500 font-mono">34%</span>
              <span className="text-xs text-slate-400">Empty Return Rate</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              1 out of every 3 trucks returned completely empty without freight earnings, consuming diesel and burning profit margins.
            </p>
            <div className="mt-4 w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[34%]" />
            </div>
          </div>

          <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-600/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">With Sarathi Sampark</span>
              <span className="text-[11px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">AFTER</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-emerald-400 font-mono">12%</span>
              <span className="text-xs text-emerald-300 font-medium">Empty Return Rate</span>
            </div>
            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              64.7% reduction in empty returns! Trucks seamlessly match return freight near destination delivery points.
            </p>
            <div className="mt-4 w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[12%]" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-[#0B1320] mb-3">Green Logistics & ESG Sustainability Index</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-charcoal/60 uppercase">CO₂ Emissions Avoided</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">1,420 Tons</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Decarbonized freight</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Diesel Saved</p>
              <p className="text-2xl font-extrabold text-amber-800 mt-1">540,000 L</p>
              <p className="text-xs text-amber-700 font-medium mt-1">Fuel waste eliminated</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <Fuel className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Fleet Utilization Boost</p>
              <p className="text-2xl font-extrabold text-[#0B1320] mt-1">+28.4%</p>
              <p className="text-xs text-blue-600 font-medium mt-1">Asset productivity</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-charcoal/60 uppercase">Return Trips Saved</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">4,820 Trips</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Profitable backhauls</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
              <Award className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1320]">Empty Trip Rate Comparison Chart (%)</h3>
            <p className="text-xs text-charcoal/60">Before vs After Sarathi Sampark Implementation</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="emptyTripsBefore" name="Before (Empty %)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="emptyTripsAfter" name="After (Empty %)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1320]">Average Fleet Fuel Efficiency (KM/L)</h3>
            <p className="text-xs text-charcoal/60">Monitored via IoT Telemetry</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="fuelEfficiency" name="KM / Litre" stroke="#059669" fill="#D1FAE5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
