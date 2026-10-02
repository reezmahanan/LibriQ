import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'default', showIcon = false }) {
  const { language, changeLanguage, availableLanguages, currentMeta } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  // Button styles based on variant
  const isLight = variant === 'light'; // e.g. on dark background or auth banner
  const isNav = variant === 'nav';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F4B942] focus:ring-offset-1 select-none ${
          isNav
            ? 'bg-white/90 hover:bg-white text-[#1E3A5F] border-[#1E3A5F]/20 shadow-xs'
            : isLight
            ? 'bg-white/80 hover:bg-white text-[#1E3A5F] border-slate-200 shadow-xs backdrop-blur-xs'
            : 'bg-white hover:bg-slate-50 text-[#1E3A5F] border-slate-300 shadow-xs'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Select Language / மொழியை தெரிவுசெய்க / භාෂාව තෝරන්න"
      >
        {showIcon && <Globe className="w-3.5 h-3.5 text-[#2E6F95]" />}
        <span className="tracking-wide uppercase font-bold">{currentMeta.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#2E6F95] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-40 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          <div className="p-1">
            {availableLanguages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors text-left font-medium ${
                    isActive
                      ? 'bg-[#1E3A5F] text-white font-semibold shadow-xs'
                      : 'text-[#1F2937] hover:bg-slate-100'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-[#F4B942] text-[#1E3A5F]'
                          : 'bg-slate-100 text-[#2E6F95]'
                      }`}
                    >
                      {lang.short}
                    </span>
                    <span>{lang.label}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[#F4B942] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
