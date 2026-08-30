import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (driverData: any) => Promise<void>;
  unassignedTrucks: string[];
}

export const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose, onAdd, unassignedTrucks }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    assignedTruck: 'Unassigned'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Driver name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\+?\d[\d\s-]{8,12}$/.test(formData.phone)) errs.phone = 'Invalid phone number format';
    
    if (!formData.licenseNumber.trim()) errs.licenseNumber = 'Commercial driving license number is required';

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
        name: '',
        phone: '',
        licenseNumber: '',
        assignedTruck: 'Unassigned'
      });
      onClose();
    } catch (err: any) {
      setErrors({ server: err.message || 'Failed to add driver' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-[#FAF9F6] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4 bg-[#F5F2EB]">
          <h3 className="text-lg font-bold text-charcoal brand-heading">Register New Driver</h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal/5"
          >
            <X className="h-4 w-4 text-charcoal/60" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.server && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.server}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Vikram Singh"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98654 32107"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
              }`}
            />
            {errors.phone && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Commercial License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL-14201300984"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.licenseNumber ? 'border-red-500 focus:ring-red-500' : 'border-charcoal/15 focus:border-gold focus:ring-gold'
              }`}
            />
            {errors.licenseNumber && <p className="text-[10px] text-red-600 mt-1 font-semibold">{errors.licenseNumber}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Assign Fleet Truck</label>
            <select
              name="assignedTruck"
              value={formData.assignedTruck}
              onChange={handleChange}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            >
              <option value="Unassigned">Unassigned</option>
              {unassignedTrucks.map((truckId, i) => (
                <option key={i} value={truckId}>{truckId}</option>
              ))}
            </select>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-charcoal/10 mt-6">
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
              <span>{submitting ? 'Registering...' : 'Register'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default AddDriverModal;
