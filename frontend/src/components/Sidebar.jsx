import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  ArrowLeftRight, 
  Users, 
  PlusCircle, 
  X,
  BookMarked
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onOpenIssueModal }) {
  const { isAdmin } = useAuth();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Library Dashboard', 
      tamil: 'முகப்பு பலகை',
      icon: LayoutDashboard 
    },
    { 
      id: 'books', 
      label: 'Catalog & Accessions', 
      tamil: 'நூல் விபரம்',
      icon: BookOpen 
    },
    { 
      id: 'transactions', 
      label: isAdmin ? 'Circulation (Issue/Return)' : 'My Borrowed Books', 
      tamil: isAdmin ? 'இரவல் வழங்கல் / மீளளித்தல்' : 'எனது நூல்கள்',
      icon: ArrowLeftRight 
    },
    ...(isAdmin ? [{ 
      id: 'members', 
      label: 'Student & Patron Directory', 
      tamil: 'மாணவர் & அங்கத்தவர்',
      icon: Users 
    }] : []),
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-[#1E3A5F]/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-4`}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between lg:hidden px-2">
            <span className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider">
              Navigation / வழிசெலுத்தல்
            </span>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button for Admin */}
          {isAdmin && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenIssueModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E3A5F] hover:bg-[#2E6F95] text-white font-bold text-sm rounded-xl shadow-md transition active:scale-95 border border-[#2E6F95]/50 group"
            >
              <PlusCircle className="w-4 h-4 text-[#F4B942]" />
              <div className="text-left">
                <span className="block leading-tight">Issue Book</span>
                <span className="block text-[10px] text-[#F4B942] font-normal">நூல் இரவல் வழங்கல்</span>
              </div>
            </button>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition text-left ${
                    isActive
                      ? 'bg-[#1E3A5F] text-white shadow-sm'
                      : 'text-[#1F2937] hover:bg-[#F7F9FC] hover:text-[#1E3A5F]'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#F4B942]' : 'text-[#2E6F95]'}`} />
                  <div>
                    <span className="block leading-snug">{item.label}</span>
                    <span className={`block text-[10px] ${isActive ? 'text-[#F4B942]' : 'text-slate-500'}`}>
                      {item.tamil}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System info / Footer */}
        <div className="p-3.5 bg-[#F7F9FC] rounded-2xl border border-slate-200/80 text-xs text-[#1F2937] space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[#1E3A5F]">
            <BookMarked className="w-4 h-4 text-[#F4B942]" />
            <span>Sri Lankan University LMS</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">பல்கலைக்கழக நூலகம் • University Library</p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Server
            </span>
            <span className="font-bold text-[#1E3A5F] bg-[#F4B942]/20 px-1.5 py-0.5 rounded text-[10px]">
              Rs. LKR
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
