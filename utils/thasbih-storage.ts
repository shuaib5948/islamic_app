import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'thasbih_counter_data';

export interface ThasbihData {
  count: number;
  lastUpdated: string;
  selectedDhikr: string;
}

const DEFAULT_DHIKR = 'سبحان الله';

export const loadThasbihData = async (): Promise<ThasbihData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading thasbih data:', error);
  }
  return {
    count: 0,
    lastUpdated: new Date().toISOString(),
    selectedDhikr: DEFAULT_DHIKR,
  };
};

export const saveThasbihData = async (data: ThasbihData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving thasbih data:', error);
  }
};

export const resetThasbihData = async (): Promise<void> => {
  const data: ThasbihData = {
    count: 0,
    lastUpdated: new Date().toISOString(),
    selectedDhikr: DEFAULT_DHIKR,
  };
  await saveThasbihData(data);
};