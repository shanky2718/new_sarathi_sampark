import React, { useState, useEffect } from 'react';
import { Truck as TruckIcon, Plus, Search, Filter, Wrench, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import { AddTruckModal } from '../components/AddTruckModal';

export const Fleet: React.FC = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const [truckData, driverData] = await Promise.all([
        api.trucks.getAll(),
        api.drivers.getAll()
      ]);
      setTrucks(truckData);
      setDrivers(driverData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleAddTruck = async (formData: any) => {
    try {
      const newTruck = await api.trucks.create(formData);
      setTrucks(prev => [newTruck, ...prev]);
      showToast(`Truck ${formData.truckId} successfully registered in fleet!`, 'success');
    } catch (err: any) {
      throw err;
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Filter logic
  const filteredTrucks = trucks.filter(t => {
    const matchesSearch = 
      t.truckId.toLowerCase().includes(search.toLowerCase()) ||
      t.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.model.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'Delayed':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Maintenance':
        return 'bg-red-50 text-red-800 border-red-200';
      default: // Available
        return 'bg-charcoal/5 text-charcoal/70 border-charcoal/10';
    }
  };

  // List of unassigned drivers for the modal
  const assignedDrivers = trucks.map(t => t.driver).filter(d => d !== 'Unassigned');
  const availableDrivers = drivers
    .map(d => d.name)
    .filter(name => !assignedDrivers.includes(name));

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      
      {/* Toast notifications */}
      {toast && (
        <div className={`
          fixed top-4 right-4 z-50 rounded-xl px-5 py-3.5 shadow-2xl border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 animate-fade-in
          ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
        `}>
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Roster Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Fleet Operations</p>
          <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Registered Commercial Vehicles</h3>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 text-[#C59B27]" />
          <span>Add Fleet Truck</span>
        </button>
      </div>

      {/* Filters & Search Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-charcoal/10 bg-[#FAF9F6] p-4 rounded-xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search ID, model, plate, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 bg-white py-2 pl-9 pr-4 text-xs text-charcoal placeholder-charcoal/45 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Active', 'Available', 'Delayed', 'Maintenance'].map((status) => (
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

      {/* Roster Grid list */}
      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="h-8 w-8 text-charcoal/40 animate-spin mx-auto" />
          <p className="text-xs text-charcoal/50 mt-2 font-medium">Fetching fleet logs...</p>
        </div>
      ) : filteredTrucks.length === 0 ? (
        <div className="border border-charcoal/10 rounded-xl bg-[#FAF9F6] py-20 text-center space-y-3">
          <TruckIcon className="h-10 w-10 text-charcoal/20 mx-auto" />
          <p className="text-sm font-bold text-charcoal leading-none">No vehicles match filters</p>
          <p className="text-xs text-charcoal/50 font-medium">Try updating search spelling or checking status parameters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrucks.map((truck) => (
            <div 
              key={truck.truckId}
              className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              
              {/* Card Header info */}
              <div className="bg-[#F5F2EB] p-4 flex items-center justify-between border-b border-charcoal/10">
                <div className="flex items-center space-x-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-charcoal text-[#FAF9F6] text-xs font-mono font-bold">
                    {truck.truckId.split('-')[1]}
                  </span>
                  <div>
                    <h4 className="font-bold text-charcoal text-xs font-mono">{truck.truckId}</h4>
                    <span className="text-[10px] text-charcoal/50 font-medium">{truck.plateNumber}</span>
                  </div>
                </div>

                <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(truck.status)}`}>
                  {truck.status}
                </span>
              </div>

              {/* Card Body parameters */}
              <div className="p-4 space-y-3.5 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Model:</span>
                  <span className="text-charcoal font-semibold">{truck.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Driver:</span>
                  <span className="text-charcoal font-semibold">{truck.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Last Station:</span>
                  <span className="text-charcoal font-semibold">{truck.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/50">Odometer:</span>
                  <span className="text-charcoal font-semibold font-mono">{truck.mileage.toLocaleString()} km</span>
                </div>

                {/* Fuel gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-charcoal/55">
                    <span>FUEL LEVEL</span>
                    <span>{truck.fuel}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-charcoal/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        truck.fuel < 20 ? 'bg-red-600' : truck.fuel < 50 ? 'bg-orange-500' : 'bg-green-700'
                      }`}
                      style={{ width: `${truck.fuel}%` }}
                    />
                  </div>
                </div>

                {/* Expiry / Compliance status */}
                <div className="border-t border-charcoal/5 pt-3.5 mt-2 flex items-center justify-between text-[9px] uppercase tracking-wider font-bold text-charcoal/50">
                  <span>PUC: {new Date(truck.pucExpiry).toLocaleDateString(undefined, {month: 'short', year: '2-digit'})}</span>
                  <span>Fitness: {new Date(truck.fitnessExpiry).toLocaleDateString(undefined, {month: 'short', year: '2-digit'})}</span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Truck Modal integration */}
      <AddTruckModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddTruck}
        availableDrivers={availableDrivers}
      />

    </div>
  );
};
export default Fleet;
