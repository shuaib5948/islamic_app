import { IslamicEvent } from '@/data/hijri-events';
import { IslamicEventML } from '@/data/hijri-events-ml';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_EVENTS_KEY = 'custom_islamic_events';
const CUSTOM_EVENTS_ML_KEY = 'custom_islamic_events_ml';

export interface CustomEvent extends Omit<IslamicEvent, 'id'> {
  id: string; // Custom events will have string IDs
}

export interface CustomEventML extends Omit<IslamicEventML, 'id'> {
  id: string; // Custom events will have string IDs
}

// Get custom events
export const getCustomEvents = async (): Promise<CustomEvent[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(CUSTOM_EVENTS_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error loading custom events:', error);
    return [];
  }
};

// Get custom events in Malayalam
export const getCustomEventsML = async (): Promise<CustomEventML[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(CUSTOM_EVENTS_ML_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error loading custom events ML:', error);
    return [];
  }
};

// Save custom event
export const saveCustomEvent = async (event: Omit<CustomEvent, 'id'>): Promise<CustomEvent> => {
  try {
    const customEvents = await getCustomEvents();
    const newEvent: CustomEvent = {
      ...event,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    customEvents.push(newEvent);
    await AsyncStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(customEvents));

    // Also save Malayalam version if needed
    const mlEvent: CustomEventML = {
      ...event,
      titleMl: event.title, // For now, use same title
      descriptionMl: event.description, // For now, use same description
      id: newEvent.id,
    };

    const customEventsML = await getCustomEventsML();
    customEventsML.push(mlEvent);
    await AsyncStorage.setItem(CUSTOM_EVENTS_ML_KEY, JSON.stringify(customEventsML));

    return newEvent;
  } catch (error) {
    console.error('Error saving custom event:', error);
    throw error;
  }
};

// Delete custom event
export const deleteCustomEvent = async (eventId: string): Promise<void> => {
  try {
    // Delete from English events
    const customEvents = await getCustomEvents();
    const filteredEvents = customEvents.filter(event => event.id !== eventId);
    await AsyncStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(filteredEvents));

    // Delete from Malayalam events
    const customEventsML = await getCustomEventsML();
    const filteredEventsML = customEventsML.filter(event => event.id !== eventId);
    await AsyncStorage.setItem(CUSTOM_EVENTS_ML_KEY, JSON.stringify(filteredEventsML));
  } catch (error) {
    console.error('Error deleting custom event:', error);
    throw error;
  }
};

// Update custom event
export const updateCustomEvent = async (eventId: string, updates: Partial<CustomEvent>): Promise<void> => {
  try {
    // Update English event
    const customEvents = await getCustomEvents();
    const eventIndex = customEvents.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
      customEvents[eventIndex] = { ...customEvents[eventIndex], ...updates };
      await AsyncStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(customEvents));
    }

    // Update Malayalam event
    const customEventsML = await getCustomEventsML();
    const mlEventIndex = customEventsML.findIndex(event => event.id === eventId);
    if (mlEventIndex !== -1) {
      customEventsML[mlEventIndex] = { ...customEventsML[mlEventIndex], ...updates };
      await AsyncStorage.setItem(CUSTOM_EVENTS_ML_KEY, JSON.stringify(customEventsML));
    }
  } catch (error) {
    console.error('Error updating custom event:', error);
    throw error;
  }
};