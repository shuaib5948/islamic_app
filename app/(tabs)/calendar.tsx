import { CalendarGrid } from '@/components/CalendarGrid';
import { TodayHighlight } from '@/components/TodayHighlight';
import { useLanguage } from '@/contexts/LanguageContext';
import { getEventsForDate, HIJRI_MONTHS } from '@/data/hijri-events';
import { HIJRI_MONTHS_ML } from '@/data/hijri-events-ml';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteCustomEvent, getCustomEvents, getCustomEventsML, saveCustomEvent } from '@/utils/event-storage';
import {
  generateHijriMonthCalendar,
  generateHijriMonthCalendarAsync,
  getHijriMonthName,
  getTodayHijri,
  getTodayHijriAsync,
  HijriDate,
  hijriToGregorian
} from '@/utils/hijri-date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  // Labels with Malayalam translations
  const labels = {
    title: isMalayalam ? 'Hijri Calendar' : 'Hijri Calendar',
    subtitle: 'التقويم الهجري',
    tapToGoToday: isMalayalam ? 'Tap to go to today' : 'Tap to go to today',
  };

  // Use cached Hijri date and calendar if available
  const [todayHijri, setTodayHijri] = useState<HijriDate>(getTodayHijri());
  const [currentMonth, setCurrentMonth] = useState(todayHijri.month);
  const [currentYear, setCurrentYear] = useState(todayHijri.year);
  const [selectedDay, setSelectedDay] = useState(todayHijri.day);
  const [calendarDays, setCalendarDays] = useState<{ day: number; gregorianDate: Date; weekday: number }[]>(() => generateHijriMonthCalendar(todayHijri.year, todayHijri.month));
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [customEventsML, setCustomEventsML] = useState<any[]>([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    month: currentMonth,
    day: selectedDay,
    type: 'religious' as 'religious' | 'historic' | 'birth' | 'wafat'
  });

  // On mount, refresh calendar data and save to local storage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingCalendar(true);
        const accurateHijri = await getTodayHijriAsync();
        const days = await generateHijriMonthCalendarAsync(accurateHijri.year, accurateHijri.month);
        
        // Load custom events
        const [englishEvents, malayalamEvents] = await Promise.all([
          getCustomEvents(),
          getCustomEventsML()
        ]);
        
        if (!cancelled) {
          setTodayHijri(accurateHijri);
          setCurrentMonth(accurateHijri.month);
          setCurrentYear(accurateHijri.year);
          setSelectedDay(accurateHijri.day);
          setCalendarDays(days);
          setCustomEvents(englishEvents);
          setCustomEventsML(malayalamEvents);
          setLoadingCalendar(false);
        }
        // Save to local storage
        const cacheKey = 'hijri_calendar_cache';
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          todayHijri: accurateHijri,
          currentMonth: accurateHijri.month,
          currentYear: accurateHijri.year,
          calendarDays: days
        }));
      } catch (error) {
        console.error('Error refreshing calendar:', error);
        if (!cancelled) {
          setLoadingCalendar(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // On month/year change, update calendar grid, but only fetch if 29th, 30th, or 1st
  useEffect(() => {
    setCalendarDays(generateHijriMonthCalendar(currentYear, currentMonth));
    let cancelled = false;
    (async () => {
      try {
        if ([29, 30, 1].includes(selectedDay)) {
          const days = await generateHijriMonthCalendarAsync(currentYear, currentMonth);
          if (!cancelled) setCalendarDays(days);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [currentYear, currentMonth, selectedDay]);

  // Update newEvent state when selected date changes
  useEffect(() => {
    setNewEvent(prev => ({
      ...prev,
      month: currentMonth,
      day: selectedDay
    }));
  }, [currentMonth, selectedDay]);

  const selectedEvents = useMemo(() => {
    const builtInEvents = getEventsForDate(currentMonth, selectedDay);
    const customEventsList = isMalayalam ? customEventsML : customEvents;
    const customEventsForDate = customEventsList.filter(event => 
      event.month === currentMonth && event.day === selectedDay
    );
    return [...builtInEvents, ...customEventsForDate];
  }, [currentMonth, selectedDay, customEvents, customEventsML, isMalayalam]);

  const selectedGregorianDate = useMemo(() => 
    hijriToGregorian(currentYear, currentMonth, selectedDay),
    [currentYear, currentMonth, selectedDay]
  );

  const monthName = getHijriMonthName(currentMonth);
  const baseMonths = isMalayalam ? HIJRI_MONTHS_ML : HIJRI_MONTHS;

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
  };

  const goToToday = () => {
    setCurrentMonth(todayHijri.month);
    setCurrentYear(todayHijri.year);
    setSelectedDay(todayHijri.day);
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
        month: currentMonth,
        day: selectedDay,
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

  const isViewingToday = currentMonth === todayHijri.month && 
                          currentYear === todayHijri.year && 
                          selectedDay === todayHijri.day;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
      >
        {/* App Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.appTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {labels.title}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddEventModal(true)} style={styles.addButton}>
            <Text style={[styles.addIcon, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Highlight Card */}
        <TodayHighlight
          hijriDate={{
            day: selectedDay,
            month: currentMonth,
            year: currentYear,
            monthName: monthName.name,
            monthNameArabic: monthName.arabic,
          }}
          gregorianDate={selectedGregorianDate}
          events={selectedEvents}
          isToday={isViewingToday}
          onDeleteEvent={handleDeleteEvent}
        />

        {/* Month Navigation */}
        <View style={[styles.monthNavigation, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToToday} style={styles.monthTitleContainer}>
            <Text style={[styles.monthTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {monthName.name} {toArabicNumerals(currentYear)}
            </Text>
            <Text style={[styles.monthTitleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              {monthName.arabic}
            </Text>
            {!isViewingToday && (
              <Text style={styles.todayButton}>{labels.tapToGoToday}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={[styles.calendarContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {loadingCalendar ? (
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ color: isDark ? '#B0BEC5' : '#757575' }}>Loading calendar...</Text>
            </View>
          ) : (
            <CalendarGrid
              days={calendarDays}
              month={currentMonth}
              year={currentYear}
              todayDay={todayHijri.day}
              todayMonth={todayHijri.month}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
              customEvents={isMalayalam ? customEventsML : customEvents}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={showAddEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                Add New Event
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddEventModal(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: isDark ? '#B0BEC5' : '#757575' }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Date Info */}
              <View style={[styles.dateInfoSection, { backgroundColor: isDark ? '#1B5E20' : '#2E7D32' }]}>
                <Text style={styles.modalDateText}>
                  {selectedDay} {monthName.name} {currentYear}
                </Text>
                <Text style={styles.modalDateArabic}>
                  {monthName.arabic}
                </Text>
              </View>

              {/* Form Container */}
              <View style={styles.formContainer}>
                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    Title
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      backgroundColor: isDark ? '#263238' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      borderColor: isDark ? '#333' : '#E0E0E0'
                    }]}
                    placeholder="Event title"
                    placeholderTextColor={isDark ? '#B0BEC5' : '#757575'}
                    value={newEvent.title}
                    onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                  />
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    Description
                  </Text>
                  <TextInput
                    style={[styles.textArea, {
                      backgroundColor: isDark ? '#263238' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      borderColor: isDark ? '#333' : '#E0E0E0'
                    }]}
                    placeholder="Event description"
                    placeholderTextColor={isDark ? '#B0BEC5' : '#757575'}
                    multiline
                    numberOfLines={4}
                    value={newEvent.description}
                    onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                  />
                </View>

                {/* Type Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    Type
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.monthScrollView}
                    contentContainerStyle={styles.monthScrollContent}
                  >
                    {[
                      { key: 'religious', label: 'Religious' },
                      { key: 'historic', label: 'Historic' },
                      { key: 'birth', label: 'Birth' },
                      { key: 'wafat', label: 'Wafat' }
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.key}
                        style={[
                          styles.monthChip,
                          newEvent.type === type.key && styles.monthChipSelected,
                          {
                            backgroundColor: newEvent.type === type.key ? '#2E7D32' : isDark ? '#1E1E1E' : '#FFFFFF',
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
                            { color: newEvent.type === type.key ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A' },
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
                    style={[styles.cancelButton, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}
                    onPress={() => {
                      setShowAddEventModal(false);
                      setNewEvent({ title: '', description: '', month: todayHijri.month, day: todayHijri.day, type: 'religious' });
                    }}
                  >
                    <Text style={[styles.cancelButtonText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: '#2E7D32' }]}
                    onPress={handleSaveEvent}
                  >
                    <Text style={styles.saveButtonText}>
                      Save
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
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
  appTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 36,
    fontWeight: '300',
  },
  monthTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthTitleArabic: {
    fontSize: 16,
    marginTop: 2,
  },
  todayButton: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 4,
  },
  calendarContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
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
  monthScrollView: {
    maxHeight: 80,
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthChip: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 6,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthChipSelected: {},
  monthChipText: {
    fontSize: 12,
    fontWeight: '500',
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

});
