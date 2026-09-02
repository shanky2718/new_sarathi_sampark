import React, { useState, useEffect, useCallback } from 'react';
import { FastForward, Shield, Navigation, TrendingUp, Cpu, BarChart3 } from 'lucide-react';

interface IntroAnimationProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, forceShow = false }) => {
  const [stage, setStage] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Skip animation handler
  const handleSkip = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsFinished(true);
      try {
        sessionStorage.setItem('sarathi_intro_completed', 'true');
      } catch (e) {
        // Fallback if storage fails
      }
      if (onComplete) onComplete();
    }, 400);
  }, [onComplete]);

  // Initial visit check
  useEffect(() => {
    if (!forceShow) {
      try {
        const hasSeen = sessionStorage.getItem('sarathi_intro_completed');
        if (hasSeen === 'true') {
          setIsFinished(true);
          return;
        }
      } catch (e) {
        // Continue if storage check throws
      }
    }

    // Keyboard Escape to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Timeline Sequence
    // 0.0 - 0.5s: Dark atmosphere & ambient glow (Stage 0)
    // 0.5 - 1.5s: Central logo reveal (Stage 1)
    // 1.5 - 2.5s: "SARATHI SAMPARKA" text reveal (Stage 2)
    // 2.5 - 3.2s: Tagline & Load Optimisation Platform (Stage 3)
    // 3.2 - 4.0s: 5 Feature Pills reveal (Stage 4)
    // 4.0 - 4.8s: Metallic light sweep (Stage 5)
    // 4.8 - 5.5s: Zoom out & Crossfade transition to main website (Stage 6)

    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => setStage(4), 3200);
    const timer5 = setTimeout(() => setStage(5), 4000);
    const timer6 = setTimeout(() => setStage(6), 4800);
    const timer7 = setTimeout(() => {
      handleSkip();
    }, 5500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, [forceShow, handleSkip]);

  if (isFinished) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#060A10] text-white overflow-hidden select-none transition-all duration-700 ease-in-out ${
        isFadingOut || stage === 6 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Sarathi Samparka Opening Animation"
      role="region"
    >
      {/* Background Radial Light & Transportation Route Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Ambient Gold & Steel Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent blur-3xl opacity-60 transition-opacity duration-1000" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-3/4 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-float-particle" style={{ animationDelay: '0s' }} />
          <div className="absolute top-2/3 left-3/4 w-2 h-2 rounded-full bg-slate-200/60 animate-float-particle" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-amber-300/90 animate-float-particle" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-4/5 left-3/5 w-1.5 h-1.5 rounded-full bg-amber-500/70 animate-float-particle" style={{ animationDelay: '3.8s' }} />
        </div>

        {/* Faint Highway Route Network Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M -100 200 Q 300 100 800 500 T 1800 300"
            fill="none"
            stroke="url(#amberGradient)"
            strokeWidth="1.5"
            className="animate-route-line"
          />
          <path
            d="M 200 900 Q 700 400 1200 600 T 2000 100"
            fill="none"
            stroke="url(#silverGradient)"
            strokeWidth="1"
            className="animate-route-line"
            style={{ animationDuration: '28s' }}
          />
          <defs>
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Bar Atmosphere Badge */}
      <div className="w-full pt-6 px-8 flex justify-between items-center z-10">
        <div className={`transition-all duration-700 transform ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/20 text-[10px] uppercase font-bold tracking-widest text-amber-400/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            Bharat Logistics Command
          </span>
        </div>
      </div>

      {/* Main Central Artwork & Logo Reveal Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto z-10 w-full text-center my-auto">
        
        {/* 1. Main Logo Image Container (Stage 1 Reveal) */}
        <div
          className={`relative transition-all duration-1000 transform ${
            stage >= 1
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Outer Gold Ring Pulse */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-300/10 to-amber-600/20 blur-xl opacity-50 animate-pulse pointer-events-none" />

          {/* Existing Logo Source */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 bg-slate-950/60 p-2 sm:p-4 backdrop-blur-sm max-w-[280px] sm:max-w-[420px] lg:max-w-[500px] mx-auto">
            <img
              src="/logo.png"
              alt="Sarathi Samparka - Load Optimisation Platform"
              className="w-full h-auto object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            />

            {/* Metallic Light Sweep Overlay (Stage 5 Sweep Effect) */}
            {(stage >= 5 || stage === 4) && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-metallic-sweep shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
              </div>
            )}
          </div>
        </div>

        {/* 2. Main Title Text Reveal: "SARATHI SAMPARKA" (Stage 2) */}
        <div
          className={`mt-6 sm:mt-8 transition-all duration-800 transform ${
            stage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase font-sans drop-shadow-md">
            SAMPARKA <span className="text-gold-shimmer">SARATHI</span>
          </h1>
        </div>

        {/* 3. Subtitle & Tagline Reveal (Stage 3) */}
        <div
          className={`mt-2 sm:mt-3 space-y-1.5 transition-all duration-800 transform ${
            stage >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
            — LOAD OPTIMISATION PLATFORM —
          </div>
          <p className="text-slate-300 text-xs sm:text-sm italic font-light max-w-lg mx-auto tracking-wide">
            "The Ultimate Smart Digital Solution for Heavy Material Transport"
          </p>
        </div>

        {/* 4. Five Feature Sections/Pills Staggered Reveal (Stage 4) */}
        <div
          className={`mt-6 sm:mt-8 transition-all duration-800 transform ${
            stage >= 4
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            
            {/* Feature 1 */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-slate-200 shadow-md backdrop-blur-md transition-all duration-500 transform ${
                stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: '0.1s' }}
            >
              <Cpu className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>SMART MATCHING</span>
            </div>

            {/* Feature 2 */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-slate-200 shadow-md backdrop-blur-md transition-all duration-500 transform ${
                stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>LOAD OPTIMISATION</span>
            </div>

            {/* Feature 3 */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-slate-200 shadow-md backdrop-blur-md transition-all duration-500 transform ${
                stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <Navigation className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>REAL TIME TRACKING</span>
            </div>

            {/* Feature 4 */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-slate-200 shadow-md backdrop-blur-md transition-all duration-500 transform ${
                stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>SAFE & RELIABLE</span>
            </div>

            {/* Feature 5 */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-slate-200 shadow-md backdrop-blur-md transition-all duration-500 transform ${
                stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: '0.5s' }}
            >
              <BarChart3 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>DATA DRIVEN INSIGHTS</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Bar: Skip Intro Button & Copyright */}
      <div className="w-full pb-6 px-8 flex justify-between items-center z-20">
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          © 2026 Samparka Sarathi Logistics Platform
        </span>

        {/* Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-200 text-xs font-semibold tracking-wider backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Skip intro animation and enter website"
        >
          <span>Skip Intro</span>
          <FastForward className="h-3.5 w-3.5 text-amber-400" />
        </button>
      </div>
    </div>
  );
};

export default IntroAnimation;
