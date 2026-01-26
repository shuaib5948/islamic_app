/**
 * Prayer Tracker Data Types
 * Track daily prayers with timing status
 */

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type PrayerStatus = 'prayed' | 'late' | 'qaza' | 'missed' | 'not_tracked';

export interface PrayerEntry {
  name: PrayerName;
  status: PrayerStatus;
  time?: string; // When the prayer was performed
}

export interface DailyPrayers {
  date: string; // YYYY-MM-DD format
  prayers: Record<PrayerName, PrayerStatus>;
  notes?: string;
}

export interface PrayerStats {
  totalPrayers: number;
  totalPrayed: number;      // Prayers done on time
  totalLate: number;        // Prayers done late
  totalQaza: number;        // Qaza prayers
  totalMissed: number;      // Missed prayers
  prayedOnTime: number;     // Alias for totalPrayed
  prayedLate: number;       // Alias for totalLate
  qaza: number;             // Alias for totalQaza
  missed: number;           // Alias for totalMissed
  currentStreak: number;    // Current consecutive days
  longestStreak: number;    // Best streak ever
  consistencyPercentage: number;  // Overall consistency %
  consistencyPercent: number;     // Alias for consistencyPercentage
}

export interface WeeklyStats {
  week: string;
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  total: number;
}

// Prayer information
export const PRAYERS: { name: PrayerName; label: string; arabic: string; icon: string }[] = [
  { name: 'fajr', label: 'Fajr', arabic: 'الفجر', icon: '🌅' },
  { name: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', icon: '☀️' },
  { name: 'asr', label: 'Asr', arabic: 'العصر', icon: '🌤️' },
  { name: 'maghrib', label: 'Maghrib', arabic: 'المغرب', icon: '🌅' },
  { name: 'isha', label: 'Isha', arabic: 'العشاء', icon: '🌙' },
];

// Status colors and labels - Modern color palette
export const STATUS_CONFIG: Record<PrayerStatus, { label: string; color: string; icon: string }> = {
  prayed: { label: 'On Time', color: '#10B981', icon: '✓' },
  late: { label: 'Late', color: '#F59E0B', icon: '⏱' },
  qaza: { label: 'Qaza', color: '#8B5CF6', icon: '↻' },
  missed: { label: 'Missed', color: '#EF4444', icon: '✕' },
  not_tracked: { label: 'Not Tracked', color: '#64748B', icon: '○' },
};

// Get prayer by name
export const getPrayerInfo = (name: PrayerName) => {
  return PRAYERS.find(p => p.name === name);
};

// Create empty daily prayers record
export const createEmptyDailyPrayers = (date: string): DailyPrayers => ({
  date,
  prayers: {
    fajr: 'not_tracked',
    dhuhr: 'not_tracked',
    asr: 'not_tracked',
    maghrib: 'not_tracked',
    isha: 'not_tracked',
  },
});

// Calculate contribution level (0-4) for GitHub-style graph
export const getContributionLevel = (dailyPrayers: DailyPrayers): number => {
  const statuses = Object.values(dailyPrayers.prayers);
  const prayedCount = statuses.filter(s => s === 'prayed' || s === 'late').length;
  
  if (prayedCount === 0) return 0;
  if (prayedCount <= 1) return 1;
  if (prayedCount <= 2) return 2;
  if (prayedCount <= 4) return 3;
  return 4; // All 5 prayers
};

// Get color for contribution level - Modern emerald theme
export const getContributionColor = (level: number, isDark: boolean): string => {
  const lightColors = ['#F4F1EC', '#E8E2D8', '#D4CCB8', '#B8B094', '#7F8F6A'];
  const darkColors = ['#2A2A2A', '#4A4A3A', '#6A6A5A', '#8A8A7A', '#7F8F6A'];
  return isDark ? darkColors[level] : lightColors[level];
};

// Format date helpers
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

// Get dates for last N days
export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDateKey(date));
  }
  
  return dates;
};

// Get week number of the year
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Motivational messages based on consistency
export const getMotivationalMessage = (consistencyPercent: number): string => {
  if (consistencyPercent >= 95) return "Ma sha Allah! Excellent consistency! Keep it up! 🌟";
  if (consistencyPercent >= 80) return "Great job! You're doing well. Aim for perfection! 💪";
  if (consistencyPercent >= 60) return "Good progress! Keep pushing towards consistency! 📈";
  if (consistencyPercent >= 40) return "Every prayer counts. Stay committed! 🤲";
  if (consistencyPercent >= 20) return "Start fresh today. Allah loves consistency! ❤️";
  return "Begin your journey. The first step is the hardest! 🚀";
};
