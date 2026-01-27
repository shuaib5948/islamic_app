import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ml' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LANGUAGE_STORAGE_KEY = '@islamic_app_language';

// Common translations
const translations: { [key: string]: { en: string; ml: string; ar: string } } = {
  // Settings
  'settings.title': { en: 'Settings', ml: 'Settings', ar: 'الإعدادات' },
  'settings.language': { en: 'Language', ml: 'Language', ar: 'اللغة' },
  'settings.selectLanguage': { en: 'Select Language', ml: 'Select Language', ar: 'اختر اللغة' },
  'settings.english': { en: 'English', ml: 'English', ar: 'الإنجليزية' },
  'settings.malayalam': { en: 'Malayalam', ml: 'മലയാളം', ar: 'المالايالامية' },
  'settings.arabic': { en: 'Arabic', ml: 'Arabic', ar: 'العربية' },
  'settings.notifications': { en: 'Notifications', ml: 'Notifications', ar: 'الإشعارات' },
  'settings.soundHaptics': { en: 'Sound & Haptics', ml: 'Sound & Haptics', ar: 'الصوت واللمس' },
  'settings.data': { en: 'Data', ml: 'Data', ar: 'البيانات' },
  'settings.about': { en: 'About', ml: 'About', ar: 'حول' },

  // Events Screen
  'events.title': { en: 'Islamic Events', ml: 'Islamic Events', ar: 'المناسبات الإسلامية' },
  'events.subtitle': { en: 'المناسبات الإسلامية', ml: 'المناسبات الإسلامية', ar: 'المناسبات الإسلامية' },
  'events.search': { en: 'Search events...', ml: 'പരിപാടികൾ തിരയുക...', ar: 'البحث في المناسبات...' },
  'events.allMonths': { en: 'All Months', ml: 'എല്ലാ മാസങ്ങളും', ar: 'جميع الأشهر' },
  'events.all': { en: 'All', ml: 'എല്ലാം', ar: 'الكل' },
  'events.religious': { en: 'Religious', ml: 'മതപരം', ar: 'ديني' },
  'events.wafat': { en: 'Wafat', ml: 'വഫാത്ത്', ar: 'وفاة' },
  'events.birth': { en: 'Birth', ml: 'ജനനം', ar: 'ميلاد' },
  'events.historic': { en: 'Historic', ml: 'ചരിത്രപരം', ar: 'تاريخي' },
  'events.noEvents': { en: 'No events found', ml: 'ഇവൻ്റുകളൊന്നും കണ്ടെത്തിയില്ല', ar: 'لم يتم العثور على مناسبات' },
  'events.dhikr': { en: 'Dhikr & Supplications', ml: 'ദിക്ർ & പ്രാർത്ഥനകൾ', ar: 'الذكر والأدعية' },
  'events.dua': { en: 'Recommended Duas', ml: 'ശുപാർശ ചെയ്യുന്ന ദുആകൾ', ar: 'الأدعية الموصى بها' },
  'events.aurad': { en: 'Aurad (Litanies)', ml: 'ഔറാദ് (വിർദുകൾ)', ar: 'الأوراد (الأدعية)' },
  'events.practices': { en: 'Special Practices', ml: 'പ്രത്യേക ആചാരങ്ങൾ', ar: 'الممارسات الخاصة' },

  // Calendar
  'calendar.title': { en: 'Hijri Calendar', ml: 'Hijri Calendar', ar: 'التقويم الهجري' },
  
  // Faraid
  'faraid.title': { en: 'Farā\'iḍ Calculator', ml: 'Farā\'iḍ Calculator', ar: 'حاسبة الفرائض' },
  'faraid.subtitle': { en: 'Islamic Inheritance', ml: 'ഇസ്ലാമിക അനന്തരാവകാശം', ar: 'الميراث الإسلامي' },
  'faraid.selectGender': { en: 'Select Gender of Deceased', ml: 'മരിച്ചയാളുടെ ലിംഗം തിരഞ്ഞെടുക്കുക', ar: 'اختر جنس المتوفى' },
  'faraid.male': { en: 'Male', ml: 'പുരുഷൻ', ar: 'ذكر' },
  'faraid.female': { en: 'Female', ml: 'സ്ത്രീ', ar: 'أنثى' },
  'faraid.selectHeirs': { en: 'Select Heirs', ml: 'അവകാശികളെ തിരഞ്ഞെടുക്കുക', ar: 'اختر الورثة' },
  'faraid.enterEstate': { en: 'Enter Estate Details', ml: 'എസ്റ്റേറ്റ് വിവരങ്ങൾ നൽകുക', ar: 'أدخل تفاصيل التركة' },
  'faraid.results': { en: 'Distribution Results', ml: 'വിതരണ ഫലങ്ങൾ', ar: 'نتائج التوزيع' },
  'faraid.totalValue': { en: 'Total Estate Value', ml: 'മൊത്തം എസ്റ്റേറ്റ് മൂല്യം', ar: 'إجمالي قيمة التركة' },
  'faraid.debts': { en: 'Debts', ml: 'കടങ്ങൾ', ar: 'الديون' },
  'faraid.funeralExpenses': { en: 'Funeral Expenses', ml: 'ജനാസ ചെലവുകൾ', ar: 'مصاريف الجنازة' },
  'faraid.wasiyyah': { en: 'Wasiyyah (Bequest)', ml: 'വസിയ്യത്ത് (ഇഷ്ടദാനം)', ar: 'الوصية' },
  'faraid.calculate': { en: 'Calculate', ml: 'കണക്കാക്കുക', ar: 'احسب' },
  'faraid.netEstate': { en: 'Net Estate', ml: 'അറ്റ എസ്റ്റേറ്റ്', ar: 'صافي التركة' },
  'faraid.share': { en: 'Share', ml: 'ഓഹരി', ar: 'الحصة' },
  'faraid.blocked': { en: 'Blocked', ml: 'തടയപ്പെട്ടു', ar: 'محظور' },
  'faraid.startOver': { en: 'Start Over', ml: 'വീണ്ടും ആരംഭിക്കുക', ar: 'ابدأ من جديد' },
  'faraid.next': { en: 'Next', ml: 'അടുത്തത്', ar: 'التالي' },
  'faraid.back': { en: 'Back', ml: 'തിരികെ', ar: 'رجوع' },

  // Categories
  'category.spouse': { en: 'Spouse', ml: 'ഭാര്യ/ഭർത്താവ്', ar: 'الزوج/الزوجة' },
  'category.parent': { en: 'Parents', ml: 'മാതാപിതാക്കൾ', ar: 'الوالدين' },
  'category.child': { en: 'Children', ml: 'മക്കൾ', ar: 'الأطفال' },
  'category.grandchild': { en: 'Grandchildren', ml: 'പേരക്കുട്ടികൾ', ar: 'الأحفاد' },
  'category.grandparent': { en: 'Grandparents', ml: 'മുത്തച്ഛൻ/മുത്തശ്ശി', ar: 'الأجداد' },
  'category.sibling': { en: 'Siblings', ml: 'സഹോദരങ്ങൾ', ar: 'الإخوة والأخوات' },

  // Home
  'home.greeting': { en: 'بسم الله الرحمن الرحيم', ml: 'بسم الله الرحمن الرحيم', ar: 'بسم الله الرحمن الرحيم' },
  'home.title': { en: 'Islamic App', ml: 'Islamic App', ar: 'التطبيق الإسلامي' },
  'home.subtitle': { en: 'Your daily companion', ml: 'Your daily companion', ar: 'رفيقك اليومي' },
  'home.dailyHadith': { en: 'Daily Hadith', ml: 'ഇന്നത്തെ ഹദീസ്', ar: 'حديث اليوم' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'en' || savedLanguage === 'ml' || savedLanguage === 'ar') {
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
