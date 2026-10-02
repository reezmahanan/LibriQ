import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ta', label: 'தமிழ்', short: 'TA' },
  { code: 'si', label: 'සිංහල', short: 'SI' },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('lms_language');
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'si')) {
      return saved;
    }
    return 'en';
  });

  const changeLanguage = (code) => {
    if (code === 'en' || code === 'ta' || code === 'si') {
      setLanguage(code);
      localStorage.setItem('lms_language', code);
      // Optional document language attribute for accessibility
      document.documentElement.lang = code;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, fallback = '') => {
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    const defaultDict = translations.en;
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  const currentMeta = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        currentMeta,
        availableLanguages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
