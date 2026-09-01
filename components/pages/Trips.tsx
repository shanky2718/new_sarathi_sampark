'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Plus, Play, Check, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { api } from '@/lib/clientApi';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    truck: '',
    driver: '',
    origin: '',
    destination: '',
    distance: '',
    startTime: '',
    eta: '',
    status: 'Scheduled'
  });
  const [formError, setFormError] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const [tripData, truckData, driverData] = await Promise.all([
        api.trips.getAll(),
        api.trucks.getAll(),
        api.drivers.getAll()
      ]);
      setTrips(tripData);
      setTrucks(truckData);
      setDrivers(driverData);

      if (truckData.length > 0) setFormData(prev => ({ ...prev, truck: truckData[0].truckId }));
      if (driverData.length > 0) setFormData(prev => ({ ...prev, driver: driverData[0].name }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const { truck, driver, origin, destination, distance, startTime, eta } = formData;
    if (!truck || !driver || !origin || !destination || !distance || !startTime || !eta) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const createdTrip = await api.trips.create(formData);
      setTrips(prev => [createdTrip, ...prev]);
      
      setFormData(prev => ({
        ...prev,
        origin: '',
        destination: '',
        distance: '',
        startTime: '',
        eta: '',
        status: 'Scheduled'
      }));
      setCreateModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create trip');
    }
  };

  const handleStartTrip = async (tripId: string) => {
    try {
      const updated = await api.trips.update(tripId, { status: 'In Progress', progress: 5 });
      setTrips(prev => prev.map(t => t.tripId === tripId ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteTrip = async (tripId: string) => {
    try {
      const updated = await api.trips.update(tripId, { status: 'Completed', progress: 100 });
      setTrips(prev => prev.map(t => t.tripId === tripId ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = 
      t.tripId.toLowerCase().includes(search.toLowerCase()) ||
      t.truck.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Completed':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Delayed':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'Cancelled':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-charcoal/5 border-charcoal/15 text-charcoal/60';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Routing & Dispatches</p>
          <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Trip Logs & Schedules</h3>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 text-[#C59B27]" />
          <span>Dispatch New Trip</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-charcoal/10 bg-[#FAF9F6] p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search trip, truck, driver, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 bg-white py-2 pl-9 pr-4 text-xs text-charcoal placeholder-charcoal/45 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Scheduled', 'In Progress', 'Completed', 'Delayed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`
                rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border
                ${statusFilter === status 
                  ? 'bg-charcoal border-charcoal text-[#F5F2EB]' 
                  : 'bg-white border-charcoal/10 text-charcoal/60 hover:bg-charcoal/5'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="h-8 w-8 text-charcoal/40 animate-spin mx-auto" />
          <p className="text-xs text-charcoal/50 mt-2 font-medium">Fetching dispatches...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="border border-charcoal/10 rounded-xl bg-[#FAF9F6] py-20 text-center space-y-3">
          <MapPin className="h-10 w-10 text-charcoal/20 mx-auto" />
          <p className="text-sm font-bold text-charcoal leading-none">No dispatches logged</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div 
              key={trip.tripId}
              className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-charcoal/5 pb-3.5 mb-4">
                  <div>
                    <span className="text-xs font-bold text-charcoal font-mono">{trip.tripId}</span>
                    <span className="text-[10px] text-charcoal/40 block mt-0.5 font-bold uppercase tracking-wider">Truck: {trip.truck}</span>
                  </div>
                  <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs font-medium">
                  <div>
                    <span className="text-charcoal/45 block text-[9px] font-bold uppercase tracking-wide">ROUTE CORRIDOR</span>
                    <p className="font-bold text-charcoal mt-0.5">{trip.origin} → {trip.destination}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-charcoal/45 block text-[9px] font-bold uppercase tracking-wide">Driver Assigned</span>
                      <span className="text-charcoal font-bold mt-0.5 block">{trip.driver}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/45 block text-[9px] font-bold uppercase tracking-wide">Distance</span>
                      <span className="text-charcoal font-bold mt-0.5 block font-mono">{trip.distance} km</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-charcoal/45 block text-[9px] font-bold uppercase tracking-wide">Start Time</span>
                      <span className="text-charcoal mt-0.5 block">{new Date(trip.startTime).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/45 block text-[9px] font-bold uppercase tracking-wide">Expected ETA</span>
                      <span className="text-[#C59B27] font-bold mt-0.5 block">{new Date(trip.eta).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {(trip.status === 'In Progress' || trip.status === 'Delayed' || trip.status === 'Completed') && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] font-bold text-charcoal/50 mb-1">
                      <span>PROGRESS</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-charcoal/10 overflow-hidden">
                      <div 
                        className="h-full bg-gold rounded-full transition-all duration-300"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-charcoal/5 pt-4 mt-5 flex items-center justify-end space-x-2">
                {trip.status === 'Scheduled' && (
                  <button
                    onClick={() => handleStartTrip(trip.tripId)}
                    className="flex items-center space-x-1.5 rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal hover:bg-charcoal/5"
                  >
                    <Play className="h-3.5 w-3.5 fill-charcoal" />
                    <span>Start Journey</span>
                  </button>
                )}
                {(trip.status === 'In Progress' || trip.status === 'Delayed') && (
                  <button
                    onClick={() => handleCompleteTrip(trip.tripId)}
                    className="flex items-center space-x-1.5 rounded-lg bg-green-700 text-[#FAF9F6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-green-800"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Complete Trip</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-[#FAF9F6] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4 bg-[#F5F2EB]">
              <h3 className="text-lg font-bold text-charcoal brand-heading">Dispatch New Journey</h3>
              <button onClick={() => setCreateModalOpen(false)} className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal/5">
                <X className="h-4 w-4 text-charcoal/60" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Select Truck</label>
                  <select
                    value={formData.truck}
                    onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  >
                    {trucks.map(t => (
                      <option key={t.truckId} value={t.truckId}>{t.truckId} ({t.model})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Select Driver</label>
                  <select
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  >
                    {drivers.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Origin City</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Bengaluru"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Destination City</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Chennai"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="350"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Start Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress (Active)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Arrival Date (ETA)</label>
                  <input
                    type="date"
                    value={formData.eta}
                    onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-charcoal/15 px-4 py-2 text-xs font-semibold text-charcoal hover:bg-charcoal/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
