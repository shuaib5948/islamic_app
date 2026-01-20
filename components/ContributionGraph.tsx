import {
    DailyPrayers,
    getContributionColor,
    getContributionLevel,
    getLastNDays,
} from '@/data/prayer-tracker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ContributionGraphProps {
  data: Record<string, DailyPrayers>;
  weeks?: number;
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ data, weeks = 12 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const days = weeks * 7;
  const dates = useMemo(() => getLastNDays(days), [days]);

  // Calculate cell size based on screen width - fit perfectly inside container
  const CONTAINER_PADDING = 32; // 16 padding on container
  const CARD_MARGIN = 32; // 16 margin on each side
  const DAY_LABEL_WIDTH = 20;
  const GRID_GAP = 2;
  const TOTAL_GAPS = weeks - 1;
  
  const containerWidth = SCREEN_WIDTH - CARD_MARGIN - CONTAINER_PADDING;
  const gridWidth = containerWidth - DAY_LABEL_WIDTH - 4;
  const cellSize = Math.floor((gridWidth - (TOTAL_GAPS * GRID_GAP)) / weeks);
  const actualGridWidth = (cellSize * weeks) + (TOTAL_GAPS * GRID_GAP);

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

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get month labels with positions
  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeksData.forEach((week, weekIndex) => {
      for (const dateStr of week) {
        if (dateStr) {
          const date = new Date(dateStr);
          const month = date.getMonth();
          if (month !== lastMonth) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            labels.push({ label: monthNames[month], weekIndex });
            lastMonth = month;
          }
          break;
        }
      }
    });

    return labels;
  }, [weeksData]);

  const cellGap = 2;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          📈 Prayer Consistency
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#8B949E' : '#64748B' }]}>
          Last {weeks} weeks
        </Text>
      </View>

      {/* Month Labels */}
      <View style={[styles.monthLabelsRow, { marginLeft: DAY_LABEL_WIDTH + 4 }]}>
        {monthLabels.map((item, index) => (
          <Text
            key={index}
            style={[
              styles.monthLabel,
              { 
                color: isDark ? '#8B949E' : '#64748B',
                position: 'absolute',
                left: item.weekIndex * (cellSize + cellGap),
              }
            ]}
          >
            {item.label}
          </Text>
        ))}
      </View>

      <View style={styles.graphContent}>
        {/* Day labels */}
        <View style={[styles.dayLabelsContainer, { width: DAY_LABEL_WIDTH }]}>
          {dayLabels.map((day, index) => (
            <View key={index} style={{ height: cellSize + cellGap, justifyContent: 'center' }}>
              <Text
                style={[
                  styles.dayLabel,
                  { color: isDark ? '#8B949E' : '#64748B' },
                ]}
              >
                {index % 2 === 1 ? day : ''}
              </Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={[styles.grid, { width: actualGridWidth }]}>
          {weeksData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekColumn}>
              {week.map((dateStr, dayIndex) => {
                if (!dateStr) {
                  return (
                    <View 
                      key={dayIndex} 
                      style={{ width: cellSize, height: cellSize, marginBottom: cellGap, marginRight: weekIndex < weeksData.length - 1 ? cellGap : 0 }} 
                    />
                  );
                }

                const dailyPrayers = data[dateStr];
                const level = dailyPrayers ? getContributionLevel(dailyPrayers) : 0;
                const color = getContributionColor(level, isDark);

                return (
                  <View
                    key={dateStr}
                    style={[
                      styles.cell, 
                      { 
                        backgroundColor: color, 
                        width: cellSize, 
                        height: cellSize,
                        marginBottom: cellGap,
                        marginRight: weekIndex < weeksData.length - 1 ? cellGap : 0,
                      }
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

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
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  headerRow: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  monthLabelsRow: {
    height: 16,
    position: 'relative',
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  graphContent: {
    flexDirection: 'row',
  },
  dayLabelsContainer: {
    marginRight: 4,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
  },
  weekColumn: {},
  cell: {
    borderRadius: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 3,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
