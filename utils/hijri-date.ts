/**
 * Hijri Date Utilities
 * Converts Gregorian dates to Hijri (Islamic) calendar
 */

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameArabic: string;
}

// Hijri month names
const HIJRI_MONTH_NAMES = [
  { name: 'Muharram', arabic: 'محرم' },
  { name: 'Safar', arabic: 'صفر' },
  { name: 'Rabi al-Awwal', arabic: 'ربيع الأول' },
  { name: 'Rabi al-Thani', arabic: 'ربيع الثاني' },
  { name: 'Jumada al-Awwal', arabic: 'جمادى الأولى' },
  { name: 'Jumada al-Thani', arabic: 'جمادى الآخرة' },
  { name: 'Rajab', arabic: 'رجب' },
  { name: 'Shaban', arabic: 'شعبان' },
  { name: 'Ramadan', arabic: 'رمضان' },
  { name: 'Shawwal', arabic: 'شوال' },
  { name: 'Dhul Qadah', arabic: 'ذو القعدة' },
  { name: 'Dhul Hijjah', arabic: 'ذو الحجة' },
];

// Days in each Hijri month (alternating 30 and 29, with adjustment for leap years)
const HIJRI_MONTH_DAYS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

// Leap year pattern in a 30-year cycle (years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 are leap)
const LEAP_YEARS = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

/**
 * Check if a Hijri year is a leap year
 */
export const isHijriLeapYear = (year: number): boolean => {
  const yearInCycle = year % 30;
  return LEAP_YEARS.includes(yearInCycle === 0 ? 30 : yearInCycle);
};

/**
 * Get the number of days in a Hijri month
 */
export const getDaysInHijriMonth = (month: number, year: number): number => {
  if (month === 12 && isHijriLeapYear(year)) {
    return 30; // Dhul Hijjah has 30 days in leap years
  }
  return HIJRI_MONTH_DAYS[month - 1];
};

/**
 * Convert Julian Day Number to Hijri date
 */
const jdToHijri = (jd: number): HijriDate => {
  const l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    year,
    month,
    day,
    monthName: HIJRI_MONTH_NAMES[month - 1].name,
    monthNameArabic: HIJRI_MONTH_NAMES[month - 1].arabic,
  };
};

/**
 * Convert Gregorian date to Julian Day Number
 */
const gregorianToJD = (year: number, month: number, day: number): number => {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
};

/**
 * Convert Hijri date to Julian Day Number
 */
const hijriToJD = (year: number, month: number, day: number): number => {
  return Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - Math.floor((month - 1) / 2) + day - 385 + 1948440 - 1;
};

/**
 * Convert Julian Day Number to Gregorian date
 */
const jdToGregorian = (jd: number): { year: number; month: number; day: number } => {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const aa = z + 1 + a - Math.floor(a / 4);
  const b = aa + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day };
};

/**
 * Convert Gregorian date to Hijri date
 */
export const gregorianToHijri = (date: Date): HijriDate => {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jdToHijri(jd);
};

/**
 * Convert Hijri date to Gregorian date
 */
export const hijriToGregorian = (year: number, month: number, day: number): Date => {
  const jd = hijriToJD(year, month, day);
  const greg = jdToGregorian(jd);
  return new Date(greg.year, greg.month - 1, greg.day);
};

/**
 * Get today's Hijri date
 */
export const getTodayHijri = (): HijriDate => {
  return gregorianToHijri(new Date());
};

/**
 * Format Hijri date as string
 */
export const formatHijriDate = (hijri: HijriDate, includeArabic: boolean = false): string => {
  if (includeArabic) {
    return `${hijri.day} ${hijri.monthName} (${hijri.monthNameArabic}) ${hijri.year} AH`;
  }
  return `${hijri.day} ${hijri.monthName} ${hijri.year} AH`;
};

/**
 * Get the weekday name
 */
export const getWeekdayName = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Get the Arabic weekday name
 */
export const getArabicWeekdayName = (date: Date): string => {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[date.getDay()];
};

/**
 * Generate calendar days for a Hijri month
 */
export const generateHijriMonthCalendar = (year: number, month: number): { day: number; gregorianDate: Date; weekday: number }[] => {
  const daysInMonth = getDaysInHijriMonth(month, year);
  const days: { day: number; gregorianDate: Date; weekday: number }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const gregorianDate = hijriToGregorian(year, month, day);
    days.push({
      day,
      gregorianDate,
      weekday: gregorianDate.getDay(),
    });
  }

  return days;
};

/**
 * Get month name by number
 */
export const getHijriMonthName = (month: number): { name: string; arabic: string } => {
  return HIJRI_MONTH_NAMES[month - 1];
};
