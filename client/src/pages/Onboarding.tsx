import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Check, ArrowRight, ArrowLeft, Building, Truck, UserCheck, Shield, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { onboardComplete, user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: 'Transporter',
    city: '',
    fleetSize: '5-20',
    truckId: 'TRK-101',
    plateNumber: '',
    truckModel: '',
    driverName: '',
    driverPhone: '',
    driverLicense: ''
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    try {
      // 1. Submit first truck if entered
      if (formData.plateNumber && formData.truckModel) {
        await api.trucks.create({
          truckId: formData.truckId || `TRK-${Math.floor(100 + Math.random() * 900)}`,
          plateNumber: formData.plateNumber,
          model: formData.truckModel,
          type: 'Container',
          capacity: '25 Tons',
          driver: formData.driverName || 'Unassigned',
          location: formData.city || 'Bengaluru',
          mileage: 15000
        });
      }

      // 2. Submit first driver if entered
      if (formData.driverName && formData.driverPhone && formData.driverLicense) {
        await api.drivers.create({
          name: formData.driverName,
          phone: formData.driverPhone,
          licenseNumber: formData.driverLicense,
          assignedTruck: formData.plateNumber ? formData.truckId : 'Unassigned'
        });
      }

      // 3. Mark user as onboarded in AuthContext & redirect
      await onboardComplete();
      onComplete();
    } catch (err) {
      console.error(err);
      // Fallback complete in case offline fails
      await onboardComplete();
      onComplete();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal">
              <Building className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal brand-heading">Tell us about your business</h3>
              <p className="text-xs text-charcoal/50 mt-1">Provide basic metadata about your shipping operations</p>
            </div>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Company Entity Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                >
                  <option value="Transporter">Transporter (Fleet Owner)</option>
                  <option value="Broker">Freight Broker Agency</option>
                  <option value="Contractor">Enterprise Shipping Contractor</option>
                  <option value="Customer">Commercial Cargo Sender</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">HQ City Location</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal">
              <Truck className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal brand-heading">How many trucks do you manage?</h3>
              <p className="text-xs text-charcoal/50 mt-1">Estimate the capacity scale of your active vehicle roster</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {['1-5', '5-20', '20-50', '50+'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, fleetSize: size })}
                  className={`rounded-xl border p-4 text-center font-bold text-sm transition-all ${
                    formData.fleetSize === size 
                      ? 'border-[#C59B27] bg-[#FAF9F6] text-charcoal ring-1 ring-[#C59B27]' 
                      : 'border-charcoal/10 bg-white/50 text-charcoal/60 hover:bg-charcoal/5'
                  }`}
                >
                  {size} Trucks
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal">
              <Truck className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal brand-heading">Add your first truck</h3>
              <p className="text-xs text-charcoal/50 mt-1">Enter compliance details for your first commercial vehicle</p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck ID</label>
                  <input
                    type="text"
                    value={formData.truckId}
                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                    placeholder="TRK-101"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    placeholder="KA-01-MJ-2034"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Truck Model Name</label>
                <input
                  type="text"
                  value={formData.truckModel}
                  onChange={(e) => setFormData({ ...formData, truckModel: e.target.value })}
                  placeholder="e.g. Tata Prima 4930.S"
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal/5 text-charcoal">
              <UserCheck className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-charcoal brand-heading">Add your first driver</h3>
              <p className="text-xs text-charcoal/50 mt-1">Assign a commercial driver log to the registered vehicle</p>
            </div>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="Rahul Kumar"
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    placeholder="+91-9876543210"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">License Number</label>
                  <input
                    type="text"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                    placeholder="DL-14201300984"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 text-center py-6 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#C59B27] mx-auto border-pulse border">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-charcoal brand-heading">You are ready to manage your fleet!</h3>
              <p className="text-xs text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                Sarathi Connect has successfully configured your shipping profile. You can now track freight paths, schedule deliveries, and audit FASTag toll expenses.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col justify-center items-center p-6 font-sans">
      
      {/* Container */}
      <div className="w-full max-w-md rounded-2xl border border-charcoal/10 bg-[#FAF9F6] p-8 shadow-2xl space-y-8 flex flex-col justify-between min-h-[460px]">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-charcoal/5 pb-4">
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  s === step 
                    ? 'bg-charcoal text-[#F5F2EB]' 
                    : s < step 
                      ? 'bg-green-700 text-[#FAF9F6]' 
                      : 'border border-charcoal/10 bg-white/40 text-charcoal/40'
                }`}>
                  {s < step ? <Check className="h-3 w-3" /> : `0${s}`}
                </div>
                {s < 5 && <span className="text-charcoal/20 text-xs">→</span>}
              </React.Fragment>
            ))}
          </div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Step {step} of 5</span>
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-charcoal/5 mt-6">
          {step > 1 && step < 5 ? (
            <button
              onClick={handleBack}
              className="flex items-center space-x-1.5 rounded-lg border border-charcoal/10 px-4 py-2.5 text-xs font-semibold text-charcoal/70 hover:bg-charcoal/5 transition-colors"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNext}
                className="text-xs font-bold text-charcoal/50 hover:text-charcoal px-3 py-2"
              >
                Skip Step
              </button>
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 rounded-lg bg-charcoal text-[#F5F2EB] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow hover:shadow-md transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 text-[#C59B27]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-charcoal text-[#F5F2EB] py-3 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-md hover:shadow-lg transition-all"
            >
              <span>Launch Operations Dashboard</span>
              <ArrowRight className="h-4 w-4 text-[#C59B27]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default Onboarding;
