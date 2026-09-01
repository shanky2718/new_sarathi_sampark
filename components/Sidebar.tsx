'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  Compass, 
  Wrench, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut, 
  X,
  FileText,
  ShieldCheck,
  Package,
  Fuel,
  TrendingUp,
  Bell,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { loads, notifications } = useData();

  const availableLoadsCount = loads.filter(l => l.status === 'Available').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', name: 'Fleet', icon: Truck },
    { id: 'drivers', name: 'Drivers', icon: Users },
    { id: 'return-loads', name: 'Return Loads', icon: Package, badge: availableLoadsCount > 0 ? availableLoadsCount : undefined, highlight: true },
    { id: 'trips', name: 'Trips', icon: MapPin },
    { id: 'tracking', name: 'Live Tracking', icon: Compass },
    { id: 'deliveries', name: 'Deliveries', icon: ShieldCheck },
    { id: 'documents', name: 'Digital Documents', icon: FileText },
    { id: 'fuel', name: 'Fuel Management', icon: Fuel },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
    { id: 'expenses', name: 'Expenses', icon: DollarSign },
    { id: 'revenue', name: 'Revenue', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'notifications', name: 'Notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'admin', name: 'Admin Dashboard', icon: ShieldAlert, adminOnly: true }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#0B1320]/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed bottom-0 top-0 left-0 z-50 flex w-72 flex-col 
        border-r border-stone-200 bg-[#F5F3EF] text-[#0B1320]
        transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-20 items-center justify-between border-b border-stone-200 px-6 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/logo.png" 
              alt="Sarathi Samparka Logo" 
              className="h-11 w-auto object-contain rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-base font-black tracking-tight leading-none text-[#0B1320]">
                SARATHI <span className="text-amber-600">SAMPARKA</span>
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-charcoal/60 font-bold mt-0.5">
                Load Optimisation Platform
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-200 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  onClose();
                }}
                className={`
                  flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150
                  ${isActive 
                    ? 'bg-[#0B1320] text-white shadow-md' 
                    : item.highlight 
                    ? 'text-amber-900 bg-amber-100/60 hover:bg-amber-100 border border-amber-300/60' 
                    : 'text-charcoal/80 hover:bg-stone-200/60 hover:text-[#0B1320]'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : item.highlight ? 'text-amber-700' : 'text-charcoal/60'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isActive 
                      ? 'bg-amber-400 text-[#0B1320]' 
                      : 'bg-amber-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.adminOnly && (
                  <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-stone-200 p-4 bg-[#FAF9F6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1320] font-bold text-amber-400 text-xs shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="max-w-[125px] overflow-hidden">
                <p className="truncate text-xs font-bold text-[#0B1320] leading-none">{user?.name || 'Transporter User'}</p>
                <p className="truncate text-[11px] text-charcoal/60 mt-1 font-medium">{user?.role || 'Fleet Operator'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-charcoal/70 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
