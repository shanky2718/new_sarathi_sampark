'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MapTruckData {
  id: string;
  driver: string;
  origin: string;
  destination: string;
  speed: number;
  eta: string;
  progress: number;
  coords: { x: number; y: number };
  status: 'Active' | 'Delayed' | 'Maintenance' | 'Available';
}

interface SimulatedMapProps {
  activeTruckId?: string;
  onTruckSelect?: (id: string) => void;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({ activeTruckId, onTruckSelect }) => {
  const cities = [
    { name: 'Delhi', x: 260, y: 80 },
    { name: 'Jaipur', x: 210, y: 110 },
    { name: 'Ahmedabad', x: 140, y: 170 },
    { name: 'Mumbai', x: 160, y: 260 },
    { name: 'Pune', x: 190, y: 280 },
    { name: 'Hyderabad', x: 330, y: 300 },
    { name: 'Bengaluru', x: 310, y: 380 },
    { name: 'Chennai', x: 370, y: 390 },
    { name: 'Kolkata', x: 580, y: 180 },
    { name: 'Vijayawada', x: 390, y: 330 },
    { name: 'Nellore', x: 380, y: 360 }
  ];

  const routeLines = [
    { from: 'Delhi', to: 'Jaipur' },
    { from: 'Jaipur', to: 'Ahmedabad' },
    { from: 'Ahmedabad', to: 'Mumbai' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Pune', to: 'Hyderabad' },
    { from: 'Hyderabad', to: 'Bengaluru' },
    { from: 'Bengaluru', to: 'Chennai' },
    { from: 'Chennai', to: 'Nellore' },
    { from: 'Nellore', to: 'Vijayawada' },
    { from: 'Vijayawada', to: 'Kolkata' },
    { from: 'Delhi', to: 'Kolkata' }
  ];

  const [trucks, setTrucks] = useState<MapTruckData[]>([
    { id: 'TRK-101', driver: 'Rahul Kumar', origin: 'Bengaluru', destination: 'Chennai', speed: 65, eta: '2h 15m', progress: 75, coords: { x: 355, y: 387 }, status: 'Active' },
    { id: 'TRK-103', driver: 'Sandeep Sharma', origin: 'Delhi', destination: 'Jaipur', speed: 58, eta: '1h 05m', progress: 90, coords: { x: 215, y: 107 }, status: 'Active' },
    { id: 'TRK-104', driver: 'Amit Patel', origin: 'Chennai', destination: 'Kolkata', speed: 45, eta: '22h 30m', progress: 42, coords: { x: 420, y: 300 }, status: 'Delayed' },
    { id: 'TRK-108', driver: 'Gopal Dutt', origin: 'Gurugram', destination: 'Chandigarh', speed: 62, eta: '2h 45m', progress: 60, coords: { x: 260, y: 65 }, status: 'Active' },
    { id: 'TRK-110', driver: 'Vijay Prasad', origin: 'Delhi', destination: 'Lucknow', speed: 70, eta: '3h 12m', progress: 80, coords: { x: 310, y: 90 }, status: 'Active' },
    { id: 'TRK-111', driver: 'Harish Rao', origin: 'Hyderabad', destination: 'Vijayawada', speed: 52, eta: '3h 45m', progress: 30, coords: { x: 348, y: 309 }, status: 'Active' },
    { id: 'TRK-114', driver: 'Anil Kumar', origin: 'Hubballi', destination: 'Bengaluru', speed: 60, eta: '1h 50m', progress: 85, coords: { x: 270, y: 360 }, status: 'Active' }
  ]);

  const [selectedTruck, setSelectedTruck] = useState<MapTruckData | null>(null);

  useEffect(() => {
    if (activeTruckId) {
      const trk = trucks.find(t => t.id === activeTruckId);
      if (trk) setSelectedTruck(trk);
    }
  }, [activeTruckId, trucks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrucks(prev => prev.map(t => {
        let newProgress = t.progress + 0.2;
        if (newProgress >= 100) newProgress = 10;
        
        const originCity = cities.find(c => c.name === t.origin) || cities[0];
        const destCity = cities.find(c => c.name === t.destination) || cities[1];
        
        const newX = originCity.x + (destCity.x - originCity.x) * (newProgress / 100);
        const newY = originCity.y + (destCity.y - originCity.y) * (newProgress / 100);

        return {
          ...t,
          progress: Math.round(newProgress * 10) / 10,
          coords: { x: Math.round(newX), y: Math.round(newY) }
        };
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleMarkerClick = (trk: MapTruckData) => {
    setSelectedTruck(trk);
    if (onTruckSelect) onTruckSelect(trk.id);
  };

  const getCityCoords = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    return city ? { x: city.x, y: city.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full rounded-xl border border-charcoal/10 bg-[#EFECE6] p-2 shadow-inner overflow-hidden aspect-[16/9]">
      <svg 
        viewBox="0 0 800 450" 
        className="w-full h-full text-charcoal/30 select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {routeLines.map((route, i) => {
          const fromCoords = getCityCoords(route.from);
          const toCoords = getCityCoords(route.to);
          return (
            <line
              key={i}
              x1={fromCoords.x}
              y1={fromCoords.y}
              x2={toCoords.x}
              y2={toCoords.y}
              stroke="#D4CEBF"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          );
        })}

        {cities.map((city, i) => (
          <g key={i}>
            <circle cx={city.x} cy={city.y} r="5" fill="#1E1E1C" className="opacity-20" />
            <circle cx={city.x} cy={city.y} r="2.5" fill="#1E1E1C" />
            <text 
              x={city.x} 
              y={city.y - 8} 
              textAnchor="middle" 
              className="text-[9px] font-bold fill-charcoal/60 uppercase tracking-wider font-sans"
            >
              {city.name}
            </text>
          </g>
        ))}

        {trucks.map((t) => {
          const isSelected = selectedTruck?.id === t.id;
          const color = t.status === 'Delayed' ? '#EF6C00' : '#2E7D32';
          return (
            <g key={t.id} onClick={() => handleMarkerClick(t)} className="cursor-pointer group">
              <circle
                cx={t.coords.x}
                cy={t.coords.y}
                r={isSelected ? "14" : "9"}
                fill={color}
                opacity={isSelected ? "0.3" : "0.15"}
                className={isSelected ? "animate-ping" : ""}
              />
              <circle
                cx={t.coords.x}
                cy={t.coords.y}
                r="6"
                fill={color}
                stroke="#FAF9F6"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {selectedTruck && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-4 shadow-xl z-10 animate-fade-in">
          <div className="flex items-center justify-between border-b border-charcoal/5 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-charcoal text-[#FAF9F6] text-xs font-bold font-mono">
                {selectedTruck.id}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                selectedTruck.status === 'Delayed' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {selectedTruck.status === 'Delayed' ? '⚠️ Delayed' : '🟢 Active'}
              </span>
            </div>
            <button 
              onClick={() => setSelectedTruck(null)}
              className="h-6 w-6 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal/5"
            >
              <X className="h-3 w-3 text-charcoal/50" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-charcoal/50 font-medium">Driver:</span>
              <span className="font-semibold text-charcoal">{selectedTruck.driver}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-charcoal/50 font-medium">Route:</span>
              <span className="font-semibold text-charcoal">{selectedTruck.origin} → {selectedTruck.destination}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-charcoal/50 font-medium">Speed:</span>
              <span className="font-semibold text-charcoal">{selectedTruck.speed} km/h</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-charcoal/50 font-medium">ETA:</span>
              <span className="font-semibold text-charcoal">{selectedTruck.eta}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-bold text-charcoal/50 mb-1">
                <span>PROGRESS</span>
                <span>{selectedTruck.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-charcoal/10 overflow-hidden">
                <div 
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${selectedTruck.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-[#FAF9F6]/90 backdrop-blur-sm rounded-lg border border-charcoal/10 p-2 shadow text-[10px] space-y-1 font-medium select-none">
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
          <span>Active Transit</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
          <span>Delayed Route</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-charcoal/50" />
          <span>Trade Corridor</span>
        </div>
      </div>
    </div>
  );
};

export default SimulatedMap;
