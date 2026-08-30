import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  User, 
  Mail, 
  Building, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Briefcase
} from 'lucide-react';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: 'Transporter' as 'Truck Owner' | 'Transporter' | 'Driver' | 'Fleet Manager' | 'Shipper / Business',
    name: '',
    email: '',
    mobile: '',
    password: '',
    companyName: '',
    gstNumber: '',
    address: '',
    // Vehicle specs (for truck owners/transporters)
    truckNumber: 'KA-01-MJ-9900',
    truckType: 'Container',
    capacity: '20 Tons',
    vehicleModel: 'Tata Prima 4930.S',
    fuelType: 'Diesel'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { title: 'Truck Owner', desc: 'Own 1-5 trucks and seeking profitable return loads', icon: Truck },
    { title: 'Transporter', desc: 'Manage commercial fleet operations across India', icon: Briefcase },
    { title: 'Driver', desc: 'Sarathi driving commercial freight vehicles', icon: User },
    { title: 'Fleet Manager', desc: 'Logistics coordinator managing fleet dispatch', icon: Building },
    { title: 'Shipper / Business', desc: 'Post goods and return freight for transportation', icon: ShieldCheck }
  ];

  const handleNextStep1 = () => {
    setStep(2);
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      if (formData.role === 'Shipper / Business' || formData.role === 'Driver') {
        handleSubmitFinal();
      } else {
        setStep(3);
      }
    }
  };

  const handleSubmitFinal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      await register({
        name: formData.name,
        companyName: formData.companyName || 'Sarathi Transports',
        email: formData.email,
        phone: formData.mobile,
        password: formData.password,
        role: formData.role
      });
      onNavigate('dashboard');
    } catch (err: any) {
      setErrors({ form: err?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-[#0B1320] text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Sarathi Samparka Logo" 
            className="h-14 w-auto object-contain rounded-xl shadow-md"
          />
          <span className="text-2xl font-black tracking-tight text-[#0B1320]">
            SARATHI <span className="text-amber-600">SAMPARKA</span>
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#0B1320]">
          Create Your Transporter Account
        </h2>
        <p className="text-xs text-charcoal/70">
          Turn empty return trips into profitable journeys across Bharat.
        </p>
      </div>

      {/* Progress Multi-Step Bar */}
      <div className="max-w-md mx-auto w-full mt-6 flex items-center justify-between text-xs font-bold text-charcoal/60 px-4">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0B1320]' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#0B1320] text-white' : 'bg-stone-200'}`}>1</span>
          <span>Role</span>
        </div>
        <div className="h-0.5 flex-1 bg-stone-200 mx-2" />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0B1320]' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#0B1320] text-white' : 'bg-stone-200'}`}>2</span>
          <span>Credentials</span>
        </div>
        <div className="h-0.5 flex-1 bg-stone-200 mx-2" />
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0B1320]' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#0B1320] text-white' : 'bg-stone-200'}`}>3</span>
          <span>Vehicle Specs</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-stone-200">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#0B1320]">Select Your Primary Role:</h3>
              
              <div className="space-y-2.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.title;
                  return (
                    <div
                      key={r.title}
                      onClick={() => setFormData({ ...formData, role: r.title as any })}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#0B1320] bg-amber-50/50 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#0B1320] text-amber-400' : 'bg-stone-200 text-charcoal/70'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0B1320]">{r.title}</p>
                          <p className="text-[11px] text-charcoal/60">{r.desc}</p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className="h-5 w-5 text-[#0B1320]" />}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep1}
                className="w-full mt-4 py-3 bg-[#0B1320] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </button>
            </div>
          )}

          {/* STEP 2: CREDENTIALS & PERSONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#0B1320]">Account & Contact Info</span>
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                  Role: {formData.role}
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Srinivas Murthy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
                {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+91 98450 11223"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                  {errors.mobile && <p className="text-rose-600 text-[11px] mt-0.5">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="srinivas@sarathi.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                  {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company / Fleet Name</label>
                  <input
                    type="text"
                    placeholder="Sarathi Transports Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="29AAACS1234F1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-charcoal/40"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-5 py-2.5 bg-[#0B1320] text-white text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1.5 shadow-md"
                >
                  <span>{formData.role === 'Shipper / Business' ? 'Complete Registration' : 'Vehicle Details'}</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRUCK / VEHICLE DETAILS */}
          {step === 3 && (
            <form onSubmit={handleSubmitFinal} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#0B1320]">Initial Vehicle Specs</span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                  Step 3 of 3
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="KA-01-MJ-9900"
                    value={formData.truckNumber}
                    onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Truck Body Type</label>
                  <select
                    value={formData.truckType}
                    onChange={(e) => setFormData({ ...formData, truckType: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Container">Container (Closed)</option>
                    <option value="Open Body">Open Body Truck</option>
                    <option value="Trailer">Heavy Multi-Axle Trailer</option>
                    <option value="Box Body">Box Body LCV</option>
                    <option value="Dumper">Tipper / Dumper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Payload Capacity</label>
                  <input
                    type="text"
                    placeholder="20 Tons"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="Tata Prima 4930.S"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed text-[11px]">
                ✓ Automatically enrolled in Sarathi Return Load Auto-Match AI engine.
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-md"
                >
                  {loading ? 'Creating Account...' : 'Finish & Open Dashboard'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-charcoal/70">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-[#0B1320] hover:underline"
              >
                Log In
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
