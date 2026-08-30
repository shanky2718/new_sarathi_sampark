import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Deliveries from './pages/Deliveries';
import LiveTracking from './pages/LiveTracking';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ReturnLoads from './pages/ReturnLoads';
import Documents from './pages/Documents';
import FuelManagement from './pages/FuelManagement';
import Revenue from './pages/Revenue';
import AdminDashboard from './pages/AdminDashboard';
import NotificationsPage from './pages/NotificationsPage';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import IntroAnimation from './components/IntroAnimation';
import { RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync auth state to routing
  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentPage('dashboard');
      } else if (currentPage === 'dashboard') {
        setCurrentPage('landing');
      }
    }
  }, [user, loading]);

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

  // Render Page Content based on Auth & Route
  const renderMainContent = () => {
    // 1. Unauthenticated screens
    if (!user) {
      if (currentPage === 'login') return <Login onNavigate={handleNavigate} />;
      if (currentPage === 'register') return <Register onNavigate={handleNavigate} />;
      return <LandingPage onNavigate={handleNavigate} />;
    }

    // 2. Authenticated but not onboarded
    if (!user.onboarded) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    // 3. Authenticated dashboard layout
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
          />
          <main className="flex-1 overflow-hidden relative">
            {renderTabContent()}
          </main>
        </div>
      </div>
    );
  };

  return (
    <>
      <IntroAnimation />
      {renderMainContent()}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
