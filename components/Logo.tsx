'use client';

import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const [imgError, setImgError] = useState(false);

  const logoHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-11';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className="flex items-center space-x-3 select-none">
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Sarathi Samparka Logo"
          onError={() => setImgError(true)}
          className={`${logoHeight} w-auto object-contain rounded-xl shadow-xs`}
        />
      ) : (
        <div className={`flex items-center justify-center ${logoHeight} w-11 rounded-xl bg-[#0B1320] text-amber-400 shadow-md border border-amber-400/30`}>
          <Truck className={iconSize} />
        </div>
      )}

      {showText && (
        <div className="leading-tight">
          <span className={`${titleSize} font-black tracking-tight text-[#0B1320] block font-sans`}>
            SARATHI <span className="text-amber-600">SAMPARKA</span>
          </span>
          <span className={`${subSize} uppercase tracking-wider text-amber-700 font-bold block font-mono`}>
            Freight Optimisation
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
