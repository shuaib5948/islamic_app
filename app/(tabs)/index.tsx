import { CalendarGrid } from '@/components/CalendarGrid';
import { EventCard } from '@/components/EventCard';
import { TodayHighlight } from '@/components/TodayHighlight';
import { getEventsForDate } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { generateHijriMonthCalendar, getHijriMonthName, getTodayHijri } from '@/utils/hijri-date';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const todayHijri = getTodayHijri();
  const [currentMonth, setCurrentMonth] = useState(todayHijri.month);
  const [currentYear, setCurrentYear] = useState(todayHijri.year);
  const [selectedDay, setSelectedDay] = useState(todayHijri.day);

  const calendarDays = useMemo(() => 
    generateHijriMonthCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const selectedEvents = useMemo(() => 
    getEventsForDate(currentMonth, selectedDay),
    [currentMonth, selectedDay]
  );

  const todayEvents = useMemo(() => 
    getEventsForDate(todayHijri.month, todayHijri.day),
    [todayHijri.month, todayHijri.day]
  );

  const monthName = getHijriMonthName(currentMonth);

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

  const isViewingToday = currentMonth === todayHijri.month && 
                          currentYear === todayHijri.year && 
                          selectedDay === todayHijri.day;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            🌙 Hijri Calendar
          </Text>
          <Text style={[styles.appSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            التقويم الهجري
          </Text>
        </View>

        {/* Today's Highlight Card */}
        <TodayHighlight
          hijriDate={todayHijri}
          gregorianDate={new Date()}
          events={todayEvents}
        />

        {/* Month Navigation */}
        <View style={[styles.monthNavigation, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToToday} style={styles.monthTitleContainer}>
            <Text style={[styles.monthTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {monthName.name} {currentYear}
            </Text>
            <Text style={[styles.monthTitleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              {monthName.arabic}
            </Text>
            {!isViewingToday && (
              <Text style={styles.todayButton}>Tap to go to today</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={[styles.calendarContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <CalendarGrid
            days={calendarDays}
            month={currentMonth}
            year={currentYear}
            todayDay={todayHijri.day}
            todayMonth={todayHijri.month}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        </View>

        {/* Selected Day Events */}
        <View style={styles.eventsSection}>
          <Text style={[styles.eventsSectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {selectedDay} {monthName.name}
          </Text>
          
          {selectedEvents.length > 0 ? (
            selectedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <View style={[styles.noEventsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.noEventsText, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                No special events on this day.
              </Text>
              <Text style={[styles.noEventsSubtext, { color: isDark ? '#757575' : '#9E9E9E' }]}>
                Remember to maintain your daily prayers and Adhkar.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
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
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  appSubtitle: {
    fontSize: 18,
    textAlign: 'right',
    marginTop: 4,
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
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventsSection: {
    marginTop: 20,
  },
  eventsSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  noEventsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noEventsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
