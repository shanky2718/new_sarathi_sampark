'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  Package, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Fuel, 
  TrendingUp, 
  Search, 
  Filter, 
  Clock, 
  Truck as TruckIcon, 
  Info,
  X,
  Plus
} from 'lucide-react';
import { ReturnLoad } from '@/lib/localData';

const ReturnLoads: React.FC = () => {
  const { loads, trucks, acceptReturnLoad, addReturnLoad } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPickup, setSelectedPickup] = useState('All');
  const [selectedDest, setSelectedDest] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'profit' | 'price' | 'distance'>('profit');

  const [selectedLoad, setSelectedLoad] = useState<ReturnLoad | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [loadToAccept, setLoadToAccept] = useState<ReturnLoad | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('');
  const [showPostModal, setShowPostModal] = useState(false);

  const [newLoadForm, setNewLoadForm] = useState({
    pickup: 'Chennai',
    destination: 'Bengaluru',
    distance: 350,
    cargo: 'Auto Spare Parts',
    weight: '10 Tons',
    offeredPrice: 20000,
    estimatedFuelCost: 6500,
    shipperName: 'TVS Logistics Network',
    shipperRating: 4.8,
    requiredTruckType: 'Container'
  });

  const pickupCities = Array.from(new Set(loads.map(l => l.pickup)));
  const destCities = Array.from(new Set(loads.map(l => l.destination)));

  const filteredLoads = loads.filter(load => {
    const matchesSearch = 
      load.loadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.shipperName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPickup = selectedPickup === 'All' || load.pickup === selectedPickup;
    const matchesDest = selectedDest === 'All' || load.destination === selectedDest;
    const matchesVerified = !verifiedOnly || load.verifiedShipper;

    return matchesSearch && matchesPickup && matchesDest && matchesVerified;
  }).sort((a, b) => {
    if (sortBy === 'profit') return b.estimatedProfit - a.estimatedProfit;
    if (sortBy === 'price') return b.offeredPrice - a.offeredPrice;
    return a.distance - b.distance;
  });

  const handleOpenAcceptModal = (load: ReturnLoad) => {
    setLoadToAccept(load);
    const available = trucks.find(t => t.status === 'Available');
    setSelectedTruckId(available ? available.truckId : trucks[0]?.truckId || 'TRK-102');
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = () => {
    if (!loadToAccept || !selectedTruckId) return;
    const success = acceptReturnLoad(loadToAccept.loadId, selectedTruckId);
    if (success) {
      setShowAcceptModal(false);
      setLoadToAccept(null);
      if (selectedLoad?.loadId === loadToAccept.loadId) {
        setSelectedLoad(null);
      }
    }
  };

  const handlePostLoadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estProfit = newLoadForm.offeredPrice - newLoadForm.estimatedFuelCost;
    addReturnLoad({
      ...newLoadForm,
      estimatedProfit: estProfit,
      verifiedShipper: true,
      pickupDate: new Date().toISOString().split('T')[0]
    });
    setShowPostModal(false);
  };

  const availableCount = loads.filter(l => l.status === 'Available').length;
  const avgProfit = Math.round(
    loads.reduce((acc, l) => acc + l.estimatedProfit, 0) / (loads.length || 1)
  );

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Core Marketplace
            </span>
            <span className="text-xs text-charcoal/60 font-medium">Real-time Verified Return Freight</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            Return Load Marketplace
          </h1>
          <p className="text-sm text-charcoal/70">
            Eliminate empty return runs. Compare high-profit backhaul freight across India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-[#0B1320] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-md"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            Post Return Freight
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Available Loads</p>
            <p className="text-2xl font-extrabold text-[#0B1320] mt-1">{availableCount}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Ready for instant dispatch</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Package className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Avg Return Profit</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">₹{avgProfit.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Per return journey</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Return Load Margin</p>
            <p className="text-2xl font-extrabold text-[#0B1320] mt-1">68.4%</p>
            <p className="text-xs text-blue-600 font-medium mt-1">After fuel costs</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Empty Run Savings</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">31% Less</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Empty return reduction</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <Fuel className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search by Load ID, City (e.g. Chennai), Cargo, Shipper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1320]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-charcoal/60 font-semibold uppercase whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#FAF9F6] border border-stone-200 rounded-xl text-sm font-medium focus:outline-none"
            >
              <option value="profit">Highest Profit (₹)</option>
              <option value="price">Highest Offered Price</option>
              <option value="distance">Shortest Distance (KM)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-charcoal/70">
              <Filter className="h-3.5 w-3.5 text-charcoal/50" />
              <span>Filters:</span>
            </div>

            <select
              value={selectedPickup}
              onChange={(e) => setSelectedPickup(e.target.value)}
              className="px-2.5 py-1.5 bg-[#FAF9F6] border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="All">Pickup City: All</option>
              {pickupCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="px-2.5 py-1.5 bg-[#FAF9F6] border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="All">Destination City: All</option>
              {destCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-charcoal/80">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-[#0B1320] focus:ring-0"
              />
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 inline" />
              Verified Shippers Only
            </label>
          </div>

          <div className="text-charcoal/60 font-medium">
            Showing <span className="font-bold text-[#0B1320]">{filteredLoads.length}</span> return load opportunities
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLoads.map((load) => {
          const isAvailable = load.status === 'Available';

          return (
            <div
              key={load.loadId}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                isAvailable ? 'border-stone-200 hover:border-amber-400' : 'border-stone-200 bg-stone-50/70 opacity-80'
              }`}
            >
              <div>
                <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#0B1320]">{load.loadId}</span>
                    {load.verifiedShipper && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-charcoal/50 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {load.postedTime}
                  </span>
                </div>

                <div className="p-4 bg-white border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-charcoal/50 uppercase font-semibold">Origin</p>
                      <p className="text-base font-bold text-[#0B1320] flex items-center gap-1 mt-0.5">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        {load.pickup}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-charcoal/60 px-2 py-0.5 bg-stone-100 rounded-full">
                        {load.distance} KM
                      </span>
                      <ArrowRight className="h-4 w-4 text-amber-600 my-1" />
                      <span className="text-[10px] text-charcoal/50">Return Route</span>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-charcoal/50 uppercase font-semibold">Destination</p>
                      <p className="text-base font-bold text-[#0B1320] flex items-center justify-end gap-1 mt-0.5">
                        {load.destination}
                        <MapPin className="h-4 w-4 text-rose-600" />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal/60 font-medium">Cargo Material:</span>
                    <span className="font-semibold text-charcoal flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-amber-600" />
                      {load.cargo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal/60 font-medium">Weight / Truck Req:</span>
                    <span className="font-semibold text-charcoal">
                      {load.weight} • {load.requiredTruckType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal/60 font-medium">Shipper Company:</span>
                    <span className="font-semibold text-charcoal flex items-center gap-1">
                      {load.shipperName}
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        ★ {load.shipperRating}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-charcoal/60">Freight Offered:</span>
                      <span className="font-bold text-[#0B1320]">₹{load.offeredPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-charcoal/60 flex items-center gap-1">
                        <Fuel className="h-3 w-3 text-amber-600" />
                        Est. Fuel Expense:
                      </span>
                      <span className="font-medium text-rose-700">- ₹{load.estimatedFuelCost.toLocaleString()}</span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">Estimated Net Profit:</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        ₹{load.estimatedProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-[#FAF9F6] flex items-center gap-2">
                <button
                  onClick={() => setSelectedLoad(load)}
                  className="flex-1 py-2 px-3 border border-stone-300 rounded-xl text-xs font-semibold text-charcoal hover:bg-white transition flex items-center justify-center gap-1"
                >
                  <Info className="h-3.5 w-3.5 text-charcoal/60" />
                  View Details
                </button>

                {isAvailable ? (
                  <button
                    onClick={() => handleOpenAcceptModal(load)}
                    className="flex-1 py-2 px-3 bg-[#0B1320] text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                    Accept Load
                  </button>
                ) : (
                  <span className="flex-1 py-2 px-3 bg-stone-200 text-stone-600 rounded-xl text-xs font-semibold text-center">
                    Accepted ({load.acceptedByTruck || 'Dispatched'})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLoads.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <Package className="h-12 w-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal">No return loads matching criteria</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find available backhaul freight across India.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedPickup('All'); setSelectedDest('All'); setVerifiedOnly(false); }}
            className="text-xs font-semibold text-amber-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {selectedLoad && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-[#0B1320] text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">{selectedLoad.loadId}</span>
                <h3 className="text-lg font-bold">Return Load Specifications</h3>
              </div>
              <button 
                onClick={() => setSelectedLoad(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-900">Route Overview</p>
                  <p className="text-base font-extrabold text-[#0B1320] mt-0.5">
                    {selectedLoad.pickup} → {selectedLoad.destination}
                  </p>
                  <p className="text-xs text-charcoal/70">{selectedLoad.distance} KM • Estimated Transit Time: {Math.round(selectedLoad.distance / 50)} hrs</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-emerald-800">Net Profit</p>
                  <p className="text-xl font-extrabold text-emerald-700">₹{selectedLoad.estimatedProfit.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-charcoal/60">Cargo Description:</span>
                  <p className="font-bold text-charcoal mt-1">{selectedLoad.cargo}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-charcoal/60">Cargo Weight:</span>
                  <p className="font-bold text-charcoal mt-1">{selectedLoad.weight}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-charcoal/60">Truck Type Required:</span>
                  <p className="font-bold text-charcoal mt-1">{selectedLoad.requiredTruckType}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-charcoal/60">Pickup Target Date:</span>
                  <p className="font-bold text-charcoal mt-1">{selectedLoad.pickupDate}</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <p className="text-xs font-bold text-[#0B1320] flex items-center justify-between">
                  <span>Shipper Verification</span>
                  {selectedLoad.verifiedShipper && (
                    <span className="text-blue-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Enterprise
                    </span>
                  )}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal/60">Shipper Name:</span>
                  <span className="font-bold text-charcoal">{selectedLoad.shipperName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal/60">Rating & Trust:</span>
                  <span className="font-bold text-amber-700">★ {selectedLoad.shipperRating} / 5.0 Rating</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Accepting this return load automatically generates an active trip schedule and notifies the driver. Payment guarantee secured by Sarathi Sampark Escrow.
                </span>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedLoad(null)}
                className="px-4 py-2 text-xs font-semibold text-charcoal hover:bg-stone-200 rounded-xl"
              >
                Close
              </button>
              {selectedLoad.status === 'Available' && (
                <button
                  onClick={() => {
                    handleOpenAcceptModal(selectedLoad);
                  }}
                  className="px-5 py-2 bg-[#0B1320] text-white text-xs font-semibold rounded-xl hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  Accept & Assign Truck
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAcceptModal && loadToAccept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 bg-[#0B1320] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold">Confirm Return Load Acceptance</h3>
              </div>
              <button onClick={() => setShowAcceptModal(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-bold text-[#0B1320]">{loadToAccept.loadId}</p>
                <p className="text-charcoal/80 font-medium mt-0.5">
                  {loadToAccept.pickup} → {loadToAccept.destination} ({loadToAccept.distance} KM)
                </p>
                <p className="text-emerald-700 font-extrabold text-sm mt-1">
                  Expected Profit: ₹{loadToAccept.estimatedProfit.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  Select Truck from your Fleet:
                </label>
                <select
                  value={selectedTruckId}
                  onChange={(e) => setSelectedTruckId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1320]"
                >
                  {trucks.map(truck => (
                    <option key={truck.truckId} value={truck.truckId}>
                      {truck.truckId} ({truck.plateNumber}) - {truck.model} [{truck.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-charcoal/70 space-y-1">
                <p className="font-semibold text-charcoal">Automatic Actions upon Acceptance:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Load status set to <strong>Accepted</strong></li>
                  <li>New active trip logged under <strong>Trips</strong> module</li>
                  <li>Assigned truck updated to <strong>Active On Trip</strong></li>
                  <li>Real-time notifications sent to transporter dashboard</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 text-xs font-semibold text-charcoal hover:bg-stone-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAccept}
                className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Acceptance
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#0B1320] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Post New Return Freight Opportunity</h3>
              <button onClick={() => setShowPostModal(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostLoadSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pickup City</label>
                  <input 
                    type="text" 
                    value={newLoadForm.pickup}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, pickup: e.target.value })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Destination City</label>
                  <input 
                    type="text" 
                    value={newLoadForm.destination}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, destination: e.target.value })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Cargo Type</label>
                  <input 
                    type="text" 
                    value={newLoadForm.cargo}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, cargo: e.target.value })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Weight (e.g. 10 Tons)</label>
                  <input 
                    type="text" 
                    value={newLoadForm.weight}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, weight: e.target.value })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Offered Price (₹)</label>
                  <input 
                    type="number" 
                    value={newLoadForm.offeredPrice}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, offeredPrice: Number(e.target.value) })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Est. Fuel Cost (₹)</label>
                  <input 
                    type="number" 
                    value={newLoadForm.estimatedFuelCost}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, estimatedFuelCost: Number(e.target.value) })}
                    required
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Shipper Organization Name</label>
                <input 
                  type="text" 
                  value={newLoadForm.shipperName}
                  onChange={(e) => setNewLoadForm({ ...newLoadForm, shipperName: e.target.value })}
                  required
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium">
                Calculated Net Profit: <strong className="text-emerald-700">₹{(newLoadForm.offeredPrice - newLoadForm.estimatedFuelCost).toLocaleString()}</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B1320] text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Publish Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnLoads;
