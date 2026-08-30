import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, CreditCard, Shield, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Mamtha Reddy',
    email: user?.email || 'admin@sarathi.com',
    phone: user?.phone || '+91-9876543210',
    companyName: user?.companyName || 'Sarathi LogiCorp',
    gstin: '29AAAAA0000A1Z1'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailAlerts: true,
    maintenanceReminders: true,
    delayWarnings: true
  });

  const [toast, setToast] = useState<string | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Company profile parameters successfully updated.');
    setTimeout(() => setToast(null), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords don't match.");
      return;
    }
    setToast('Security password changed successfully.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNotifToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setToast('Notification channels updated.');
      setTimeout(() => setToast(null), 2500);
      return updated;
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-50 border border-green-200 text-green-800 px-5 py-3.5 shadow-2xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 animate-fade-in">
          <Sparkles className="h-4.5 w-4.5 text-[#C59B27]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">System Parameters</p>
        <h3 className="text-2xl font-extrabold text-charcoal brand-heading">Accounts & Configurations</h3>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Profile and Company info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm">
            <div className="border-b border-charcoal/5 pb-3 mb-4 flex items-center space-x-2 text-charcoal/80">
              <User className="h-4.5 w-4.5 text-gold" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Company & Profile Details</h4>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">HQ Corporate Entity</label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">HQ Phone Contact</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Commercial GSTIN</label>
                  <input
                    type="text"
                    value={profileData.gstin}
                    onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value })}
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Primary Email</label>
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full rounded-lg border border-charcoal/10 bg-charcoal/5 px-3 py-2 text-xs text-charcoal/55 focus:outline-none cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-sm"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Security Credentials */}
          <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm">
            <div className="border-b border-charcoal/5 pb-3 mb-4 flex items-center space-x-2 text-charcoal/80">
              <Lock className="h-4.5 w-4.5 text-gold" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Security & Password</h4>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-charcoal text-[#F5F2EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-dark shadow-sm"
              >
                Change Password
              </button>
            </form>
          </div>

        </div>

        {/* Sidebar Info panels (Notifications and Subscriptions) */}
        <div className="space-y-6">
          
          {/* Notifications */}
          <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm">
            <div className="border-b border-charcoal/5 pb-3 mb-4 flex items-center space-x-2 text-charcoal/80">
              <Bell className="h-4.5 w-4.5 text-gold" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Operations Alerts</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-charcoal">SMS Dispatch Alerts</span>
                  <span className="text-[10px] text-charcoal/50 font-medium">Send SMS updates to driver phone lists</span>
                </div>
                <button 
                  onClick={() => handleNotifToggle('smsAlerts')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${notifications.smsAlerts ? 'bg-[#C59B27]' : 'bg-charcoal/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#FAF9F6] shadow-sm transform transition-transform ${notifications.smsAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-charcoal">Email Compliance Summaries</span>
                  <span className="text-[10px] text-charcoal/50 font-medium">Weekly fitness & insurance audits</span>
                </div>
                <button 
                  onClick={() => handleNotifToggle('emailAlerts')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${notifications.emailAlerts ? 'bg-[#C59B27]' : 'bg-charcoal/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#FAF9F6] shadow-sm transform transition-transform ${notifications.emailAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-charcoal">Maintenance Prompts</span>
                  <span className="text-[10px] text-charcoal/50 font-medium">Brake pad, PUC, and oil alerts</span>
                </div>
                <button 
                  onClick={() => handleNotifToggle('maintenanceReminders')}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${notifications.maintenanceReminders ? 'bg-[#C59B27]' : 'bg-charcoal/15'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#FAF9F6] shadow-sm transform transition-transform ${notifications.maintenanceReminders ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="rounded-xl border border-charcoal/10 bg-[#FAF9F6] p-6 shadow-sm space-y-4">
            <div className="border-b border-charcoal/5 pb-3 flex items-center space-x-2 text-charcoal/80">
              <CreditCard className="h-4.5 w-4.5 text-gold" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Operations Subscription</h4>
            </div>

            <div className="border border-[#C59B27]/40 rounded-lg p-4 bg-[#F5F2EB]/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Active Plan</span>
                <h4 className="text-lg font-extrabold text-charcoal leading-snug mt-0.5">Sarathi Pro Enterprise</h4>
                <p className="text-[10px] text-charcoal/55 mt-1 font-medium">Next renewal: 2026-09-08</p>
              </div>
              <span className="font-mono text-base font-black text-charcoal">
                ₹14,999/mo
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Settings;
