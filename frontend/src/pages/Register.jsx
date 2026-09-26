import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, KeyRound, Phone, ShieldCheck, Loader2, ArrowRight, GraduationCap, CreditCard, Building } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    phone: '',
    indexNo: '',
    faculty: 'Faculty of Information Technology',
    nic: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.phone,
        {
          indexNo: formData.indexNo,
          faculty: formData.faculty,
          nic: formData.nic,
        }
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed py-8"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(30, 58, 95, 0.90) 0%, rgba(46, 111, 149, 0.82) 100%), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1E3A5F] text-[#F4B942] shadow-lg shadow-[#1E3A5F]/20 border border-[#2E6F95]/30 mb-2 font-black text-2xl">
            LQ
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1E3A5F]">Register Library Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Sri Lankan University Library Network • ශ්‍රී ලංකා විශ්වවිද්‍යාල
          </p>
        </div>

        {error && (
          <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-[#1F2937]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. M. Reezma Hanan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Student Reg / Index No *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.indexNo}
                  onChange={(e) => setFormData({ ...formData, indexNo: e.target.value })}
                  placeholder="e.g. 23IT0480"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">NIC Number</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  placeholder="e.g. 200219403812"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Faculty / Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition bg-white"
                >
                  <option value="Faculty of Information Technology">Faculty of Information Technology</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="Faculty of Technology">Faculty of Technology</option>
                  <option value="Faculty of Management Studies">Faculty of Management Studies</option>
                  <option value="Faculty of Applied Sciences">Faculty of Applied Sciences</option>
                  <option value="Division of Technological Studies (ITUM)">Division of Technological Studies (ITUM)</option>
                  <option value="University Library Administration">University Library Administration</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@university.ac.lk or name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Password *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 chars"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Phone (+94)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6F95]/30 focus:border-[#1E3A5F] transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E3A5F] hover:bg-[#2E6F95] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1E3A5F]/20 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 border border-[#2E6F95]/30 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#F4B942]" /> : <span>Complete Registration</span>}
            {!loading && <ArrowRight className="w-4 h-4 text-[#F4B942]" />}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already have a registered library profile?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-[#2E6F95] hover:text-[#1E3A5F] hover:underline"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
