import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Search, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import { SimulatedMap } from '../components/SimulatedMap';

export const LiveTracking: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState<string | undefined>(undefined);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.trips.getAll();
      // Filter only active/delayed trips for live tracking
      const activeTrips = data.filter((t: any) => t.status === 'In Progress' || t.status === 'Delayed');
      setTrips(activeTrips);

      if (activeTrips.length > 0) {
        setSelectedTruckId(activeTrips[0].truck);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(t => 
    t.tripId.toLowerCase().includes(search.toLowerCase()) ||
    t.truck.toLowerCase().includes(search.toLowerCase()) ||
    t.driver.toLowerCase().includes(search.toLowerCase()) ||
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  const activeSelectedTrip = trips.find(t => t.truck === selectedTruckId);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden font-sans">
      
      {/* Roster sidebar panel */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-charcoal/10 bg-[#FAF9F6] p-5 flex flex-col h-1/3 lg:h-full">
        
        <div className="space-y-1 mb-4 shrink-0">
          <h4 className="text-sm font-bold text-charcoal brand-heading">Active Dispatches</h4>
          <p className="text-[10px] text-charcoal/50 font-medium">Select a vehicle to display GPS tracking nodes</p>
        </div>

        {/* Search */}
        <div className="relative mb-4 shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search ID, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 bg-white py-2 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-gold"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="h-6 w-6 text-charcoal/40 animate-spin mx-auto" />
            </div>
          ) : filteredTrips.length === 0 ? (
            <p className="py-8 text-center text-xs text-charcoal/45 font-medium">No active dispatches found</p>
          ) : (
            filteredTrips.map((trip) => {
              const isSelected = selectedTruckId === trip.truck;
              return (
                <div 
                  key={trip.tripId}
                  onClick={() => setSelectedTruckId(trip.truck)}
                  className={`
                    border rounded-lg p-3 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-[#C59B27] bg-[#F5F2EB]/50 shadow-inner' 
                      : 'border-charcoal/5 bg-white/40 hover:bg-charcoal/5 hover:border-charcoal/10'
                    }
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-charcoal font-mono">{trip.truck}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      trip.status === 'Delayed' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-charcoal/70">
                    Destination: <span className="font-bold text-charcoal">{trip.destination}</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[9px] text-charcoal/50">
                    <span>Speed: {trip.status === 'Delayed' ? '0' : '65'} km/h</span>
                    <span>Prog: {trip.progress}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map panel */}
      <div className="flex-1 bg-[#EFECE6] p-4 relative flex flex-col justify-center h-2/3 lg:h-full">
        
        {/* Full-width simulated map grid */}
        <SimulatedMap 
          activeTruckId={selectedTruckId}
          onTruckSelect={(id) => setSelectedTruckId(id)}
        />

        {/* Selected dispatch metrics details - displayed only on desktop */}
        {activeSelectedTrip && (
          <div className="absolute top-8 left-8 hidden lg:block rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-4 shadow-xl w-72 animate-fade-in z-20">
            <div className="border-b border-charcoal/5 pb-2.5 mb-3 flex justify-between items-center">
              <h5 className="text-[10px] font-bold text-gold uppercase tracking-wider">Active Telemetry</h5>
              <span className="text-[10px] font-bold text-charcoal font-mono">{activeSelectedTrip.tripId}</span>
            </div>
            
            <div className="space-y-2 text-xs font-semibold text-charcoal/80">
              <div className="flex justify-between">
                <span className="text-charcoal/45">Truck Model:</span>
                <span className="text-charcoal font-mono">{activeSelectedTrip.truck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/45">Driver name:</span>
                <span className="text-charcoal">{activeSelectedTrip.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/45">HQ Origin:</span>
                <span className="text-charcoal">{activeSelectedTrip.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/45">ETA Window:</span>
                <span className="text-[#C59B27]">{new Date(activeSelectedTrip.eta).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
export default LiveTracking;
