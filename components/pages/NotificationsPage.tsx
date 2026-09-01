'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  CheckCheck, 
  Filter,
  Clock
} from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead } = useData();

  const [filter, setFilter] = useState<'all' | 'unread' | 'warning' | 'success'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'warning') return n.type === 'warning';
    if (filter === 'success') return n.type === 'success';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FAF9F6] p-6 text-charcoal font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Notification Center
            </span>
            <span className="text-xs text-charcoal/60">Real-time Telemetry & Marketplace Dispatch Alerts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1320] mt-1">
            System Notifications & Alerts
          </h1>
          <p className="text-sm text-charcoal/70">
            Stay informed about return loads, trip delays, document expiry dates, and fuel anomalies.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-[#0B1320] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
          >
            <CheckCheck className="h-4 w-4 text-amber-400" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-charcoal/50 ml-2" />
          <span className="text-xs font-bold text-charcoal/70 mr-2">Filter Alerts:</span>
          
          {(['all', 'unread', 'warning', 'success'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === f
                  ? 'bg-[#0B1320] text-white'
                  : 'bg-[#FAF9F6] text-charcoal border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {f} {f === 'unread' && `(${unreadCount})`}
            </button>
          ))}
        </div>

        <span className="text-xs text-charcoal/50 font-medium mr-2">
          Showing {filtered.length} notifications
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((notif) => {
          const isWarning = notif.type === 'warning';
          const isSuccess = notif.type === 'success';

          return (
            <div
              key={notif.id}
              onClick={() => !notif.read && markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 shadow-sm hover:shadow-md ${
                !notif.read
                  ? isWarning 
                    ? 'bg-amber-50/90 border-amber-300' 
                    : isSuccess 
                    ? 'bg-emerald-50/90 border-emerald-300' 
                    : 'bg-blue-50/90 border-blue-300'
                  : 'bg-white border-stone-200 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isWarning 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : isSuccess 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {isWarning ? <AlertTriangle className="h-5 w-5" /> : isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${!notif.read ? 'text-[#0B1320]' : 'text-charcoal/80'}`}>
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/50 font-medium flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {notif.time}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationAsRead(notif.id);
                  }}
                  className="text-xs font-semibold text-charcoal/60 hover:text-charcoal px-2.5 py-1 bg-white/80 rounded-lg border border-stone-200 shadow-xs"
                >
                  Mark Read
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-2">
            <Bell className="h-10 w-10 text-stone-300 mx-auto" />
            <p className="font-bold text-base text-charcoal">No notifications found</p>
            <p className="text-xs text-charcoal/50">You&apos;re all caught up with your fleet updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
