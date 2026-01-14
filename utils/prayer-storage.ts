import {
    DailyPrayers,
    PrayerName,
    PrayerStats,
    PrayerStatus,
    createEmptyDailyPrayers,
    formatDateKey,
    getLastNDays,
} from '@/data/prayer-tracker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'prayer_tracker_data';

// Load all prayer data
export const loadPrayerData = async (): Promise<Record<string, DailyPrayers>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading prayer data:', error);
    return {};
  }
};

// Save all prayer data
export const savePrayerData = async (data: Record<string, DailyPrayers>): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving prayer data:', error);
  }
};

// Get prayers for a specific date
export const getPrayersForDate = async (date: string): Promise<DailyPrayers> => {
  const data = await loadPrayerData();
  return data[date] || createEmptyDailyPrayers(date);
};

// Update a single prayer status
export const updatePrayerStatus = async (
  date: string,
  prayer: PrayerName,
  status: PrayerStatus
): Promise<void> => {
  const data = await loadPrayerData();
  
  if (!data[date]) {
    data[date] = createEmptyDailyPrayers(date);
  }
  
  data[date].prayers[prayer] = status;
  await savePrayerData(data);
};

// Update all prayers for a date
export const updateDailyPrayers = async (dailyPrayers: DailyPrayers): Promise<void> => {
  const data = await loadPrayerData();
  data[dailyPrayers.date] = dailyPrayers;
  await savePrayerData(data);
};

// Get prayer data for date range
export const getPrayerDataRange = async (
  startDate: string,
  endDate: string
): Promise<Record<string, DailyPrayers>> => {
  const data = await loadPrayerData();
  const result: Record<string, DailyPrayers> = {};
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = formatDateKey(d);
    result[dateKey] = data[dateKey] || createEmptyDailyPrayers(dateKey);
  }
  
  return result;
};

// Calculate statistics
export const calculateStats = async (days: number = 30): Promise<PrayerStats> => {
  const data = await loadPrayerData();
  const dates = getLastNDays(days);
  
  let totalPrayers = 0;
  let prayedOnTime = 0;
  let prayedLate = 0;
  let qaza = 0;
  let missed = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (const date of dates) {
    const dailyPrayers = data[date];
    if (!dailyPrayers) continue;
    
    const statuses = Object.values(dailyPrayers.prayers);
    let allPrayed = true;
    
    for (const status of statuses) {
      if (status !== 'not_tracked') {
        totalPrayers++;
        switch (status) {
          case 'prayed':
            prayedOnTime++;
            break;
          case 'late':
            prayedLate++;
            break;
          case 'qaza':
            qaza++;
            break;
          case 'missed':
            missed++;
            allPrayed = false;
            break;
        }
      } else {
        allPrayed = false;
      }
    }
    
    // Calculate streak (all 5 prayers prayed - on time or late)
    const prayedCount = statuses.filter(s => s === 'prayed' || s === 'late').length;
    if (prayedCount === 5) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate current streak from most recent day backwards
  for (let i = dates.length - 1; i >= 0; i--) {
    const dailyPrayers = data[dates[i]];
    if (!dailyPrayers) break;
    
    const statuses = Object.values(dailyPrayers.prayers);
    const prayedCount = statuses.filter(s => s === 'prayed' || s === 'late').length;
    
    if (prayedCount === 5) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  const trackedPrayers = prayedOnTime + prayedLate + qaza + missed;
  const consistencyPercent = trackedPrayers > 0
    ? Math.round(((prayedOnTime + prayedLate) / trackedPrayers) * 100)
    : 0;
  
  return {
    totalPrayers: trackedPrayers,
    totalPrayed: prayedOnTime,
    totalLate: prayedLate,
    totalQaza: qaza,
    totalMissed: missed,
    prayedOnTime,
    prayedLate,
    qaza,
    missed,
    currentStreak,
    longestStreak,
    consistencyPercentage: consistencyPercent,
    consistencyPercent,
  };
};

// Get data for contribution graph (last N weeks)
export const getContributionData = async (weeks: number = 12): Promise<Record<string, DailyPrayers>> => {
  const days = weeks * 7;
  const dates = getLastNDays(days);
  const data = await loadPrayerData();
  
  const result: Record<string, DailyPrayers> = {};
  for (const date of dates) {
    result[date] = data[date] || createEmptyDailyPrayers(date);
  }
  
  return result;
};

// Get weekly statistics
export const getWeeklyStats = async (weeks: number = 4): Promise<{
  week: string;
  stats: Record<PrayerName, { prayed: number; total: number }>;
}[]> => {
  const data = await loadPrayerData();
  const result: {
    week: string;
    stats: Record<PrayerName, { prayed: number; total: number }>;
  }[] = [];
  
  const today = new Date();
  
  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (w * 7) - today.getDay());
    
    const weekStats: Record<PrayerName, { prayed: number; total: number }> = {
      fajr: { prayed: 0, total: 7 },
      dhuhr: { prayed: 0, total: 7 },
      asr: { prayed: 0, total: 7 },
      maghrib: { prayed: 0, total: 7 },
      isha: { prayed: 0, total: 7 },
    };
    
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      const dateKey = formatDateKey(date);
      
      const dailyPrayers = data[dateKey];
      if (dailyPrayers) {
        for (const prayer of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[]) {
          const status = dailyPrayers.prayers[prayer];
          if (status === 'prayed' || status === 'late') {
            weekStats[prayer].prayed++;
          }
        }
      }
    }
    
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    result.push({ week: weekLabel, stats: weekStats });
  }
  
  return result;
};

// Clear all prayer data (for testing/reset)
export const clearAllPrayerData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
