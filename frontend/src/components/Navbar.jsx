import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, GraduationCap, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#1F2937] rounded-lg hover:bg-slate-100 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-[#1E3A5F]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-[#F4B942] flex items-center justify-center font-black text-xl shadow-md border border-[#2E6F95]/30">
            LQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#1E3A5F]">LibriQ</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] border border-[#2E6F95]/20 uppercase tracking-wider">
                LK LMS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block font-medium">
              தேசிய மற்றும் பல்கலைக்கழக நூலகம் • විශ්වවිද්‍යාල පුස්තකාලය • University Library
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-[#1F2937]">{user.name}</span>
              <span className="text-xs text-slate-500 flex items-center justify-end gap-1 font-medium">
                {isAdmin ? (
                  <span className="text-[#1E3A5F] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" /> Senior Librarian / நூலகர்
                  </span>
                ) : (
                  <span className="text-[#2E6F95] font-semibold flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#F4B942]" /> {user.indexNo || user.memberId || 'Undergraduate'}
                  </span>
                )}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-[#1E3A5F] text-[#F4B942] font-black text-sm flex items-center justify-center border border-[#2E6F95]/30 shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={logout}
              title="Sign Out / வெளியேறுக"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
