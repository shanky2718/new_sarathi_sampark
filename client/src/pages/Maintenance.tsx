import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, AlertTriangle, AlertCircle, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';

export const Maintenance: React.FC = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const data = await api.trucks.getAll();
        setTrucks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  // Compute maintenance categories
  const maintenanceTrucks = trucks.filter(t => t.status === 'Maintenance');
  
  // Simulated service logs for premium timeline
  const serviceHistory = [
    { id: 'SVC-890', truck: 'TRK-101', task: 'Engine Oil & Filter Change', date: '2026-08-01', cost: 15400, mechanic: 'HP Service Hub, Bengaluru' },
    { id: 'SVC-889', truck: 'TRK-105', task: 'Brake Pad Replacement', date: '2026-07-28', cost: 12500, mechanic: 'Leyland Workshop, Ahmedabad' },
    { id: 'SVC-888', truck: 'TRK-112', task: 'Differential Gearbox Greasing', date: '2026-07-22', cost: 4800, mechanic: 'TVS Service Stn, Hyderabad' },
    { id: 'SVC-887', truck: 'TRK-103', task: 'Front Left Wheel Alignment', date: '2026-07-15', cost: 1500, mechanic: 'Bridgestone Hub, Delhi' },
    { id: 'SVC-886', truck: 'TRK-119', task: 'Radiator Flush & Coolant Refill', date: '2026-07-10', cost: 3500, mechanic: 'Tata Motors, Ludhiana' }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Maintenance Oversight</p>
        <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Fleet Preventative Diagnostics</h3>
      </div>

      {/* Grid of statuses */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Critical Maintenance */}
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <h4 className="font-bold text-sm uppercase tracking-wide">Critical Attention Required</h4>
          </div>
          
          <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar">
            {loading ? (
              <p className="text-xs text-charcoal/40 font-medium">Loading...</p>
            ) : maintenanceTrucks.length === 0 ? (
              <p className="text-xs text-green-800 font-semibold py-4">No vehicles currently flagged in critical state</p>
            ) : (
              maintenanceTrucks.map(t => (
                <div key={t.truckId} className="bg-white border border-red-200 rounded-lg p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-charcoal font-mono">{t.truckId}</span>
                    <p className="text-[10px] text-charcoal/50 font-medium mt-0.5">{t.model}</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                    🔧 Workshop
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Next Servicing Schedule */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-800">
            <Calendar className="h-5 w-5" />
            <h4 className="font-bold text-sm uppercase tracking-wide">Upcoming Service Timelines</h4>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar">
            {loading ? (
              <p className="text-xs text-charcoal/40 font-medium">Loading...</p>
            ) : (
              trucks.slice(0, 5).map(t => (
                <div key={t.truckId} className="bg-white border border-amber-200 rounded-lg p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-charcoal font-mono">{t.truckId}</span>
                    <p className="text-[10px] text-charcoal/50 font-medium mt-0.5">Next Service Due</p>
                  </div>
                  <span className="font-mono text-[10px] text-amber-800 font-bold">
                    {new Date(t.nextService).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Compliance checklist warnings */}
        <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-charcoal/80">
            <ShieldCheck className="h-5 w-5 text-gold" />
            <h4 className="font-bold text-sm uppercase tracking-wide">PUC & Fitness Compliance</h4>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar">
            {loading ? (
              <p className="text-xs text-charcoal/40 font-medium">Loading...</p>
            ) : (
              trucks.slice(5, 10).map(t => (
                <div key={t.truckId} className="bg-white border border-charcoal/5 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-charcoal font-mono">{t.truckId}</span>
                    <span className="text-[9px] text-[#2E7D32] font-bold bg-green-50 px-1.5 py-0.5 rounded">Compliance OK</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-charcoal/50 font-medium">
                    <span>Fitness Expiry: {new Date(t.fitnessExpiry).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Service History Ledger */}
      <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm">
        <div className="border-b border-charcoal/5 pb-4 mb-4">
          <h4 className="text-base font-bold text-charcoal brand-heading">Completed Service Histories</h4>
          <p className="text-xs text-charcoal/55 font-medium">Ledger of diagnostics, parts replacement, and technician audits</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/40 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Job ID</th>
                <th className="py-3 px-2">Vehicle ID</th>
                <th className="py-3 px-2">Diagnostic / Repair Task</th>
                <th className="py-3 px-2">Completed Date</th>
                <th className="py-3 px-2">Serviced Workshop</th>
                <th className="py-3 px-2 text-right">Outlay Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 font-medium">
              {serviceHistory.map((log) => (
                <tr key={log.id} className="hover:bg-charcoal/5 transition-colors">
                  <td className="py-3 px-2 font-mono text-charcoal font-bold">{log.id}</td>
                  <td className="py-3 px-2 font-mono text-charcoal/70">{log.truck}</td>
                  <td className="py-3 px-2 text-charcoal">{log.task}</td>
                  <td className="py-3 px-2 text-charcoal/70">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="py-3 px-2 text-charcoal/70">{log.mechanic}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-charcoal">
                    ₹{log.cost.toLocaleString()}
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
export default Maintenance;
