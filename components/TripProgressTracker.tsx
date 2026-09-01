'use client';

import React from 'react';
import { Check, Clock, Package, Navigation, MapPin } from 'lucide-react';

interface TripProgressTrackerProps {
  status: 'Order Confirmed' | 'Picked Up' | 'In Transit' | 'Near Destination' | 'Delivered';
}

export const TripProgressTracker: React.FC<TripProgressTrackerProps> = ({ status }) => {
  const steps = [
    { label: 'Order Confirmed', icon: Clock },
    { label: 'Picked Up', icon: Package },
    { label: 'In Transit', icon: Navigation },
    { label: 'Near Destination', icon: MapPin },
    { label: 'Delivered', icon: Check }
  ];

  const getStepIndex = (stat: string) => {
    switch (stat) {
      case 'Order Confirmed': return 0;
      case 'Picked Up': return 1;
      case 'In Transit': return 2;
      case 'Near Destination': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-charcoal/10 z-0" />
        <div 
          className="absolute left-6 top-1/2 h-0.5 -translate-y-1/2 bg-[#C59B27] z-0 transition-all duration-500 ease-out" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`
                flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                ${isCompleted ? 'bg-green-700 border-green-700 text-[#FAF9F6] shadow-sm' : ''}
                ${isActive ? 'bg-[#1E1E1C] border-[#C59B27] text-[#C59B27] scale-110 shadow-md border-pulse' : ''}
                ${isPending ? 'bg-[#FAF9F6] border-charcoal/20 text-charcoal/40' : ''}
              `}>
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[2.5]" />
                ) : (
                  <StepIcon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                )}
              </div>

              <span className={`
                hidden sm:block text-[10px] font-bold uppercase tracking-wider mt-2.5 text-center max-w-[80px]
                ${isActive ? 'text-charcoal' : 'text-charcoal/50'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripProgressTracker;
