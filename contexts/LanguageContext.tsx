import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LANGUAGE_STORAGE_KEY = '@islamic_app_language';

// Common translations
const translations: { [key: string]: { en: string; ml: string } } = {
  // Settings
  'settings.title': { en: 'Settings', ml: 'Settings' },
  'settings.language': { en: 'Language', ml: 'Language' },
  'settings.selectLanguage': { en: 'Select Language', ml: 'Select Language' },
  'settings.english': { en: 'English', ml: 'English' },
  'settings.malayalam': { en: 'Malayalam', ml: 'മലയാളം' },
  'settings.notifications': { en: 'Notifications', ml: 'Notifications' },
  'settings.soundHaptics': { en: 'Sound & Haptics', ml: 'Sound & Haptics' },
  'settings.data': { en: 'Data', ml: 'Data' },
  'settings.about': { en: 'About', ml: 'About' },

  // Events Screen
  'events.title': { en: 'Islamic Events', ml: 'ഇസ്ലാമിക മുഹൂർത്തങ്ങൾ' },
  'events.subtitle': { en: 'المناسبات الإسلامية', ml: 'المناسبات الإسلامية' },
  'events.search': { en: 'Search events...', ml: 'പരിപാടികൾ തിരയുക...' },
  'events.allMonths': { en: 'All Months', ml: 'എല്ലാ മാസങ്ങളും' },
  'events.all': { en: 'All', ml: 'എല്ലാം' },
  'events.religious': { en: 'Religious', ml: 'മതപരം' },
  'events.wafat': { en: 'Wafat', ml: 'വഫാത്ത്' },
  'events.birth': { en: 'Birth', ml: 'ജനനം' },
  'events.historic': { en: 'Historic', ml: 'ചരിത്രപരം' },
  'events.noEvents': { en: 'No events found', ml: 'ഇവൻ്റുകളൊന്നും കണ്ടെത്തിയില്ല' },
  'events.dhikr': { en: 'Dhikr & Supplications', ml: 'ദിക്ർ & പ്രാർത്ഥനകൾ' },
  'events.dua': { en: 'Recommended Duas', ml: 'ശുപാർശ ചെയ്യുന്ന ദുആകൾ' },
  'events.aurad': { en: 'Aurad (Litanies)', ml: 'ഔറാദ് (വിർദുകൾ)' },
  'events.practices': { en: 'Special Practices', ml: 'പ്രത്യേക ആചാരങ്ങൾ' },

  // Calendar
  'calendar.title': { en: 'Hijri Calendar', ml: 'ഹിജ്‌രി കലണ്ടർ' },
  
  // Faraid
  'faraid.title': { en: 'Farā\'iḍ Calculator', ml: 'ഫറാഇദ് കാൽക്കുലേറ്റർ' },
  'faraid.subtitle': { en: 'Islamic Inheritance', ml: 'ഇസ്ലാമിക അനന്തരാവകാശം' },
  'faraid.selectGender': { en: 'Select Gender of Deceased', ml: 'മരിച്ചയാളുടെ ലിംഗം തിരഞ്ഞെടുക്കുക' },
  'faraid.male': { en: 'Male', ml: 'പുരുഷൻ' },
  'faraid.female': { en: 'Female', ml: 'സ്ത്രീ' },
  'faraid.selectHeirs': { en: 'Select Heirs', ml: 'അവകാശികളെ തിരഞ്ഞെടുക്കുക' },
  'faraid.enterEstate': { en: 'Enter Estate Details', ml: 'എസ്റ്റേറ്റ് വിവരങ്ങൾ നൽകുക' },
  'faraid.results': { en: 'Distribution Results', ml: 'വിതരണ ഫലങ്ങൾ' },
  'faraid.totalValue': { en: 'Total Estate Value', ml: 'മൊത്തം എസ്റ്റേറ്റ് മൂല്യം' },
  'faraid.debts': { en: 'Debts', ml: 'കടങ്ങൾ' },
  'faraid.funeralExpenses': { en: 'Funeral Expenses', ml: 'ജനാസ ചെലവുകൾ' },
  'faraid.wasiyyah': { en: 'Wasiyyah (Bequest)', ml: 'വസിയ്യത്ത് (ഇഷ്ടദാനം)' },
  'faraid.calculate': { en: 'Calculate', ml: 'കണക്കാക്കുക' },
  'faraid.netEstate': { en: 'Net Estate', ml: 'അറ്റ എസ്റ്റേറ്റ്' },
  'faraid.share': { en: 'Share', ml: 'ഓഹരി' },
  'faraid.blocked': { en: 'Blocked', ml: 'തടയപ്പെട്ടു' },
  'faraid.startOver': { en: 'Start Over', ml: 'വീണ്ടും ആരംഭിക്കുക' },
  'faraid.next': { en: 'Next', ml: 'അടുത്തത്' },
  'faraid.back': { en: 'Back', ml: 'തിരികെ' },

  // Categories
  'category.spouse': { en: 'Spouse', ml: 'ഭാര്യ/ഭർത്താവ്' },
  'category.parent': { en: 'Parents', ml: 'മാതാപിതാക്കൾ' },
  'category.child': { en: 'Children', ml: 'മക്കൾ' },
  'category.grandchild': { en: 'Grandchildren', ml: 'പേരക്കുട്ടികൾ' },
  'category.grandparent': { en: 'Grandparents', ml: 'മുത്തച്ഛൻ/മുത്തശ്ശി' },
  'category.sibling': { en: 'Siblings', ml: 'സഹോദരങ്ങൾ' },

  // Home
  'home.greeting': { en: 'بسم الله الرحمن الرحيم', ml: 'بسم الله الرحمن الرحيم' },
  'home.title': { en: 'Islamic App', ml: 'Islamic App' },
  'home.subtitle': { en: 'Your daily companion', ml: 'Your daily companion' },
  'home.dailyHadith': { en: 'Daily Hadith', ml: 'ഇന്നത്തെ ഹദീസ്' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'en' || savedLanguage === 'ml') {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
