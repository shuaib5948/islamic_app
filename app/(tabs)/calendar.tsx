import { CalendarGrid } from '@/components/CalendarGrid';
import { TodayHighlight } from '@/components/TodayHighlight';
import { useLanguage } from '@/contexts/LanguageContext';
import { getEventsForDate } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    generateHijriMonthCalendarAsync,
    getHijriMonthName,
    getTodayHijri,
    getTodayHijriAsync,
    HijriDate,
    hijriToGregorian
} from '@/utils/hijri-date';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  // Start with sync fallback, then update with API
  const [todayHijri, setTodayHijri] = useState<HijriDate>(getTodayHijri());
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(todayHijri.month);
  const [currentYear, setCurrentYear] = useState(todayHijri.year);
  const [selectedDay, setSelectedDay] = useState(todayHijri.day);
  const [calendarDays, setCalendarDays] = useState<{ day: number; gregorianDate: Date; weekday: number }[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  // Fetch accurate Hijri date from API
  const loadAccurateHijriDate = useCallback(async () => {
    try {
      setIsLoading(true);
      const accurateHijri = await getTodayHijriAsync();
      setTodayHijri(accurateHijri);
      // Only update view if still on initial state
      if (currentMonth === getTodayHijri().month && currentYear === getTodayHijri().year) {
        setCurrentMonth(accurateHijri.month);
        setCurrentYear(accurateHijri.year);
        setSelectedDay(accurateHijri.day);
      }
    } catch (error) {
      console.error('Error loading Hijri date:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load calendar days using API for Kerala accuracy
  const loadCalendarDays = useCallback(async (year: number, month: number) => {
    setLoadingCalendar(true);
    try {
      const days = await generateHijriMonthCalendarAsync(year, month);
      setCalendarDays(days);
    } catch (error) {
      setCalendarDays([]);
      console.error('Error loading calendar days:', error);
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  useEffect(() => {
    loadAccurateHijriDate();
  }, [loadAccurateHijriDate]);

  useEffect(() => {
    loadCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth, loadCalendarDays]);

  const selectedEvents = useMemo(() => 
    getEventsForDate(currentMonth, selectedDay),
    [currentMonth, selectedDay]
  );

  const selectedGregorianDate = useMemo(() => 
    hijriToGregorian(currentYear, currentMonth, selectedDay),
    [currentYear, currentMonth, selectedDay]
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
          <Text style={[styles.appTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            🌙 {labels.title}  <Text style={[styles.appSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>{labels.subtitle}</Text>
          </Text>
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
            />
          )}
        </View>
      </ScrollView>
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
  appSubtitle: {
    fontSize: 16,
    marginLeft: 8,
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

});
