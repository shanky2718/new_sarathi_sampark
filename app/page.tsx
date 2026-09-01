'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import LandingPage from '@/components/pages/LandingPage';
import Login from '@/components/pages/Login';
import Register from '@/components/pages/Register';
import Onboarding from '@/components/pages/Onboarding';
import Dashboard from '@/components/pages/Dashboard';
import Fleet from '@/components/pages/Fleet';
import Drivers from '@/components/pages/Drivers';
import Trips from '@/components/pages/Trips';
import Deliveries from '@/components/pages/Deliveries';
import LiveTracking from '@/components/pages/LiveTracking';
import Maintenance from '@/components/pages/Maintenance';
import Expenses from '@/components/pages/Expenses';
import Analytics from '@/components/pages/Analytics';
import Settings from '@/components/pages/Settings';
import ReturnLoads from '@/components/pages/ReturnLoads';
import Documents from '@/components/pages/Documents';
import FuelManagement from '@/components/pages/FuelManagement';
import Revenue from '@/components/pages/Revenue';
import AdminDashboard from '@/components/pages/AdminDashboard';
import NotificationsPage from '@/components/pages/NotificationsPage';

import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentPage('dashboard');
      } else if (currentPage === 'dashboard') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading, currentPage]);

  const handleNavigate = (page: string) => {
    if (page === 'landing' || page === 'login' || page === 'register') {
      setCurrentPage(page as any);
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentPage('dashboard');
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center font-sans">
        <RefreshCw className="h-8 w-8 text-[#0B1320] animate-spin" />
        <p className="text-xs text-charcoal/60 mt-3 font-semibold">Verifying Sarathi Sampark Session...</p>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'login') return <Login onNavigate={handleNavigate} />;
    if (currentPage === 'register') return <Register onNavigate={handleNavigate} />;
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (!user.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigateTab={setActiveTab} />;
      case 'fleet': return <Fleet />;
      case 'drivers': return <Drivers />;
      case 'return-loads': return <ReturnLoads />;
      case 'trips': return <Trips />;
      case 'tracking': return <LiveTracking />;
      case 'deliveries': return <Deliveries />;
      case 'documents': return <Documents />;
      case 'fuel': return <FuelManagement />;
      case 'maintenance': return <Maintenance />;
      case 'expenses': return <Expenses />;
      case 'revenue': return <Revenue />;
      case 'analytics': return <Analytics />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <Settings />;
      case 'admin': return <AdminDashboard />;
      default: return <Dashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F6] font-sans">
      <Sidebar 
        currentTab={activeTab} 
        setTab={setActiveTab} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden bg-[#FAF9F6]">
        <Topbar 
          currentTab={activeTab}
          onMenuToggle={() => setSidebarOpen(true)}
          onNavigateTab={setActiveTab}
        />
        <main className="flex-1 overflow-hidden relative">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
