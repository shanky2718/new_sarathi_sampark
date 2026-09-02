import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  BarChart, 
  Check, 
  Package, 
  Fuel, 
  TrendingUp, 
  FileText, 
  Award, 
  UserCheck, 
  ChevronRight, 
  AlertTriangle,
  Building2,
  Send,
  PhoneCall,
  Mail,
  X,
  LogIn,
  UserPlus,
  Sparkles,
  Leaf,
  CheckCircle2,
  Layers,
  Wrench
} from 'lucide-react';
import api from '../utils/api';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'solutions' | 'how-it-works' | 'services' | 'impact' | 'contact'>('home');
  const [showAuthModal, setShowAuthModal] = useState(true);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    subject: 'Platform Inquiry',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  // Smooth scroll handler to sections
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId as any);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill out Name, Email, and Message.');
      return;
    }
    setContactSubmitting(true);
    try {
      const response = await api.contact.submit(contactForm);
      setContactSuccess(response.message || 'Inquiry submitted successfully!');
      setContactForm({ name: '', email: '', mobile: '', company: '', subject: 'Platform Inquiry', message: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to send inquiry.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const solutionsList = [
    { title: "Smart Return Load Allocation", desc: "Automated AI matching of unutilized return truck capacities with verified shippers.", icon: Package, badge: "Core AI Engine" },
    { title: "Live Truck Tracking", desc: "Real-time GPS telemetry and highway ETA predictions for all active dispatches.", icon: Zap, badge: "IoT Telemetry" },
    { title: "Fuel Monitoring & Anomalies", desc: "Detect fuel theft, gear sub-optimization, and idle time spikes in real-time.", icon: Fuel, badge: "Cost Control" },
    { title: "Intelligent Route Optimization", desc: "Avoid heavy toll plazas and road closures with dynamically re-routed navigation.", icon: MapPin, badge: "Smart Navigation" },
    { title: "Digital Documentation", desc: "Paperless RTO compliance for RC, Commercial Insurance, PUC, and E-Way Bills.", icon: FileText, badge: "Paperless" },
    { title: "Verified Shippers Only", desc: "Enterprise escrow payments and verified GST freight posters for zero fraud.", icon: ShieldCheck, badge: "Fraud Proof" },
    { title: "Fleet Management", desc: "Complete vehicle registry, service reminders, and preventive workshop logs.", icon: Truck, badge: "Fleet Control" },
    { title: "Driver Management", desc: "Driver roster, commercial license verification, and safety performance scores.", icon: UserCheck, badge: "Safety Index" },
    { title: "Analytics & P&L Ledger", desc: "Deep financial insights into net profit margin per KM and backhaul earnings.", icon: TrendingUp, badge: "Financials" }
  ];

  const servicesList = [
    { title: "Return Freight Matching", desc: "Connect empty return trucks with verified shippers within 50 KM radius.", icon: Layers },
    { title: "Fleet Telemetry & GPS", desc: "Real-time satellite GPS tracking with speed alerts and geofencing.", icon: Zap },
    { title: "Fuel Anomaly Safeguards", desc: "Detect fuel siphoning and engine idling spikes with automated alerts.", icon: Fuel },
    { title: "Digital RTO Documents", desc: "Cloud vault for RC, PUC, Commercial Insurance, and GST certificates.", icon: FileText },
    { title: "Workshop Maintenance Logs", desc: "Preventive maintenance scheduling and garage expenditure records.", icon: Wrench },
    { title: "Freight Analytics Ledger", desc: "Full financial transparency with cost-per-KM & return load net profits.", icon: BarChart }
  ];

  const howItWorksSteps = [
    { num: 1, title: "Register your truck", desc: "Enter your truck registration number, capacity, and body type on the platform." },
    { num: 2, title: "Complete your delivery", desc: "Finish your outbound primary freight delivery at destination city." },
    { num: 3, title: "Find nearby return loads", desc: "Browse high-profit backhaul freight posted by verified shippers within 50 KM." },
    { num: 4, title: "Select the best profitable load", desc: "Compare offered price vs estimated fuel expense and accept the top net margin load." },
    { num: 5, title: "Complete the return journey", desc: "Return home fully loaded, earning profit instead of running empty." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal font-sans selection:bg-amber-400 selection:text-[#0B1320]">
      
      {/* 1. PUBLIC NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img 
              src="/logo.png" 
              alt="Sarathi Samparka Logo" 
              className="h-14 w-auto object-contain rounded-xl shadow-md"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-[#0B1320] block leading-none">
                SAMPARKA <span className="text-amber-600">SARATHI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">Load Optimisation Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-charcoal/80">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'home' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'about' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('solutions')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'solutions' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              Solutions
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'how-it-works' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'services' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('impact')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'impact' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              Impact
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`hover:text-amber-600 transition cursor-pointer ${activeSection === 'contact' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-xs font-bold text-[#0B1320] border border-stone-300 rounded-xl hover:bg-stone-100 transition cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-4 py-2 bg-[#0B1320] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Register Truck</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#FAF9F6] to-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Truck className="h-4 w-4 text-amber-700" />
              <span>Connecting Every Journey. Empowering Every Sarathi.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1320] tracking-tight leading-tight">
              Turn Empty Returns Into <span className="text-amber-600 underline underline-offset-8">Profitable Journeys.</span>
            </h1>

            <p className="text-base text-charcoal/80 max-w-xl leading-relaxed">
              Sarathi Sampark connects transporters with verified return loads, helping every truck find its next profitable journey across Bharat.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 bg-[#0B1320] text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Find a Return Load</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 bg-white text-[#0B1320] border border-stone-300 font-bold text-sm rounded-xl hover:bg-stone-50 transition shadow-sm cursor-pointer"
              >
                Register Your Truck
              </button>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-300">
              <div>
                <p className="text-2xl font-extrabold text-[#0B1320]">12,480+</p>
                <p className="text-xs text-charcoal/70 font-medium mt-0.5">Verified Return Loads</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1320]">8,920+</p>
                <p className="text-xs text-charcoal/70 font-medium mt-0.5">Transporters Onboarded</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-700">31% Fewer</p>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">Empty Return Trips</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative bg-[#0B1320] p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl overflow-hidden text-white min-h-[420px] flex flex-col justify-between group hover:border-amber-500/40 transition-all duration-500">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">SMART FREIGHT MATCHING ENGINE</span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full font-semibold">Real-Time Optimisation</span>
            </div>

            <div className="my-6 relative z-10 bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center text-center backdrop-blur-md">
              <img 
                src="/logo.png" 
                alt="Sarathi Samparka Main Logo" 
                className="h-24 sm:h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest">
                  Heavy Material Freight Network
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Outbound Corridor</span>
                  <span className="text-emerald-400 font-extrabold">+66% Profit</span>
                </div>
                <p className="text-xs font-bold text-slate-100">Chennai → Bengaluru</p>
                <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">8 Tons • Industrial Machinery</p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Return Corridor</span>
                  <span className="text-emerald-400 font-extrabold">Instant Match</span>
                </div>
                <p className="text-xs font-bold text-slate-100">Mumbai → Pune</p>
                <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">12 Tons • Auto Components</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section id="problem" className="py-20 bg-[#0B1320] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              The Freight Inefficiency Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Indian Transporters Lose Millions On Return Runs
            </h2>
            <p className="text-xs text-slate-300">
              Traditional logistics suffers from fragmented broker networks, unorganized phone calls, and zero backhaul visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-800 text-rose-400 w-fit">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">EMPTY RETURN TRIPS</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trucks frequently return without cargo after dropping off primary freight, severely reducing overall transporter profitability.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-800 text-amber-400 w-fit">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">LIMITED LOAD VISIBILITY</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transporters struggle to discover suitable return freight near delivery locations, forced to wait days or drive back empty.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="p-3 bg-blue-950/80 rounded-xl border border-blue-800 text-blue-400 w-fit">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">MANUAL OPERATIONS</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paperwork, cash tolls, unmonitored diesel leaks, and phone coordination create massive unnecessary operational costs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ABOUT / VISION & MISSION SECTION */}
      <section id="about" className="py-20 bg-white border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              About Sarathi Sampark
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1320]">
              Pioneering Zero-Empty-Return Freight Infrastructure
            </h2>
            <p className="text-xs text-charcoal/70">
              Transforming Indian road transport with paperless workflows and AI-driven backhaul load matching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-amber-50/60 rounded-3xl border border-amber-200/80 space-y-3">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Platform Vision</span>
              <h3 className="text-xl font-extrabold text-[#0B1320]">
                Building Bharat's paperless logistics network with zero unnecessary empty returns.
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Empowering every Indian truck owner with real-time digital demand discovery, automated escrow payments, and IoT telemetry.
              </p>
            </div>

            <div className="p-8 bg-emerald-50/60 rounded-3xl border border-emerald-200/80 space-y-3">
              <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">Platform Mission</span>
              <h3 className="text-xl font-extrabold text-[#0B1320]">
                Maximizing profits, optimizing asset utilization and reducing freight emissions.
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Cutting empty return trips from 34% down to 12%, saving millions of liters of diesel and tons of CO₂ emissions annually.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SOLUTIONS SECTION */}
      <section id="solutions" className="py-20 bg-[#FAF9F6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              End-to-End SaaS Suite
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1320]">
              Complete Digital Freight Operations Ecosystem
            </h2>
            <p className="text-xs text-charcoal/70">
              Everything you need to run a profitable fleet and eliminate empty return trips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {solutionsList.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold font-mono bg-stone-100 px-2 py-0.5 rounded text-charcoal/70">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B1320]">{s.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Simple 5-Step Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1320]">
              How Sarathi Sampark Eliminates Empty Returns
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
            {howItWorksSteps.map((step) => (
              <div key={step.num} className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 relative text-center space-y-2 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#0B1320] text-amber-400 font-extrabold flex items-center justify-center text-sm mx-auto shadow-md">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-[#0B1320]">{step.title}</h3>
                <p className="text-[11px] text-charcoal/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. SERVICES SECTION */}
      <section id="services" className="py-20 bg-[#FAF9F6] border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Core Platform Services
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1320]">
              Integrated Logistics Tech Solutions
            </h2>
            <p className="text-xs text-charcoal/70">
              Tailored services for Indian transporters, fleet operators, and enterprise shippers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {servicesList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B1320]">{srv.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. IMPACT & SUSTAINABILITY SECTION */}
      <section id="impact" className="py-20 bg-[#0B1320] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 w-fit mx-auto">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sustainability & Economic Impact</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Measurable Savings For Bharat's Logistics Corridor
            </h2>
            <p className="text-xs text-slate-300">
              Transforming unutilized truck returns into net-positive economic and environmental outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="text-3xl font-black text-amber-400">31%</p>
              <p className="text-xs font-bold text-slate-200">Empty Return Trips Reduced</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">Cut down from 34% national baseline to 12% among active transporters.</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="text-3xl font-black text-emerald-400">148,500 L</p>
              <p className="text-xs font-bold text-slate-200">Diesel Fuel Saved</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">Conserved through optimized backhaul route matching and lower idle times.</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="text-3xl font-black text-blue-400">395 Tons</p>
              <p className="text-xs font-bold text-slate-200">CO₂ Emissions Avoided</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">Direct reduction in highway carbon footprint and particulate pollution.</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="text-3xl font-black text-purple-400">+28%</p>
              <p className="text-xs font-bold text-slate-200">Truck Utilization Increase</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">Enhanced net monthly revenue and faster asset payback cycles for owners.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-white border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Get In Touch
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B1320]">
              Contact Sarathi Sampark Logistics Team
            </h2>
            <p className="text-xs text-charcoal/70">
              Have questions about onboard fleet registration or shipper integration? Our technical specialists are here to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Info Card */}
            <div className="bg-[#0B1320] text-white p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-amber-400">Samparka Sarathi Technical Support</h3>
                <p className="text-xs text-slate-300">Samparka Sarathi Logistics Tech</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-xl text-amber-400 border border-slate-800">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Headquarters Address</p>
                    <p className="text-slate-400">Somwar Pete, Kittur, Belagavi District, Karnataka, India</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-amber-400">Transporter Assistance Hours</p>
                <p className="text-[11px]">Monday – Saturday: 08:00 AM to 10:00 PM IST</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-stone-300 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1320]">Send Us a Message</h3>

              {contactSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{contactSuccess}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal/80 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal/80 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="ramesh@transports.in"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal/80 mb-1">Mobile Number</label>
                    <input 
                      type="text" 
                      placeholder="+91 98765 43210"
                      value={contactForm.mobile}
                      onChange={e => setContactForm({ ...contactForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal/80 mb-1">Company / Fleet Name</label>
                    <input 
                      type="text" 
                      placeholder="Patel Logistics"
                      value={contactForm.company}
                      onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/80 mb-1">Message *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe your inquiry or fleet details..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full py-3 bg-[#0B1320] text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5 text-amber-400" />
                  <span>{contactSubmitting ? 'Submitting Message...' : 'Submit Message'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#0B1320] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Samparka Sarathi Logo" 
                className="h-12 w-auto object-contain rounded-lg shadow-md"
              />
              <span className="text-lg font-black tracking-tight text-white">SAMPARKA SARATHI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Connecting Every Journey. Empowering Every Sarathi."
            </p>
            <p className="text-xs text-slate-400">Samparka Sarathi Logistics Tech</p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-bold text-white uppercase tracking-wider mb-2">Platform Navigation</p>
            <p className="hover:text-amber-400 cursor-pointer" onClick={() => scrollToSection('about')}>About Platform</p>
            <p className="hover:text-amber-400 cursor-pointer" onClick={() => scrollToSection('solutions')}>Solutions Suite</p>
            <p className="hover:text-amber-400 cursor-pointer" onClick={() => scrollToSection('how-it-works')}>How It Works</p>
            <p className="hover:text-amber-400 cursor-pointer" onClick={() => scrollToSection('services')}>Services</p>
            <p className="hover:text-amber-400 cursor-pointer" onClick={() => scrollToSection('impact')}>Sustainability Impact</p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-bold text-white uppercase tracking-wider mb-2">Office Address</p>
            <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-amber-400" /> Somwar Pete, Kittur, Belagavi District, Karnataka, India</p>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Request Platform Demo</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter company email" 
                className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-xl w-full text-white"
              />
              <button 
                onClick={() => alert("Demo request received! Our logistics technical specialist will call you shortly.")}
                className="px-3 py-2 bg-amber-500 text-[#0B1320] font-bold rounded-xl text-xs hover:bg-amber-400 cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2026 Samparka Sarathi Logistics Platform. All Rights Reserved. Built for Bharat Freight.
        </div>
      </footer>

      {/* 11. AUTOMATIC ENTRY AUTHENTICATION POPUP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1320]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Close Modal Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-[#0B1320] hover:bg-stone-100 rounded-full transition cursor-pointer"
              title="Close & Explore Homepage"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-3 pt-2">
              <div className="flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="Sarathi Samparka Logo" 
                  className="h-16 w-auto object-contain rounded-2xl shadow-lg border border-amber-200"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                <span>BHARAT LOGISTICS TECHNOLOGY PLATFORM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1320] tracking-tight">
                Welcome to Samparka Sarathi
              </h2>
              <p className="text-xs text-charcoal/80 max-w-sm mx-auto leading-relaxed">
                Connecting Every Journey. Empowering Every Sarathi. Please log in or create an account to access the Return Load Marketplace.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => onNavigate('register')}
                className="w-full py-3.5 bg-[#0B1320] text-white font-extrabold text-sm rounded-2xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg group cursor-pointer"
              >
                <UserPlus className="h-4 w-4 text-amber-400" />
                <span>Create New Account / Register Truck</span>
                <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('login')}
                className="w-full py-3.5 bg-stone-100 text-[#0B1320] font-extrabold text-sm rounded-2xl border border-stone-300 hover:bg-stone-200 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-amber-700" />
                <span>Log In to Existing Account</span>
              </button>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="border-t border-stone-200 pt-4 text-center space-y-2">
              <p className="text-[11px] text-charcoal/60 font-semibold uppercase tracking-wider">Quick Demo Credentials Access</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
                >
                  Transporter Demo
                </button>
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 bg-stone-100 text-stone-900 border border-stone-300 rounded-xl text-xs font-bold hover:bg-stone-200 transition cursor-pointer"
                >
                  Shipper Demo
                </button>
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 bg-slate-900 text-amber-400 rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Admin Control
                </button>
              </div>
            </div>

            {/* Dismiss option */}
            <div className="text-center pt-1">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-xs font-semibold text-charcoal/60 hover:text-amber-700 underline underline-offset-4 cursor-pointer"
              >
                Skip & Explore Homepage First →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
