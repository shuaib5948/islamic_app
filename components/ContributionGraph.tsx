import {
    DailyPrayers,
    getContributionColor,
    getContributionLevel,
    getLastNDays,
} from '@/data/prayer-tracker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ContributionGraphProps {
  data: Record<string, DailyPrayers>;
  weeks?: number;
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ data, weeks = 12 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const days = weeks * 7;
  const dates = useMemo(() => getLastNDays(days), [days]);

  // Organize dates into weeks (columns) with days (rows)
  const weeksData = useMemo(() => {
    const result: string[][] = [];
    let currentWeek: string[] = [];

    // Get the day of week for the first date to align properly
    const firstDate = new Date(dates[0]);
    const startDayOfWeek = firstDate.getDay();

    // Add empty cells for alignment
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push('');
    }

    for (const date of dates) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push('');
      }
      result.push(currentWeek);
    }

    return result;
  }, [dates]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; position: number }[] = [];
    let lastMonth = -1;

    weeksData.forEach((week, weekIndex) => {
      for (const dateStr of week) {
        if (dateStr) {
          const date = new Date(dateStr);
          const month = date.getMonth();
          if (month !== lastMonth) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            labels.push({ label: monthNames[month], position: weekIndex });
            lastMonth = month;
          }
          break;
        }
      }
    });

    return labels;
  }, [weeksData]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            📈 Prayer Consistency
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#8B949E' : '#64748B' }]}>
            Last {weeks} weeks
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.graphContainer}>
          {/* Month labels */}
          <View style={styles.monthLabelsContainer}>
            <View style={styles.dayLabelsSpace} />
            {monthLabels.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.monthLabel,
                  { color: isDark ? '#9E9E9E' : '#757575', left: item.position * 14 },
                ]}
              >
                {item.label}
              </Text>
            ))}
          </View>

          <View style={styles.graphContent}>
            {/* Day labels */}
            <View style={styles.dayLabelsContainer}>
              {dayLabels.map((day, index) => (
                <Text
                  key={day}
                  style={[
                    styles.dayLabel,
                    { color: isDark ? '#9E9E9E' : '#757575' },
                    index % 2 === 1 && styles.dayLabelVisible,
                  ]}
                >
                  {index % 2 === 1 ? day : ''}
                </Text>
              ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
              {weeksData.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekColumn}>
                  {week.map((dateStr, dayIndex) => {
                    if (!dateStr) {
                      return <View key={dayIndex} style={styles.emptyCell} />;
                    }

                    const dailyPrayers = data[dateStr];
                    const level = dailyPrayers ? getContributionLevel(dailyPrayers) : 0;
                    const color = getContributionColor(level, isDark);

                    return (
                      <View
                        key={dateStr}
                        style={[styles.cell, { backgroundColor: color }]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={[styles.legendText, { color: isDark ? '#8B949E' : '#64748B' }]}>Less</Text>
        {[0, 1, 2, 3, 4].map(level => (
          <View
            key={level}
            style={[styles.legendCell, { backgroundColor: getContributionColor(level, isDark) }]}
          />
        ))}
        <Text style={[styles.legendText, { color: isDark ? '#8B949E' : '#64748B' }]}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  graphContainer: {
    paddingRight: 16,
  },
  monthLabelsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    position: 'relative',
    height: 16,
  },
  dayLabelsSpace: {
    width: 28,
  },
  monthLabel: {
    fontSize: 10,
    position: 'absolute',
  },
  graphContent: {
    flexDirection: 'row',
  },
  dayLabelsContainer: {
    marginRight: 4,
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 9,
    height: 12,
    lineHeight: 12,
  },
  dayLabelVisible: {},
  grid: {
    flexDirection: 'row',
  },
  weekColumn: {
    marginRight: 2,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginBottom: 2,
  },
  emptyCell: {
    width: 12,
    height: 12,
    marginBottom: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
