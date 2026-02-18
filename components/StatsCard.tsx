import { PrayerStats, getMotivationalMessage } from '@/data/prayer-tracker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
  stats: PrayerStats;
  period?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats, period = 'Last 30 days' }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const motivationalMessage = getMotivationalMessage(stats.consistencyPercent);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
        📊 Prayer Statistics
      </Text>
      <Text style={[styles.period, { color: isDark ? '#9E9E9E' : '#757575' }]}>
        {period}
      </Text>

      {/* Consistency Circle */}
      <View style={styles.consistencyContainer}>
        <View style={[styles.consistencyCircle, { borderColor: isDark ? '#2A2A2A' : '#E0E0E0' }]}>
          <View style={[styles.progressCircle, { 
            backgroundColor: stats.consistencyPercent >= 80 ? '#4CAF50' : 
                            stats.consistencyPercent >= 50 ? '#FF9800' : '#F44336'
          }]}>
            <Text style={styles.consistencyPercent}>{stats.consistencyPercent}%</Text>
            <Text style={styles.consistencyLabel}>Consistency</Text>
          </View>
        </View>
      </View>

      {/* Motivational Message */}
      <View style={[styles.messageContainer, { backgroundColor: isDark ? '#263238' : '#F5F5F5' }]}>
        <Text style={[styles.messageText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
          {motivationalMessage}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statItem, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
          <Text style={[styles.statValue, { color: isDark ? '#81C784' : '#2E7D32' }]}>
            {stats.prayedOnTime}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? '#A5D6A7' : '#4CAF50' }]}>
            On Time ✅
          </Text>
        </View>

        <View style={[styles.statItem, { backgroundColor: isDark ? '#E65100' : '#FFF3E0' }]}>
          <Text style={[styles.statValue, { color: isDark ? '#FFB74D' : '#E65100' }]}>
            {stats.prayedLate}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? '#FFCC80' : '#FF9800' }]}>
            Late ⏰
          </Text>
        </View>

        <View style={[styles.statItem, { backgroundColor: isDark ? '#4A148C' : '#F3E5F5' }]}>
          <Text style={[styles.statValue, { color: isDark ? '#CE93D8' : '#7B1FA2' }]}>
            {stats.qaza}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? '#E1BEE7' : '#9C27B0' }]}>
            Qaza 🔄
          </Text>
        </View>

        <View style={[styles.statItem, { backgroundColor: isDark ? '#B71C1C' : '#FFEBEE' }]}>
          <Text style={[styles.statValue, { color: isDark ? '#EF9A9A' : '#C62828' }]}>
            {stats.missed}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? '#FFCDD2' : '#F44336' }]}>
            Missed ❌
          </Text>
        </View>
      </View>

      {/* Streak Info */}
      <View style={styles.streakContainer}>
        <View style={[styles.streakItem, { backgroundColor: isDark ? '#1A237E' : '#E8EAF6' }]}>
          <Text style={[styles.streakValue, { color: isDark ? '#9FA8DA' : '#3F51B5' }]}>
            🔥 {stats.currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: isDark ? '#C5CAE9' : '#5C6BC0' }]}>
            Current Streak
          </Text>
        </View>
        <View style={[styles.streakItem, { backgroundColor: isDark ? '#004D40' : '#E0F2F1' }]}>
          <Text style={[styles.streakValue, { color: isDark ? '#80CBC4' : '#00796B' }]}>
            🏆 {stats.longestStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: isDark ? '#A7FFEB' : '#009688' }]}>
            Best Streak
          </Text>
        </View>
      </View>

      {/* Total Prayers */}
      <Text style={[styles.totalPrayers, { color: isDark ? '#757575' : '#9E9E9E' }]}>
        Total prayers tracked: {stats.totalPrayers}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  period: {
    fontSize: 13,
    marginTop: 4,
  },
  consistencyContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  consistencyCircle: {
    width: '38%',
    maxWidth: 140,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: '83%',
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consistencyPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  consistencyLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  messageContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  streakItem: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  totalPrayers: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  },
});
