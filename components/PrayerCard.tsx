import {
    DailyPrayers,
    PRAYERS,
    PrayerName,
    PrayerStatus,
    STATUS_CONFIG,
    getPrayerInfo,
} from '@/data/prayer-tracker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PrayerCardProps {
  prayer: PrayerName;
  status: PrayerStatus;
  onStatusChange: (status: PrayerStatus) => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, status, onStatusChange }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const prayerInfo = getPrayerInfo(prayer);

  const statusOptions: PrayerStatus[] = ['prayed', 'late', 'qaza', 'missed'];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.prayerInfo}>
        <Text style={styles.icon}>{prayerInfo?.icon}</Text>
        <View>
          <Text style={[styles.prayerName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {prayerInfo?.label}
          </Text>
          <Text style={[styles.prayerArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            {prayerInfo?.arabic}
          </Text>
        </View>
      </View>

      <View style={styles.statusButtons}>
        {statusOptions.map((s) => {
          const config = STATUS_CONFIG[s];
          const isSelected = status === s;
          
          return (
            <TouchableOpacity
              key={s}
              onPress={() => onStatusChange(s)}
              style={[
                styles.statusButton,
                { 
                  backgroundColor: isSelected ? config.color : isDark ? '#2A2A2A' : '#F5F5F5',
                  borderColor: config.color,
                  borderWidth: isSelected ? 0 : 1,
                },
              ]}
            >
              <Text style={[
                styles.statusIcon,
                { opacity: isSelected ? 1 : 0.6 }
              ]}>
                {config.icon}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

interface DailyPrayerTrackerProps {
  date: string;
  dailyPrayers: DailyPrayers;
  onPrayerUpdate: (prayer: PrayerName, status: PrayerStatus) => void;
}

export const DailyPrayerTracker: React.FC<DailyPrayerTrackerProps> = ({
  date,
  dailyPrayers,
  onPrayerUpdate,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isFriday = dateObj.getDay() === 5;

  // Calculate completion for the day
  const statuses = Object.values(dailyPrayers.prayers);
  const prayedCount = statuses.filter(s => s === 'prayed' || s === 'late').length;

  return (
    <View style={styles.trackerContainer}>
      {/* Date Header */}
      <View style={[styles.dateHeader, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
        <View>
          <Text style={[styles.dayName, { color: isDark ? '#FFFFFF' : '#1B5E20' }, isFriday && styles.fridayText]}>
            {dayName} {isFriday && '🕌'}
          </Text>
          <Text style={[styles.dateStr, { color: isDark ? 'rgba(255,255,255,0.8)' : '#2E7D32' }]}>
            {dateStr}
          </Text>
        </View>
        <View style={styles.completionBadge}>
          <Text style={[styles.completionText, { color: isDark ? '#FFFFFF' : '#1B5E20' }]}>
            {prayedCount}/5
          </Text>
          <Text style={[styles.completionLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#4CAF50' }]}>
            Prayed
          </Text>
        </View>
      </View>

      {/* Prayer Cards */}
      {PRAYERS.map((prayer) => (
        <PrayerCard
          key={prayer.name}
          prayer={prayer.name}
          status={dailyPrayers.prayers[prayer.name]}
          onStatusChange={(status) => onPrayerUpdate(prayer.name, status)}
        />
      ))}

      {/* Status Legend */}
      <View style={[styles.legendContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.legendTitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
          Status Legend:
        </Text>
        <View style={styles.legendItems}>
          {(['prayed', 'late', 'qaza', 'missed'] as PrayerStatus[]).map((s) => {
            const config = STATUS_CONFIG[s];
            return (
              <View key={s} style={styles.legendItem}>
                <Text style={styles.legendIcon}>{config.icon}</Text>
                <Text style={[styles.legendLabel, { color: isDark ? '#9E9E9E' : '#757575' }]}>
                  {config.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  prayerArabic: {
    fontSize: 14,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
  },
  // Daily Tracker styles
  trackerContainer: {
    marginTop: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
  },
  fridayText: {
    color: '#FFD700',
  },
  dateStr: {
    fontSize: 14,
    marginTop: 2,
  },
  completionBadge: {
    alignItems: 'center',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  completionLabel: {
    fontSize: 11,
  },
  // Legend styles
  legendContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  legendLabel: {
    fontSize: 10,
  },
});
