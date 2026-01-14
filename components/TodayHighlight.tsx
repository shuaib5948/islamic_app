import { IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HijriDate } from '@/utils/hijri-date';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TodayHighlightProps {
  hijriDate: HijriDate;
  gregorianDate: Date;
  events: IslamicEvent[];
}

export const TodayHighlight: React.FC<TodayHighlightProps> = ({
  hijriDate,
  gregorianDate,
  events,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDaysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isFriday = gregorianDate.getDay() === 5;
  const primaryEvent = events.find(e => e.importance === 'high') || events[0];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1B5E20' : '#2E7D32' }]}>
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <View style={styles.hijriDateContainer}>
          <Text style={styles.hijriDay}>{hijriDate.day}</Text>
          <View style={styles.hijriMonthYear}>
            <Text style={styles.hijriMonth}>{hijriDate.monthName}</Text>
            <Text style={styles.hijriMonthArabic}>{hijriDate.monthNameArabic}</Text>
            <Text style={styles.hijriYear}>{hijriDate.year} AH</Text>
          </View>
        </View>
        
        <View style={styles.weekdayContainer}>
          <Text style={[styles.weekday, isFriday && styles.fridayText]}>
            {weekDays[gregorianDate.getDay()]}
          </Text>
          <Text style={styles.weekdayArabic}>
            {weekDaysArabic[gregorianDate.getDay()]}
          </Text>
          {isFriday && (
            <View style={styles.fridayBadge}>
              <Text style={styles.fridayBadgeText}>🕌 Jumu'ah</Text>
            </View>
          )}
        </View>
      </View>

      {/* Gregorian Date */}
      <Text style={styles.gregorianDate}>
        {gregorianDate.getDate()} {months[gregorianDate.getMonth()]} {gregorianDate.getFullYear()}
      </Text>

      {/* Event Highlight */}
      {primaryEvent && (
        <View style={styles.eventHighlight}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventIcon}>
              {primaryEvent.type === 'religious' ? '🕌' : 
               primaryEvent.type === 'wafat' ? '🕯️' : 
               primaryEvent.type === 'birth' ? '🌟' : '📜'}
            </Text>
            <Text style={styles.todayLabel}>Today's Significance</Text>
          </View>
          
          <Text style={styles.eventTitle}>{primaryEvent.title}</Text>
          <Text style={styles.eventTitleArabic}>{primaryEvent.titleArabic}</Text>
          
          <Text style={styles.eventDescription} numberOfLines={4}>
            {primaryEvent.description}
          </Text>

          {/* Quick Dhikr Preview */}
          {primaryEvent.dhikr && primaryEvent.dhikr.length > 0 && (
            <View style={styles.quickDhikr}>
              <Text style={styles.quickDhikrLabel}>📿 Today's Dhikr:</Text>
              <Text style={styles.quickDhikrText} numberOfLines={2}>
                {primaryEvent.dhikr[0]}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* No events message */}
      {events.length === 0 && (
        <View style={styles.noEventContainer}>
          <Text style={styles.noEventText}>
            {isFriday 
              ? "🕌 Blessed Friday! Send abundant Salawat upon the Prophet ﷺ"
              : "May your day be blessed. Continue your daily Adhkar and prayers."
            }
          </Text>
        </View>
      )}

      {/* Multiple events indicator */}
      {events.length > 1 && (
        <Text style={styles.moreEvents}>
          +{events.length - 1} more event{events.length > 2 ? 's' : ''} today
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hijriDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hijriDay: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  hijriMonthYear: {
    justifyContent: 'center',
  },
  hijriMonth: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hijriMonthArabic: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  hijriYear: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  weekdayContainer: {
    alignItems: 'flex-end',
  },
  weekday: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fridayText: {
    color: '#FFD700',
  },
  weekdayArabic: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  fridayBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  fridayBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1B5E20',
  },
  gregorianDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  eventHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  eventTitleArabic: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickDhikr: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  quickDhikrLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 6,
  },
  quickDhikrText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  noEventContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  noEventText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  moreEvents: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 12,
  },
});
