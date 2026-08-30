import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (truckData: any) => Promise<void>;
  availableDrivers: string[];
}

export const AddTruckModal: React.FC<AddTruckModalProps> = ({ isOpen, onClose, onAdd, availableDrivers }) => {
  const [formData, setFormData] = useState({
    truckId: '',
    plateNumber: '',
    model: '',
    type: 'Container',
    capacity: '',
    location: '',
    mileage: '',
    driver: 'Unassigned',
    insuranceExpiry: '',
    fitnessExpiry: '',
    pucExpiry: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.truckId.trim()) errs.truckId = 'Truck ID is required (e.g. TRK-121)';
    else if (!/^TRK-\d+$/.test(formData.truckId)) errs.truckId = 'Format must be TRK-[number] (e.g. TRK-101)';

    if (!formData.plateNumber.trim()) errs.plateNumber = 'License plate number is required';
    if (!formData.model.trim()) errs.model = 'Truck model is required';
    if (!formData.capacity.trim()) errs.capacity = 'Capacity is required (e.g. 25 Tons)';
    if (!formData.location.trim()) errs.location = 'Current location is required';
    
    if (!formData.mileage.trim()) errs.mileage = 'Current mileage is required';
    else if (isNaN(Number(formData.mileage))) errs.mileage = 'Mileage must be a number';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onAdd(formData);
      setFormData({
        truckId: '',
        plateNumber: '',
        model: '',
        type: 'Container',
        capacity: '',
        location: '',
        mileage: '',
        driver: 'Unassigned',
        insuranceExpiry: '',
        fitnessExpiry: '',
        pucExpiry: ''
      });
      onClose();
    } catch (err: any) {
      setErrors({ server: err.message || 'Failed to add vehicle' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-xl border border-charcoal/10 bg-[#FAF9F6] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4 bg-[#F5F2EB]">
          <h3 className="text-lg font-bold text-charcoal brand-heading">Register New Truck</h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal/5"
          >
            <X className="h-4 w-4 text-charcoal/60" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {errors.server && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.server}</span>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck ID *</label>
              <input
                type="text"
                name="truckId"
                value={formData.truckId}
                onChange={handleChange}
                placeholder="TRK-121"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.truckId ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.truckId && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.truckId}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Plate Number *</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                placeholder="KA-03-PL-9081"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.plateNumber ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.plateNumber && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.plateNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Tata Prima 4930.S"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.model ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.model && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              >
                <option value="Container">Container</option>
                <option value="Trailer">Trailer</option>
                <option value="Open Body">Open Body</option>
                <option value="Box Body">Box Body</option>
                <option value="Dumper">Dumper</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Capacity *</label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="25 Tons"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.capacity ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.capacity && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Current Mileage (km) *</label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="45000"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.mileage ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.mileage && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.mileage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Current Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bengaluru"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.location ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
                }`}
              />
              {errors.location && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Assign Driver</label>
              <select
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              >
                <option value="Unassigned">Unassigned</option>
                {availableDrivers.map((driverName, i) => (
                  <option key={i} value={driverName}>{driverName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expiry Dates */}
          <div className="border-t border-charcoal/10 pt-4 mt-2">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Compliance & Expiries (Optional)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-charcoal/50 uppercase tracking-wide mb-1">Insurance</label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-charcoal/15 px-2 py-1.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal/50 uppercase tracking-wide mb-1">Fitness Cert.</label>
                <input
                  type="date"
                  name="fitnessExpiry"
                  value={formData.fitnessExpiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-charcoal/15 px-2 py-1.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal/50 uppercase tracking-wide mb-1">PUC Expiry</label>
                <input
                  type="date"
                  name="pucExpiry"
                  value={formData.pucExpiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-charcoal/15 px-2 py-1.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-charcoal/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2 text-sm font-medium hover:bg-charcoal-dark hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4 text-[#C59B27]" />
              <span>{submitting ? 'Adding...' : 'Add Truck'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default AddTruckModal;
