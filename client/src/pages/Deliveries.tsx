import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, ChevronDown, ChevronUp, CheckCircle, Navigation, Package, ClipboardCheck, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import { TripProgressTracker } from '../components/TripProgressTracker';

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await api.deliveries.getAll();
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const statusSequence = ['Order Confirmed', 'Picked Up', 'In Transit', 'Near Destination', 'Delivered'];
    const currentIndex = statusSequence.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < statusSequence.length - 1) {
      const nextStatus = statusSequence[currentIndex + 1];
      try {
        const updated = await api.deliveries.update(id, nextStatus);
        setDeliveries(prev => prev.map(d => d.deliveryId === id ? updated : d));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filtered = deliveries.filter(d => 
    d.deliveryId.toLowerCase().includes(search.toLowerCase()) ||
    d.customer.toLowerCase().includes(search.toLowerCase()) ||
    d.pickup.toLowerCase().includes(search.toLowerCase()) ||
    d.destination.toLowerCase().includes(search.toLowerCase()) ||
    d.truck.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Freight Operations</p>
        <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Shipment Delivery Manifests</h3>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-charcoal/10 bg-[#FAF9F6] p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search deliveries by customer, ID, city, truck..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 bg-white py-2 pl-9 pr-4 text-xs text-charcoal placeholder-charcoal/45 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Active Manifests: {deliveries.length}</span>
      </div>

      {/* Accordion List */}
      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="h-8 w-8 text-charcoal/40 animate-spin mx-auto" />
          <p className="text-xs text-charcoal/50 mt-2 font-medium">Fetching manifest registries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-charcoal/10 rounded-xl bg-[#FAF9F6] py-20 text-center space-y-3">
          <ShieldCheck className="h-10 w-10 text-charcoal/20 mx-auto" />
          <p className="text-sm font-bold text-charcoal leading-none">No cargo manifests matching filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((del) => {
            const isExpanded = expandedId === del.deliveryId;
            return (
              <div 
                key={del.deliveryId}
                className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                
                {/* Visible Card Summary */}
                <div 
                  onClick={() => toggleExpand(del.deliveryId)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal font-semibold text-xs">
                      {del.deliveryId.split('-')[1]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-charcoal text-sm leading-none font-mono">{del.deliveryId}</h4>
                        <span className="text-[10px] font-bold text-[#C59B27]">{del.customer}</span>
                      </div>
                      <p className="text-[11px] text-charcoal/50 font-medium mt-1.5">{del.pickup} → {del.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 text-xs">
                    <div className="hidden lg:block text-right">
                      <span className="block text-[9px] text-charcoal/45 uppercase tracking-wide">Expected Date</span>
                      <span className="font-bold text-charcoal mt-0.5 block">{new Date(del.expectedDelivery).toLocaleDateString()}</span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        del.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gold/5 border-gold/15 text-gold-dark'
                      }`}>
                        {del.status}
                      </span>
                    </div>

                    <div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-charcoal/40" /> : <ChevronDown className="h-5 w-5 text-charcoal/40" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-charcoal/5 bg-[#F5F2EB]/20 space-y-6 animate-fade-in">
                    
                    {/* Stepper tracker */}
                    <div className="bg-white rounded-xl border border-charcoal/5 p-4 shadow-inner">
                      <TripProgressTracker status={del.status} />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">Assigned Truck</span>
                          <span className="font-bold text-charcoal font-mono mt-0.5 block">{del.truck}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">Driver</span>
                          <span className="font-bold text-charcoal mt-0.5 block">{del.driver}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">Expected Arrival</span>
                          <span className="font-bold text-charcoal mt-0.5 block">{new Date(del.expectedDelivery).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {del.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(del.deliveryId, del.status)}
                          className="rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-sm"
                        >
                          Advance Dispatch Step
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default Deliveries;
