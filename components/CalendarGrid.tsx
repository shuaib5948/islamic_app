import { Colors } from '@/constants/theme';
import { getEventsForDate } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
};

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  isToday: boolean;
  isSelected: boolean;
  gregorianDate: Date;
  onPress: () => void;
  customEvents?: any[];
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  month,
  year,
  isToday,
  isSelected,
  gregorianDate,
  onPress,
  customEvents = [],
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const builtInEvents = getEventsForDate(month, day);
  const customEventsForDay = customEvents.filter(event => 
    event.month === month && event.day === day
  );
  const allEvents = [...builtInEvents, ...customEventsForDay];
  const hasEvents = allEvents.length > 0;
  const hasHighImportance = false; // Removed importance field

  const getEventIndicatorColor = () => {
    if (hasHighImportance) return colors.primary;
    if (hasEvents) return colors.eventTypes.religious;
    return 'transparent';
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.dayContainer,
          isToday && styles.todayContainer,
          isSelected && styles.selectedContainer,
          { backgroundColor: isSelected ? colors.primary : isToday ? colors.secondary : 'transparent' },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isSelected || isToday
                ? colors.card
                : colors.text,
            },
          ]}
        >
          {toArabicNumerals(day)}
        </Text>
        {hasEvents && (
          <View
            style={[
              styles.eventIndicator,
              { backgroundColor: getEventIndicatorColor() },
            ]}
          />
        )}
      </View>
      <Text style={[styles.gregorianDay, { color: colors.secondary }]}>
        {gregorianDate.getDate()}
      </Text>
    </TouchableOpacity>
  );
};

interface CalendarGridProps {
  days: { day: number; gregorianDate: Date; weekday: number }[];
  month: number;
  year: number;
  todayDay: number;
  todayMonth: number;
  selectedDay: number;
  onDaySelect: (day: number) => void;
  customEvents?: any[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  month,
  year,
  todayDay,
  todayMonth,
  selectedDay,
  onDaySelect,
  customEvents = [],
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the first day's weekday to add empty cells
  const firstDayWeekday = days[0]?.weekday || 0;

  // Create grid with empty cells for proper alignment
  const calendarCells: (typeof days[0] | null)[] = [
    ...Array(firstDayWeekday).fill(null),
    ...days,
  ];

  // Fill remaining cells to complete the last week
  const remainingCells = 7 - (calendarCells.length % 7);
  if (remainingCells < 7) {
    calendarCells.push(...Array(remainingCells).fill(null));
  }

  return (
    <View style={styles.gridContainer}>
      {/* Week day headers */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={day} style={styles.weekDayCell}>
            <Text
              style={[
                styles.weekDayText,
                { color: index === 5 ? colors.eventTypes.religious : colors.secondary },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.daysGrid}>
        {calendarCells.map((cell, index) => (
          <View key={index} style={styles.dayCell}>
            {cell ? (
              <CalendarDay
                day={cell.day}
                month={month}
                year={year}
                isToday={cell.day === todayDay && month === todayMonth}
                isSelected={cell.day === selectedDay}
                gregorianDate={cell.gregorianDate}
                onPress={() => onDaySelect(cell.day)}
                customEvents={customEvents}
              />
            ) : (
              <View style={styles.emptyCell} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: Platform.OS === 'android' ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: Colors.light.eventTypes.religious,
  },
  selectedContainer: {
    borderWidth: 0,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gregorianDay: {
    fontSize: 9,
    marginTop: 1,
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  gridContainer: {
    width: '100%',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCell: {
    width: 36,
    height: 36,
  },
});
