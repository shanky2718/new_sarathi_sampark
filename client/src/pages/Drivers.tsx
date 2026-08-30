import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Star, ShieldAlert, Award, FileText, Phone, Truck, X, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import { AddDriverModal } from '../components/AddDriverModal';

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const [driverData, truckData] = await Promise.all([
        api.drivers.getAll(),
        api.trucks.getAll()
      ]);
      setDrivers(driverData);
      setTrucks(truckData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (formData: any) => {
    try {
      const newDriver = await api.drivers.create(formData);
      setDrivers(prev => [newDriver, ...prev]);
      
      // Update assigned truck list dynamically
      if (formData.assignedTruck && formData.assignedTruck !== 'Unassigned') {
        setTrucks(prev => prev.map(t => 
          t.truckId === formData.assignedTruck ? { ...t, driver: formData.name } : t
        ));
      }

      setToastMessage(`Driver ${formData.name} successfully registered in roster!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.assignedTruck.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 80) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  // Get unassigned trucks list for the modal
  const assignedTruckIds = drivers.map(d => d.assignedTruck).filter(t => t !== 'Unassigned');
  const unassignedTrucks = trucks
    .map(t => t.truckId)
    .filter(id => !assignedTruckIds.includes(id));

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-50 border border-green-200 text-green-800 px-5 py-3.5 shadow-2xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 animate-fade-in">
          <Award className="h-4.5 w-4.5 text-[#C59B27]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Driver Records</p>
          <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Registered Transport Personnel</h3>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 text-[#C59B27]" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-charcoal/10 bg-[#FAF9F6] p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search drivers by name, plate, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 bg-white py-2 pl-9 pr-4 text-xs text-charcoal placeholder-charcoal/45 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Total Active: {drivers.length}</span>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="h-8 w-8 text-charcoal/40 animate-spin mx-auto" />
          <p className="text-xs text-charcoal/50 mt-2 font-medium">Fetching roster details...</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="border border-charcoal/10 rounded-xl bg-[#FAF9F6] py-20 text-center space-y-3">
          <Users className="h-10 w-10 text-charcoal/20 mx-auto" />
          <p className="text-sm font-bold text-charcoal leading-none">No drivers match search query</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <div 
              key={driver.name}
              onClick={() => setSelectedDriver(driver)}
              className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              
              {/* Profile Top header */}
              <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/10 font-extrabold text-charcoal text-base">
                  {driver.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm leading-snug">{driver.name}</h4>
                  <span className="text-[10px] font-semibold text-charcoal/45 font-mono block mt-0.5">{driver.phone}</span>
                </div>
              </div>

              {/* Assignments details */}
              <div className="py-4 space-y-3 text-xs font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/50">Assigned Truck:</span>
                  <span className="font-bold text-charcoal font-mono">{driver.assignedTruck}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/50">Completed Trips:</span>
                  <span className="font-bold text-charcoal">{driver.tripsCompleted} journeys</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/50">Driver Rating:</span>
                  <div className="flex items-center space-x-1 font-bold text-charcoal">
                    <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                    <span>{driver.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Safety score footer */}
              <div className={`
                flex items-center justify-between border rounded-lg p-2.5 text-[10px] font-bold uppercase tracking-wider
                ${getSafetyScoreColor(driver.safetyScore)}
              `}>
                <span>Safety Score Index</span>
                <span className="font-mono text-xs font-black">{driver.safetyScore}%</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Driver Detail Drawer Panel Overlay */}
      {selectedDriver && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#FAF9F6] border-l border-charcoal/15 shadow-2xl p-6 flex flex-col justify-between animate-fade-in">
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gold" />
                <h4 className="text-base font-bold text-charcoal brand-heading">Personnel Record</h4>
              </div>
              <button 
                onClick={() => setSelectedDriver(null)}
                className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal/5"
              >
                <X className="h-4 w-4 text-charcoal/60" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-[#F5F2EB] text-2xl font-bold font-serif shadow">
                  {selectedDriver.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal leading-snug">{selectedDriver.name}</h3>
                  <p className="text-xs font-semibold text-charcoal/50">{selectedDriver.assignedTruck === 'Unassigned' ? 'Not Assigned' : `Assigned to ${selectedDriver.assignedTruck}`}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-charcoal/5 pt-4 text-xs font-medium">
                <h5 className="text-[10px] font-bold text-charcoal/55 uppercase tracking-wider mb-2.5">Documentation & Metrics</h5>
                
                <div className="flex items-center space-x-3.5">
                  <Phone className="h-4 w-4 text-charcoal/40" />
                  <div>
                    <span className="block text-[10px] text-charcoal/50">PHONE NUMBER</span>
                    <span className="font-semibold text-charcoal">{selectedDriver.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <FileText className="h-4 w-4 text-charcoal/40" />
                  <div>
                    <span className="block text-[10px] text-charcoal/50">DRIVING LICENSE</span>
                    <span className="font-semibold text-charcoal font-mono uppercase">{selectedDriver.licenseNumber}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <Truck className="h-4 w-4 text-charcoal/40" />
                  <div>
                    <span className="block text-[10px] text-charcoal/50">VEHICLE ASSIGNMENT STATUS</span>
                    <span className="font-semibold text-charcoal font-mono uppercase">{selectedDriver.assignedTruck}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-charcoal/5 pt-4 text-center">
                <div className="border border-charcoal/10 rounded-lg p-3 bg-white/40">
                  <span className="block text-[9px] font-bold text-charcoal/50 uppercase tracking-wide">Rating Index</span>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="text-lg font-bold text-charcoal font-mono">{selectedDriver.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className={`border rounded-lg p-3 ${getSafetyScoreColor(selectedDriver.safetyScore)}`}>
                  <span className="block text-[9px] font-bold text-charcoal/50 uppercase tracking-wide">Safety Rating</span>
                  <span className="text-lg font-bold font-mono mt-1 block">{selectedDriver.safetyScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="space-y-2 pt-6 border-t border-charcoal/10">
            <button 
              onClick={() => alert(`Initiating phone dispatch to ${selectedDriver.phone}...`)}
              className="w-full rounded-lg bg-charcoal text-[#F5F2EB] py-3 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-sm hover:shadow"
            >
              Dispatch Phone Dial
            </button>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddDriver}
        unassignedTrucks={unassignedTrucks}
      />

    </div>
  );
};
export default Drivers;
