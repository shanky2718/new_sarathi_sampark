'use client';

import React, { useState } from 'react';
import { Menu, Bell, Search, HelpCircle, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

interface TopbarProps {
  currentTab: string;
  onMenuToggle: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentTab, onMenuToggle }) => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Command Center';
      case 'fleet': return 'Fleet Management & Vehicles';
      case 'drivers': return 'Driver Profiles & Roster';
      case 'return-loads': return 'Return Load Marketplace';
      case 'trips': return 'Trip & Route Operations';
      case 'tracking': return 'Live GPS Fleet Tracking';
      case 'deliveries': return 'Delivery Order Schedules';
      case 'documents': return 'Digital Compliance & Documents';
      case 'fuel': return 'Fuel Telemetry & Anomaly Detection';
      case 'maintenance': return 'Fleet Preventive Maintenance';
      case 'expenses': return 'Expense Auditing & Receipts';
      case 'revenue': return 'Revenue & Financial Insights';
      case 'analytics': return 'Performance & Sustainability Analytics';
      case 'notifications': return 'Notification & Alert Center';
      case 'settings': return 'System Settings & Company Profile';
      case 'admin': return 'Platform Admin Control Panel';
      default: return 'Sarathi Operations';
    }
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-stone-200 bg-[#FAF9F6] px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-[#F5F3EF] text-[#0B1320] hover:bg-stone-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0B1320] lg:text-2xl">
            {getTabTitle(currentTab)}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block w-64 lg:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-charcoal/40" />
          </div>
          <input
            type="search"
            placeholder="Search return loads, trucks, drivers, trips..."
            className="w-full rounded-xl border border-stone-300 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-[#0B1320] placeholder-charcoal/50 focus:border-[#0B1320] focus:outline-none focus:ring-1 focus:ring-[#0B1320] transition-all"
          />
        </div>

        <button 
          onClick={() => alert("Sarathi Sampark 24x7 Transporter Support Helpline: 1800-419-7700")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-charcoal/70 hover:bg-stone-100 transition-colors"
          title="24x7 Transporter Helpline"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-charcoal/80 hover:bg-stone-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 lg:w-96 rounded-2xl border border-stone-200 bg-white shadow-2xl z-50 animate-fade-in py-2 overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 bg-[#FAF9F6]">
                <span className="font-bold text-[#0B1320] text-xs">Real-Time Fleet & Load Alerts</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 font-mono">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-stone-100">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-xs text-charcoal/50 font-medium">No alerts logged</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className={`flex items-start space-x-3 p-3.5 hover:bg-stone-50 transition-colors cursor-pointer ${!n.read ? 'bg-amber-50/50' : ''}`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        ) : n.type === 'success' ? (
                          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Bell className="h-4 w-4 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${!n.read ? 'text-[#0B1320]' : 'text-charcoal/70'}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-charcoal/50 block mt-1 font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 border-l border-stone-200 pl-4">
          <div className="hidden lg:block text-right">
            <span className="block text-xs font-bold text-[#0B1320] leading-none">{user?.name || 'Srinivas Murthy'}</span>
            <span className="text-[10px] text-charcoal/60 font-semibold mt-1 block uppercase">{user?.companyName || 'Sarathi Transports'}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1320] text-amber-400 font-bold text-xs shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
