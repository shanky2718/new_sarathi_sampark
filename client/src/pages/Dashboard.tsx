import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  UserCheck, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Package,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Clock
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { SimulatedMap } from '../components/SimulatedMap';
import { useData } from '../context/DataContext';

interface DashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const { trucks, trips, deliveries, expenses, loads, notifications } = useData();
  const [selectedTruckId, setSelectedTruckId] = useState<string | undefined>(undefined);

  // Compute metrics from DataContext
  const totalTrucks = trucks.length;
  const activeTrucks = trucks.filter(t => t.status === 'Active' || t.status === 'Delayed').length;
  const availableTrucks = trucks.filter(t => t.status === 'Available').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'Maintenance').length;
  
  const inTransitTrips = trips.filter(t => t.status === 'In Progress' || t.status === 'Delayed').length;
  const completedDeliveriesCount = deliveries.filter(d => d.status === 'Delivered').length;

  const availableLoadsCount = loads.filter(l => l.status === 'Available').length;
  const returnLoadProfitSum = loads
    .filter(l => l.status === 'Accepted' || l.status === 'Completed')
    .reduce((acc, l) => acc + l.estimatedProfit, 0);

  const totalRevenue = (trips.filter(t => t.status === 'Completed').reduce((acc, t) => acc + t.distance * 85, 0)) + 
    loads.filter(l => l.status === 'Accepted' || l.status === 'Completed').reduce((acc, l) => acc + l.offeredPrice, 0);

  const activeTransitTrips = trips
    .filter(t => t.status === 'In Progress' || t.status === 'Delayed')
    .slice(0, 5);

  const availableReturnLoadsPreview = loads
    .filter(l => l.status === 'Available')
    .slice(0, 4);

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0B1320] text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-[#0B1320] font-mono">
              BHARAT LOGISTICS COMMAND
            </span>
            <span className="text-xs text-slate-300">Live Telemetry & Marketplace Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Sarathi Sampark Logistics Dashboard
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Connecting empty return trips with high-margin freight opportunities across Indian corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Fleet Revenue</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard 
          title="Total Fleet" 
          value={totalTrucks} 
          subtitle="Registered vehicles" 
          icon={<Truck className="h-5 w-5 text-charcoal" />} 
        />
        <MetricCard 
          title="On Trip Active" 
          value={activeTrucks} 
          subtitle="Dispatched en route" 
          icon={<Compass className="h-5 w-5 text-emerald-700" />} 
        />
        <MetricCard 
          title="Available Fleet" 
          value={availableTrucks} 
          subtitle="Ready for return load" 
          icon={<UserCheck className="h-5 w-5 text-blue-700" />} 
        />
        <MetricCard 
          title="Return Freight" 
          value={availableLoadsCount} 
          subtitle="High-profit loads" 
          icon={<Package className="h-5 w-5 text-amber-700" />} 
        />
        <MetricCard 
          title="Return Profit" 
          value={`₹${(returnLoadProfitSum / 1000).toFixed(0)}k`} 
          subtitle="Backhaul net profit" 
          icon={<TrendingUp className="h-5 w-5 text-emerald-700" />} 
        />
        <MetricCard 
          title="In Maintenance" 
          value={maintenanceTrucks} 
          subtitle="Workshop servicing" 
          icon={<AlertTriangle className="h-5 w-5 text-rose-700" />} 
        />
      </div>

      {/* Main Command View: Map & Return Load Marketplace Teaser */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Live GPS Telemetry Map (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B1320] flex items-center gap-2">
              <Compass className="h-5 w-5 text-amber-700" />
              Live Highway Telemetry Map
            </h3>
            <span className="text-xs text-charcoal/60 font-medium">GPS Active Refresh</span>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-[420px]">
            <SimulatedMap 
              activeTruckId={selectedTruckId}
              onTruckSelect={setSelectedTruckId}
            />
          </div>
        </div>

        {/* Available Return Loads Marketplace Sidebar (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
                  Core Marketplace
                </span>
                <h3 className="text-base font-bold text-[#0B1320] mt-1">Available Return Freight</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {availableLoadsCount} Open
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {availableReturnLoadsPreview.map(load => (
                <div 
                  key={load.loadId}
                  className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF9F6] hover:border-amber-400 transition cursor-pointer space-y-2"
                  onClick={() => onNavigateTab && onNavigateTab('return-loads')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0B1320]">{load.loadId}</span>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                      + ₹{load.estimatedProfit.toLocaleString()} Profit
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                    <span>{load.pickup}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-700" />
                    <span>{load.destination}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-charcoal/60 pt-1 border-t border-stone-200/60">
                    <span>{load.cargo} • {load.weight}</span>
                    <span className="font-semibold text-charcoal/80">₹{load.offeredPrice.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('return-loads')}
            className="w-full py-2.5 bg-[#0B1320] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Open Return Load Marketplace</span>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Active Dispatches Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0B1320]">Active Dispatches & Return Loads</h3>
          <span className="text-xs text-charcoal/60 font-medium">Updated 1 min ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-charcoal/70 uppercase text-[11px] font-semibold">
                <th className="p-4">Trip ID</th>
                <th className="p-4">Truck & Plate</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Origin → Destination</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {activeTransitTrips.map((trip) => (
                <tr key={trip.tripId} className="hover:bg-stone-50 transition">
                  <td className="p-4 font-mono font-bold text-[#0B1320]">{trip.tripId}</td>
                  <td className="p-4 font-bold text-charcoal">{trip.truck}</td>
                  <td className="p-4 text-charcoal">{trip.driver}</td>
                  <td className="p-4 font-bold text-[#0B1320]">{trip.origin} → {trip.destination}</td>
                  <td className="p-4 w-40">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full" style={{ width: `${trip.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono font-bold">{trip.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {trip.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-charcoal/70">
                    {new Date(trip.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

export default Dashboard;
