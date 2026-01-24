import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'thasbih_data';

export interface ThasbihGroup {
  id: string;
  name: string;
  target: number;
  currentCount: number;
  members: string[];
  dhikrType: string;
  joinCode: string;
  contributions: { [member: string]: number };
}

export interface ThasbihStorageData {
  mode: 'individual' | 'group';
  count: number;
  isCountdown: boolean;
  individualTarget: number;
  groupSessions: ThasbihGroup[];
  selectedGroupId: string | null;
}

export async function saveThasbihData(data: ThasbihStorageData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // handle error
    console.error('Failed to save thasbih data', e);
  }
}

export async function loadThasbihData(): Promise<ThasbihStorageData | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  } catch (e) {
    // handle error
    console.error('Failed to load thasbih data', e);
    return null;
  }
}

export async function clearThasbihData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // handle error
    console.error('Failed to clear thasbih data', e);
  }
}
