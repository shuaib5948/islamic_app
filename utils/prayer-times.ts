/**
 * Prayer Times Utility
 * Fetches accurate prayer times based on user's location using Aladhan API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimesData {
  times: PrayerTimes;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  method: number;
  lastUpdated: number;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      [key: string]: string;
    };
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
      };
      hijri: {
        date: string;
        day: string;
        weekday: { en: string; ar: string };
        month: { number: number; en: string; ar: string };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
  };
}

const STORAGE_KEY = 'prayer_times_cache';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Calculation methods
export const CALCULATION_METHODS = {
  1: 'University of Islamic Sciences, Karachi',
  2: 'Islamic Society of North America (ISNA)',
  3: 'Muslim World League',
  4: 'Umm Al-Qura University, Makkah',
  5: 'Egyptian General Authority of Survey',
  7: 'Institute of Geophysics, University of Tehran',
  8: 'Gulf Region',
  9: 'Kuwait',
  10: 'Qatar',
  11: 'Majlis Ugama Islam Singapura, Singapore',
  12: 'Union Organization Islamic de France',
  13: 'Diyanet İşleri Başkanlığı, Turkey',
  14: 'Spiritual Administration of Muslims of Russia',
  15: 'Moonsighting Committee Worldwide',
};

// Default method - Muslim World League (commonly used)
const DEFAULT_METHOD = 3;

// Parse time string (HH:MM) to hours and minutes
export const parseTimeString = (timeStr: string): { hour: number; minute: number } => {
  const cleanTime = timeStr.replace(/\s*\(.*?\)\s*/g, '').trim();
  const [hourStr, minuteStr] = cleanTime.split(':');
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
  };
};

// Format time for display (12-hour format)
export const formatTimeDisplay = (timeStr: string): string => {
  const { hour, minute } = parseTimeString(timeStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Format time for 24-hour display
export const formatTime24 = (timeStr: string): string => {
  const { hour, minute } = parseTimeString(timeStr);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Get user's current location
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Get city name from coordinates (reverse geocoding)
export const getCityFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<{ city?: string; country?: string }> => {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address) {
      return {
        city: address.city || address.subregion || address.region || undefined,
        country: address.country || undefined,
      };
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
  }
  return {};
};

// Fetch prayer times from Aladhan API
export const fetchPrayerTimesFromAPI = async (
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  method: number = DEFAULT_METHOD
): Promise<PrayerTimes | null> => {
  try {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: AladhanResponse = await response.json();

    if (data.code !== 200 || !data.data?.timings) {
      throw new Error('Invalid API response');
    }

    const timings = data.data.timings;

    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
};

// Load cached prayer times
const loadCachedPrayerTimes = async (): Promise<PrayerTimesData | null> => {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error loading cached prayer times:', error);
  }
  return null;
};

// Save prayer times to cache
const savePrayerTimesToCache = async (data: PrayerTimesData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving prayer times to cache:', error);
  }
};

// Check if cache is valid for current date and location
const isCacheValid = (cached: PrayerTimesData, currentDate: string): boolean => {
  // Check if same date
  if (cached.date !== currentDate) {
    return false;
  }

  // Check if cache is too old
  const now = Date.now();
  if (now - cached.lastUpdated > CACHE_DURATION) {
    return false;
  }

  return true;
};

// Main function to get prayer times
export const getPrayerTimes = async (
  method: number = DEFAULT_METHOD,
  forceRefresh: boolean = false
): Promise<PrayerTimesData | null> => {
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = await loadCachedPrayerTimes();
    if (cached && isCacheValid(cached, dateKey)) {
      return cached;
    }
  }

  // Get current location
  const location = await getCurrentLocation();
  if (!location) {
    // Return cached data if available (even if expired)
    const cached = await loadCachedPrayerTimes();
    if (cached) {
      return cached;
    }
    return null;
  }

  // Fetch prayer times from API
  const times = await fetchPrayerTimesFromAPI(
    location.latitude,
    location.longitude,
    today,
    method
  );

  if (!times) {
    // Return cached data if available
    const cached = await loadCachedPrayerTimes();
    if (cached) {
      return cached;
    }
    return null;
  }

  // Get city name
  const { city, country } = await getCityFromCoordinates(
    location.latitude,
    location.longitude
  );

  // Create and cache the data
  const prayerData: PrayerTimesData = {
    times,
    date: dateKey,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      city,
      country,
    },
    method,
    lastUpdated: Date.now(),
  };

  await savePrayerTimesToCache(prayerData);

  return prayerData;
};

// Get default/fallback prayer times (when location is not available)
export const getDefaultPrayerTimes = (): PrayerTimes => {
  return {
    fajr: '05:30',
    sunrise: '06:45',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:15',
    isha: '19:45',
  };
};

// Calculate time remaining until a prayer
export const getTimeUntilPrayer = (
  prayerTime: string,
  currentTime: Date = new Date()
): { hours: number; minutes: number; isPast: boolean } => {
  const { hour: prayerHour, minute: prayerMinute } = parseTimeString(prayerTime);
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const prayerMinutes = prayerHour * 60 + prayerMinute;

  if (prayerMinutes > currentMinutes) {
    const diffMinutes = prayerMinutes - currentMinutes;
    return {
      hours: Math.floor(diffMinutes / 60),
      minutes: diffMinutes % 60,
      isPast: false,
    };
  }

  return { hours: 0, minutes: 0, isPast: true };
};

// Get next prayer info
export const getNextPrayerInfo = (
  times: PrayerTimes,
  currentTime: Date = new Date()
): {
  name: string;
  time: string;
  timeLeft: string;
  isNextDay: boolean;
} => {
  const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  for (const prayer of prayerOrder) {
    const { hour, minute } = parseTimeString(times[prayer]);
    const prayerMinutes = hour * 60 + minute;

    if (prayerMinutes > currentMinutes) {
      const diffMinutes = prayerMinutes - currentMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return {
        name: prayer,
        time: times[prayer],
        timeLeft: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
        isNextDay: false,
      };
    }
  }

  // After Isha, next is Fajr tomorrow
  const { hour: fajrHour, minute: fajrMinute } = parseTimeString(times.fajr);
  const fajrMinutes = fajrHour * 60 + fajrMinute;
  const diffMinutes = (24 * 60 - currentMinutes) + fajrMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  return {
    name: 'fajr',
    time: times.fajr,
    timeLeft: `${hours}h ${mins}m`,
    isNextDay: true,
  };
};

// Clear cached prayer times
export const clearPrayerTimesCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing prayer times cache:', error);
  }
};
