import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Fuel, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Truck as TruckIcon, 
  Zap, 
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const FuelManagement: React.FC = () => {
  const { fuelMetrics, trucks, addFuelEntry } = useData();

  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    truckId: 'TRK-101',
    liters: 200,
    cost: 19000,
    mileage: 940,
    driver: 'Rahul Kumar'
  });

  const totalFuelLiters = fuelMetrics.reduce((acc, f) => acc + f.fuelConsumedLiters, 0);
  const totalFuelCost = fuelMetrics.reduce((acc, f) => acc + f.fuelCost, 0);
  const avgFleetKmL = Number(
    (fuelMetrics.reduce((acc, f) => acc + f.avgKmL, 0) / (fuelMetrics.length || 1)).toFixed(1)
  );

  const anomalies = fuelMetrics.filter(f => f.hasAnomaly);

  const chartData = fuelMetrics.map(f => ({
    truck: f.truckId,
    actualKmL: f.avgKmL,
    baseline: f.baselineKmL,
    cost: f.fuelCost
  }));

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const truck = trucks.find(t => t.truckId === logForm.truckId);
    addFuelEntry({
      ...logForm,
      driver: truck?.driver || 'Rahul Kumar'
    });
    setShowLogModal(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-200">
              Telemetry Analytics
            </span>
            <span className="text-xs text-charcoal/60">IoT Diesel & Fuel Monitoring</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            Fuel Intelligence & Efficiency
          </h1>
          <p className="text-sm text-charcoal/70">
            Monitor diesel consumption, eliminate fuel theft, track KM/L anomalies, and cut fleet fuel expenditure.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 bg-[#0B1320] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-md"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          Log Diesel Refill
        </button>
      </div>

      {/* ANOMALY ALERT BANNER */}
      {anomalies.length > 0 && (
        <div className="bg-rose-900 text-rose-50 p-4 rounded-2xl border border-rose-700 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <span>Fuel Anomaly Detected across {anomalies.length} Vehicle(s)</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-800 font-mono font-semibold">
              Action Priority: High
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            {anomalies.map(anom => (
              <div key={anom.id} className="bg-rose-950/60 p-3 rounded-xl border border-rose-800/80 flex items-start justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-300">
                    TRK-{anom.truckId.replace('TRK-', '')} fuel consumption is {anom.anomalyPercentage}% above baseline!
                  </p>
                  <p className="text-rose-200/80 mt-0.5">
                    Driver: {anom.driver} • Actual Efficiency: <strong>{anom.avgKmL} KM/L</strong> (Target: {anom.baselineKmL} KM/L).
                  </p>
                  {anom.anomalyReason && (
                    <p className="text-[11px] text-amber-200/90 italic mt-1 font-mono">
                      Diagnosis: {anom.anomalyReason}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-mono bg-rose-900 text-rose-100 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                  {anom.lastRefillDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Total Fuel Consumed</p>
            <p className="text-2xl font-extrabold text-[#0B1320] mt-1">{totalFuelLiters.toLocaleString()} L</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Across active fleet</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Fuel className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Total Fuel Cost</p>
            <p className="text-2xl font-extrabold text-rose-700 mt-1">₹{totalFuelCost.toLocaleString()}</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Major operational expense</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <DollarSign className="h-6 w-6 text-rose-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Fleet Avg KM / L</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{avgFleetKmL} KM/L</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Target baseline: 4.8 KM/L</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase">Active Anomalies</p>
            <p className="text-2xl font-extrabold text-amber-800 mt-1">{anomalies.length}</p>
            <p className="text-xs text-amber-700 font-medium mt-1">Idling or gear sub-optimization</p>
          </div>
          <div className="p-3 bg-amber-100 rounded-xl border border-amber-300">
            <Zap className="h-6 w-6 text-amber-800" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Actual Efficiency vs Baseline */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1320]">Fuel Efficiency per Truck (KM / Litre)</h3>
            <p className="text-xs text-charcoal/60">Comparison of actual logged KM/L against baseline targets</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="truck" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="actualKmL" name="Actual KM/L" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Baseline Target" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Fuel Expense by Truck */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1320]">Fuel Cost Expenditure (₹)</h3>
            <p className="text-xs text-charcoal/60">Total expense incurred per vehicle refill</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="truck" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1320', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="cost" name="Fuel Cost (₹)" stroke="#E11D48" strokeWidth={3} dot={{ r: 5, fill: '#E11D48' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fuel Refills Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
          <h3 className="font-bold text-base text-[#0B1320]">Recent Diesel Refill Logs</h3>
          <span className="text-xs text-charcoal/60 font-medium">IoT Sensor Telemetry Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                <th className="p-4">Truck ID</th>
                <th className="p-4">Plate Number</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Fuel Refilled</th>
                <th className="p-4">Cost (₹)</th>
                <th className="p-4">Avg KM/L</th>
                <th className="p-4">Status</th>
                <th className="p-4">Refill Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {fuelMetrics.map((f) => (
                <tr key={f.id} className="hover:bg-stone-50 transition">
                  <td className="p-4 font-mono font-bold text-[#0B1320]">{f.truckId}</td>
                  <td className="p-4 font-mono text-charcoal/80">{f.plateNumber}</td>
                  <td className="p-4 text-charcoal">{f.driver}</td>
                  <td className="p-4 font-bold text-amber-900">{f.fuelConsumedLiters} Litres</td>
                  <td className="p-4 font-bold text-[#0B1320]">₹{f.fuelCost.toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-700">{f.avgKmL} KM/L</td>
                  <td className="p-4">
                    {f.hasAnomaly ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-300">
                        <AlertTriangle className="h-3 w-3" /> +{f.anomalyPercentage}% Anomaly
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Optimal
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-charcoal/70">{f.lastRefillDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG REFILL MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#0B1320] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Log Diesel Refill Entry</h3>
              <button onClick={() => setShowLogModal(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Truck</label>
                <select
                  value={logForm.truckId}
                  onChange={(e) => setLogForm({ ...logForm, truckId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {trucks.map(t => (
                    <option key={t.truckId} value={t.truckId}>{t.truckId} - {t.plateNumber} ({t.model})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Liters Refilled</label>
                  <input
                    type="number"
                    value={logForm.liters}
                    onChange={(e) => setLogForm({ ...logForm, liters: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    value={logForm.cost}
                    onChange={(e) => setLogForm({ ...logForm, cost: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Distance Driven Since Last Refill (KM)</label>
                <input
                  type="number"
                  value={logForm.mileage}
                  onChange={(e) => setLogForm({ ...logForm, mileage: Number(e.target.value) })}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                Calculated Fuel Efficiency: <strong>{(logForm.mileage / (logForm.liters || 1)).toFixed(1)} KM / L</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1320] text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Log Fuel Refill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FuelManagement;
