'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  icon?: any;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle,
  description,
  icon: Icon, 
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-500/30 flex flex-col justify-between group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">{title}</span>
          <h3 className="text-2xl font-black text-[#0B1320] mt-1 tracking-tight">
            {value}
          </h3>
          {(subtitle || description) && (
            <p className="text-xs text-charcoal/60 mt-0.5 font-medium">{subtitle || description}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-[#0B1320] border border-stone-200">
            {typeof Icon === 'function' ? <Icon className="h-5 w-5 text-amber-700" /> : Icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
