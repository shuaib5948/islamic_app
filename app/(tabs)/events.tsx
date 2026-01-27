import { EventCard } from '@/components/EventCard';
import { EventListItem } from '@/components/EventListItem';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { HIJRI_MONTHS, ISLAMIC_EVENTS, IslamicEvent } from '@/data/hijri-events';
import { HIJRI_MONTHS_ML, ISLAMIC_EVENTS_ML, IslamicEventML } from '@/data/hijri-events-ml';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteCustomEvent, getCustomEvents, getCustomEventsML, saveCustomEvent } from '@/utils/event-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, InteractionManager, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, t } = useLanguage();
  const isMalayalam = language === 'ml';
  const colors = isDark ? Colors.dark : Colors.light;

  // Use fast fallback Hijri date (sync)
  const todayHijri = require('@/utils/hijri-date').getTodayHijri();
  const todayHijriMonth = todayHijri.month;
  const todayHijriDay = todayHijri.day;
  const [selectedMonth, setSelectedMonth] = useState<number | null>(todayHijriMonth);
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | IslamicEventML | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    month: todayHijriMonth,
    day: todayHijriDay,
    type: 'religious' as 'religious' | 'wafat' | 'birth' | 'historic'
  });
  const [customEvents, setCustomEvents] = useState<IslamicEvent[]>([]);
  const [customEventsML, setCustomEventsML] = useState<IslamicEventML[]>([]);
  const monthScrollRef = useRef<ScrollView>(null);

  // Ensure current month is selected by default
  useEffect(() => {
    setSelectedMonth(todayHijriMonth);
  }, [todayHijriMonth]);

  // Scroll to current month when component mounts
  useEffect(() => {
    if (todayHijriMonth) {
      // Use InteractionManager to ensure scroll happens after layout is complete
      InteractionManager.runAfterInteractions(() => {
        if (monthScrollRef.current) {
          // Since current month is now first, just scroll past the "All Months" chip
          const allMonthsChipWidth = 76; // 70px width + 6px margin
          monthScrollRef.current.scrollTo({ x: allMonthsChipWidth, animated: false });
        }
      });
    }
  }, [todayHijriMonth]);

  // Load custom events on component mount and when screen comes into focus
  useEffect(() => {
    const loadCustomEvents = async () => {
      try {
        const [englishEvents, malayalamEvents] = await Promise.all([
          getCustomEvents(),
          getCustomEventsML()
        ]);
        setCustomEvents(englishEvents);
        setCustomEventsML(malayalamEvents);
      } catch (error) {
        console.error('Error loading custom events:', error);
      }
    };

    loadCustomEvents();
  }, []);

  // Reload custom events when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadCustomEvents = async () => {
        try {
          const [englishEvents, malayalamEvents] = await Promise.all([
            getCustomEvents(),
            getCustomEventsML()
          ]);
          setCustomEvents(englishEvents);
          setCustomEventsML(malayalamEvents);
        } catch (error) {
          console.error('Error loading custom events:', error);
        }
      };

      loadCustomEvents();
    }, [])
  );

  // Get the appropriate events and months based on language
  const events = useMemo(() => {
    const baseEvents = isMalayalam ? ISLAMIC_EVENTS_ML : ISLAMIC_EVENTS;
    const customEventsList = isMalayalam ? customEventsML : customEvents;
    return [...baseEvents, ...customEventsList];
  }, [isMalayalam, customEvents, customEventsML]);
  const baseMonths = isMalayalam ? HIJRI_MONTHS_ML : HIJRI_MONTHS;

  // Reorder months to start with current month
  const months = useMemo(() => {
    if (!todayHijriMonth) return baseMonths;
    const currentMonthIndex = todayHijriMonth - 1; // 0-based index
    return [
      ...baseMonths.slice(currentMonthIndex), // Current month to end
      ...baseMonths.slice(0, currentMonthIndex) // Beginning to current month
    ];
  }, [baseMonths, todayHijriMonth]);

  const filteredEvents = useMemo(() => {
    let eventList = [...events];

    // Filter by month
    if (selectedMonth !== null) {
      eventList = eventList.filter(event => event.month === selectedMonth);
    }

    // Sort by month and day
    return eventList.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
  }, [selectedMonth, events]);

  const isLoadingHijri = false;

  // Find today's events or upcoming event
  const todayEvents = useMemo(() => {
    if (!todayHijriMonth || !todayHijriDay) return [];
    return events.filter(event =>
      event.month === todayHijriMonth && event.day === todayHijriDay
    );
  }, [events, todayHijriMonth, todayHijriDay]);

  const upcomingEvent = useMemo(() => {
    if (!todayHijriMonth || !todayHijriDay) return null;

    // If there are events today, return the first one
    if (todayEvents.length > 0) {
      return todayEvents[0];
    }

    // Otherwise, find the next upcoming event
    const sorted = [...events].sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
    return (
      sorted.find(e =>
        e.month > todayHijriMonth || (e.month === todayHijriMonth && e.day > todayHijriDay)
      ) || sorted[0]
    );
  }, [events, todayHijriMonth, todayHijriDay, todayEvents]);

  const isTodayEvent = todayEvents.length > 0;

  // Get display title based on language
  const getEventTitle = (event: IslamicEvent | IslamicEventML): string => {
    if (isMalayalam && 'titleMl' in event) {
      return event.titleMl;
    }
    return event.title;
  };

  // Get display description based on language
  const getEventDescription = (event: IslamicEvent | IslamicEventML): string => {
    if (isMalayalam && 'descriptionMl' in event) {
      return event.descriptionMl;
    }
    return event.description;
  };

  // Handle saving new event
  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) {
      // Could add validation feedback here
      return;
    }

    try {
      await saveCustomEvent({
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        month: newEvent.month,
        day: newEvent.day,
        type: newEvent.type
      });

      // Reload custom events
      const [englishEvents, malayalamEvents] = await Promise.all([
        getCustomEvents(),
        getCustomEventsML()
      ]);
      setCustomEvents(englishEvents);
      setCustomEventsML(malayalamEvents);

      // Reset form and close modal
      setNewEvent({
        title: '',
        description: '',
        month: todayHijriMonth,
        day: todayHijriDay,
        type: 'religious'
      });
      setShowAddEventModal(false);

      // Could add success feedback here
    } catch (error) {
      console.error('Error saving event:', error);
      // Could add error feedback here
    }
  };

  // Handle deleting custom event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteCustomEvent(eventId);
      
      // Reload custom events
      const [englishEvents, malayalamEvents] = await Promise.all([
        getCustomEvents(),
        getCustomEventsML()
      ]);
      setCustomEvents(englishEvents);
      setCustomEventsML(malayalamEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Render right swipe actions for custom events
  const renderRightActions = (eventId: string) => (
    <TouchableOpacity
      style={[styles.deleteAction, { backgroundColor: '#E53935' }]}
      onPress={() => handleDeleteEvent(eventId)}
    >
      <Ionicons name="trash" size={24} color="#FFFFFF" />
      <Text style={styles.deleteText}>
        {isMalayalam ? 'ഇല്ലാതാക്കുക' : 'Delete'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: isMalayalam ? 20 : 28, textAlign: 'center', flex: 1 }]}>
          {isMalayalam ? 'ഇസ്ലാമിക മുഹൂർത്തങ്ങൾ' : 'Islamic Events'}
        </Text>
        <TouchableOpacity onPress={() => setShowAddEventModal(true)} style={styles.addButton}>
          <Text style={[styles.addIcon, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Event Box (only after Hijri date loads) */}
      {!isLoadingHijri && upcomingEvent && (
        <TouchableOpacity 
          style={[styles.upcomingBox, { backgroundColor: colors.primary }]}
          onPress={() => setSelectedEvent(upcomingEvent)}
          activeOpacity={0.7}
        >
          <Text style={[styles.upcomingLabel, { color: '#FFFFFF' }]}> 
            {isMalayalam
              ? (isTodayEvent ? 'ഇന്നത്തെ പരിപാടി' : 'അടുത്ത പരിപാടി')
              : (isTodayEvent ? 'Today Event' : 'Upcoming Event')
            }
          </Text>
          <Text style={[styles.upcomingTitle, { color: '#FFFFFF' }]}> 
            {String(isMalayalam && upcomingEvent && 'titleMl' in upcomingEvent ? upcomingEvent.titleMl : upcomingEvent?.title || '')}
          </Text>
          <Text style={[styles.upcomingDate, { color: 'rgba(255, 255, 255, 0.9)' }]}> 
            {isTodayEvent
              ? (isMalayalam ? 'ഇന്ന്' : 'Today')
              : `${upcomingEvent.day} ${baseMonths[upcomingEvent.month - 1]?.name}`
            }
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ zIndex: 2, elevation: 2, backgroundColor: colors.background, marginBottom: 8 }}>
        <ScrollView
          ref={monthScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScrollView}
          contentContainerStyle={styles.monthScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.monthChip,
              selectedMonth === null && styles.monthChipSelected,
              {
                backgroundColor: selectedMonth === null ? colors.primary : colors.card,
                paddingHorizontal: 16, // increased padding for better text spacing
                minWidth: 60, // reduced minimum width for shorter month names
                alignSelf: 'flex-start',
                maxWidth: 200, // increased maximum width to allow longer month names
              },
            ]}
            onPress={() => setSelectedMonth(null)}
          >
            <Text
              style={[
                styles.monthChipText,
                { color: selectedMonth === null ? '#FFFFFF' : colors.text },
              ]}
              numberOfLines={1}
            >
              {isMalayalam ? 'എല്ലാ മാസങ്ങളും' : 'All Months'}
            </Text>
          </TouchableOpacity>
          {months.map(month => (
            <TouchableOpacity
              key={month.number}
              style={[
                styles.monthChip,
                selectedMonth === month.number && styles.monthChipSelected,
                {
                  backgroundColor: selectedMonth === month.number ? colors.primary : colors.card,
                  paddingHorizontal: 16, // increased padding for better text spacing
                  minWidth: 60, // reduced minimum width for shorter month names
                  alignSelf: 'flex-start',
                  maxWidth: 200, // increased maximum width to allow longer month names
                },
              ]}
              onPress={() => setSelectedMonth(month.number)}
            >
              <Text
                style={[
                  styles.monthChipText,
                  { color: selectedMonth === month.number ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
              >
                {isMalayalam && 'nameEn' in month ? month.name : month.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isCustomEvent = item.id.startsWith('custom_');
          
          if (isCustomEvent) {
            return (
              <Swipeable
                renderRightActions={() => renderRightActions(item.id)}
                rightThreshold={40}
              >
                <EventListItem 
                  event={item} 
                  onPress={() => setSelectedEvent(item)}
                  displayTitle={getEventTitle(item)}
                  isMalayalam={isMalayalam}
                />
              </Swipeable>
            );
          }
          
          return (
            <EventListItem 
              event={item} 
              onPress={() => setSelectedEvent(item)}
              displayTitle={getEventTitle(item)}
              isMalayalam={isMalayalam}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {isMalayalam ? 'ഇവൻ്റുകളൊന്നും കണ്ടെത്തിയില്ല' : 'No events found'}
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* Event Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Event Details
              </Text>
              <View style={styles.modalHeaderButtons}>
                {selectedEvent && selectedEvent.id.startsWith('custom_') && (
                  <TouchableOpacity 
                    onPress={() => {
                      handleDeleteEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={20} color="#E53935" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => setSelectedEvent(null)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeButtonText, { color: colors.accent }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Date Info */}
              {selectedEvent && (
                <View style={[styles.dateInfoSection, { backgroundColor: colors.primary }]}>
                  <Text style={styles.modalDateText}>
                    {baseMonths[selectedEvent.month - 1]?.name} {selectedEvent.day}
                  </Text>
                  <Text style={styles.modalDateArabic}>
                    {baseMonths[selectedEvent.month - 1]?.arabic}
                  </Text>
                </View>
              )}

              {/* Event Card */}
              {selectedEvent && (
                <EventCard 
                  event={selectedEvent} 
                  displayTitle={getEventTitle(selectedEvent)}
                  displayDescription={getEventDescription(selectedEvent)}
                  isMalayalam={isMalayalam}
                />
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        visible={showAddEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isMalayalam ? 'പുതിയ ഇവന്റ് ചേർക്കുക' : 'Add New Event'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddEventModal(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.accent }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {isMalayalam ? 'തലക്കെട്ട്' : 'Title'}
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.card
                    }]}
                    placeholder={isMalayalam ? 'ഇവന്റ് തലക്കെട്ട്' : 'Event title'}
                    placeholderTextColor={colors.text}
                    value={newEvent.title}
                    onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                  />
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {isMalayalam ? 'വിവരണം' : 'Description'}
                  </Text>
                  <TextInput
                    style={[styles.textArea, {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.card
                    }]}
                    placeholder={isMalayalam ? 'ഇവന്റ് വിവരണം' : 'Event description'}
                    placeholderTextColor={colors.text}
                    multiline
                    numberOfLines={4}
                    value={newEvent.description}
                    onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                  />
                </View>

                {/* Month Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {isMalayalam ? 'മാസം' : 'Month'}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthScrollView}
                    contentContainerStyle={styles.monthScrollContent}
                  >
                    {baseMonths.map((month) => (
                      <TouchableOpacity
                        key={month.number}
                        style={[
                          styles.monthChip,
                          newEvent.month === month.number && styles.monthChipSelected,
                          {
                            backgroundColor: newEvent.month === month.number ? colors.primary : colors.card,
                            paddingHorizontal: 16,
                            minWidth: 60,
                            alignSelf: 'flex-start',
                            maxWidth: 200,
                          },
                        ]}
                        onPress={() => setNewEvent({ ...newEvent, month: month.number })}
                      >
                        <Text
                          style={[
                            styles.monthChipText,
                            { color: newEvent.month === month.number ? '#FFFFFF' : colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {isMalayalam && 'nameEn' in month ? month.name : month.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Day Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {isMalayalam ? 'ദിവസം' : 'Day'}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthScrollView}
                    contentContainerStyle={styles.monthScrollContent}
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.monthChip,
                          newEvent.day === day && styles.monthChipSelected,
                          {
                            backgroundColor: newEvent.day === day ? colors.primary : colors.card,
                            paddingHorizontal: 12,
                            minWidth: 50,
                            alignSelf: 'flex-start',
                            maxWidth: 60,
                          },
                        ]}
                        onPress={() => setNewEvent({ ...newEvent, day })}
                      >
                        <Text
                          style={[
                            styles.monthChipText,
                            { color: newEvent.day === day ? '#FFFFFF' : colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Type Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {isMalayalam ? 'തരം' : 'Type'}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthScrollView}
                    contentContainerStyle={styles.monthScrollContent}
                  >
                    {[
                      { key: 'religious', label: isMalayalam ? 'മതപരം' : 'Religious' },
                      { key: 'historic', label: isMalayalam ? 'ചരിത്രപരം' : 'Historic' },
                      { key: 'birth', label: isMalayalam ? 'ജനനം' : 'Birth' },
                      { key: 'wafat', label: isMalayalam ? 'വഫാത്ത്' : 'Wafat' }
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.key}
                        style={[
                          styles.monthChip,
                          newEvent.type === type.key && styles.monthChipSelected,
                          {
                            backgroundColor: newEvent.type === type.key ? colors.eventTypes[type.key as keyof typeof colors.eventTypes] : colors.card,
                            paddingHorizontal: 16,
                            minWidth: 80,
                            alignSelf: 'flex-start',
                            maxWidth: 150,
                          },
                        ]}
                        onPress={() => setNewEvent({ ...newEvent, type: type.key as 'religious' | 'historic' | 'birth' | 'wafat' })}
                      >
                        <Text
                          style={[
                            styles.monthChipText,
                            { color: newEvent.type === type.key ? '#FFFFFF' : colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: colors.card }]}
                    onPress={() => {
                      setShowAddEventModal(false);
                      setNewEvent({ title: '', description: '', month: todayHijriMonth, day: todayHijriDay, type: 'religious' });
                    }}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                      {isMalayalam ? 'റദ്ദാക്കുക' : 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSaveEvent}
                  >
                    <Text style={styles.saveButtonText}>
                      {isMalayalam ? 'സംരക്ഷിക്കുക' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  upcomingBox: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  upcomingLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  upcomingDate: {
    fontSize: 13,
    textAlign: 'center',
  },
  monthScrollView: {
    maxHeight: 80, // increased height for full chip visibility
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthChip: {
    // width: 70, // removed fixed width to allow dynamic sizing
    height: 36, // slightly reduced height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 6, // reduced margin
    marginVertical: 6, // reduced vertical margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthChipSelected: {},
  monthChipText: {
    fontSize: 12, // reduced font size
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8, // increased top padding to give more space below month cards
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  modalBody: {
    padding: 16,
  },
  dateInfoSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  modalDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalDateArabic: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  typeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    marginVertical: 4,
    marginRight: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
