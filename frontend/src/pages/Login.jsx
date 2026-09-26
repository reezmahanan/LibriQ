import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setEmail('admin@lms.com');
    setPassword('admin123');
  };

  const setDemoMember = () => {
    setEmail('student@lms.com');
    setPassword('student123');
  };
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(30, 58, 95, 0.90) 0%, rgba(46, 111, 149, 0.82) 100%), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1E3A5F] text-[#F4B942] shadow-lg shadow-[#1E3A5F]/20 border border-[#2E6F95]/30 mb-2 font-black text-2xl">
            LQ
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1E3A5F]">
            LibriQ LMS • நூலகம்
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            தேசிய மற்றும் பல்கலைக்கழக நூலகம் • විශ්වවිද්‍යාල පුස්තකාලය
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="p-4 bg-[#eaf0f6] rounded-2xl border border-[#d4e0ee] text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1E3A5F] uppercase tracking-wider text-[11px]">
              Quick Demo Access / மாதிரி உள்நுழைவு
            </span>
            <span className="text-[10px] bg-[#F4B942] text-[#1E3A5F] font-extrabold px-1.5 py-0.5 rounded">
              1-Click
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={setDemoAdmin}
              className="px-3 py-2 bg-white border border-[#bccfe3] rounded-xl font-bold text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-[#F4B942] transition text-center shadow-xs flex flex-col items-center justify-center gap-0.5"
            >
              <span className="flex items-center gap-1 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" /> Librarian / நூலகர்
              </span>
              <span className="text-[10px] opacity-75 font-normal">Dr. Senarath</span>
            </button>
            <button
              type="button"
              onClick={setDemoMember}
              className="px-3 py-2 bg-white border border-[#bccfe3] rounded-xl font-bold text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-[#F4B942] transition text-center shadow-xs flex flex-col items-center justify-center gap-0.5"
            >
              <span className="flex items-center gap-1 text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-[#F4B942]" /> Student / மாணவர்
              </span>
              <span className="text-[10px] font-mono text-[#2E6F95] font-semibold">23IT0480</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-[#1F2937]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
              Institutional Email / மின்னஞ்சல்
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@lms.com or admin@lms.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
              Password / கடவுச்சொல்
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E3A5F] hover:bg-[#2E6F95] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1E3A5F]/20 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 border border-[#2E6F95]/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#F4B942]" /> : <span>Sign In / உள்நுழைக</span>}
            {!loading && <ArrowRight className="w-4 h-4 text-[#F4B942]" />}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          New student or faculty patron?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-[#2E6F95] hover:text-[#1E3A5F] hover:underline"
          >
            Register Student Card / பதிவு செய்க
          </button>
        </div>
      </div>
    </div>
  );
}
