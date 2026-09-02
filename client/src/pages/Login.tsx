import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: 'srinivas@sarathitransports.in', password: 'password123' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address or mobile is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      onNavigate('dashboard');
    } catch (err: any) {
      setErrors({ server: err?.message || 'Login failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (roleEmail: string) => {
    setFormData({ email: roleEmail, password: 'password123' });
    login(roleEmail, 'password123');
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans flex text-charcoal">
      
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:w-[500px] bg-white border-r border-stone-200">
        <div className="w-full max-w-sm mx-auto space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <img 
              src="/logo.png" 
              alt="Sarathi Samparka Logo" 
              className="h-14 w-auto object-contain rounded-xl shadow-md"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-[#0B1320] block leading-none">
                SAMPARKA <span className="text-amber-600">SARATHI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">
                Load Optimisation Platform
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1320]">Transporter Portal Sign In</h2>
            <p className="text-xs text-charcoal/70 mt-1">Access return load marketplace, live fleet tracking & P&L ledger.</p>
          </div>

          {/* Quick Demo Shortcuts Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-amber-700" />
              Quick Demo One-Click Login Roles:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button 
                onClick={() => handleDemoLogin('transporter@sarathi.in')}
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#0B1320] hover:bg-amber-100/60 text-left truncate"
              >
                🚚 Fleet Operator
              </button>
              <button 
                onClick={() => handleDemoLogin('truckowner@sarathi.in')}
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#0B1320] hover:bg-amber-100/60 text-left truncate"
              >
                🚛 Truck Owner
              </button>
              <button 
                onClick={() => handleDemoLogin('admin@sarathi.in')}
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#0B1320] hover:bg-amber-100/60 text-left truncate"
              >
                🛡️ Platform Admin
              </button>
              <button 
                onClick={() => handleDemoLogin('shipper@sarathi.in')}
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#0B1320] hover:bg-amber-100/60 text-left truncate"
              >
                📦 Enterprise Shipper
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errors.server && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.server}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Email / Mobile Number</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-charcoal/40" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="transporter@sarathi.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0B1320]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-charcoal/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0B1320]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-charcoal/40"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-charcoal/80">
                <input type="checkbox" defaultChecked className="rounded text-[#0B1320]" />
                Remember this device
              </label>
              <button type="button" onClick={() => alert("Password reset link sent to your registered mobile/email.")} className="text-amber-800 font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B1320] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center text-xs text-charcoal/70">
            Don't have a transporter account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-[#0B1320] hover:underline"
            >
              Register Your Truck / Fleet
            </button>
          </div>

        </div>
      </div>

      {/* Decorative Brand Hero Side */}
      <div className="hidden lg:flex flex-1 bg-[#0B1320] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold font-mono uppercase">
            Bharat Logistics Infrastructure
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            "Connecting Every Journey. Empowering Every Sarathi."
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminating empty return runs for over 8,900+ transporters across India. Experience 31% higher asset utilization with instant return load matching.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-400">
          <span>© 2026 Samparka Sarathi Logistics Tech</span>
          <span>Somwar Pete, Kittur, Belagavi District, Karnataka</span>
        </div>
      </div>

    </div>
  );
};

export default Login;
