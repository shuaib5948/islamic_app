import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reflection_data';

export interface ReflectionEntry {
  date: string;
  question: string;
  mood: string;
  completed: boolean;
}

export const loadReflectionData = async (): Promise<Record<string, ReflectionEntry>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading reflection data:', error);
    return {};
  }
};

export const saveReflectionData = async (data: Record<string, ReflectionEntry>): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving reflection data:', error);
  }
};

export const getReflectionForDate = async (date: string): Promise<ReflectionEntry | null> => {
  const data = await loadReflectionData();
  return data[date] || null;
};

export const saveReflectionForDate = async (date: string, entry: ReflectionEntry): Promise<void> => {
  const data = await loadReflectionData();
  data[date] = entry;
  await saveReflectionData(data);
};

export const isReflectionCompletedToday = async (): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const entry = await getReflectionForDate(today);
  return entry?.completed || false;
};