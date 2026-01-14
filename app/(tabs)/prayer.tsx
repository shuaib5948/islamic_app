import { ContributionGraph } from '@/components/ContributionGraph';
import {
    DailyPrayers,
    PRAYERS,
    PrayerName,
    PrayerStats,
    PrayerStatus,
    STATUS_CONFIG,
    createEmptyDailyPrayers,
    formatDateKey,
    getPrayerInfo,
} from '@/data/prayer-tracker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    calculateStats,
    getContributionData,
    getPrayersForDate,
    updatePrayerStatus,
} from '@/utils/prayer-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PrayerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const today = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [dailyPrayers, setDailyPrayers] = useState<DailyPrayers>(createEmptyDailyPrayers(today));
  const [stats, setStats] = useState<PrayerStats | null>(null);
  const [contributionData, setContributionData] = useState<Record<string, DailyPrayers>>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const prayers = await getPrayersForDate(selectedDate);
    setDailyPrayers(prayers);

    const calculatedStats = await calculateStats(30);
    setStats(calculatedStats);

    const graphData = await getContributionData(12);
    setContributionData(graphData);
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handlePrayerUpdate = async (prayer: PrayerName, status: PrayerStatus) => {
    await updatePrayerStatus(selectedDate, prayer, status);
    await loadData();
  };

  // Calculate today's progress
  const statuses = Object.values(dailyPrayers.prayers);
  const prayedCount = statuses.filter(s => s === 'prayed').length;
  const lateCount = statuses.filter(s => s === 'late').length;
  const qazaCount = statuses.filter(s => s === 'qaza').length;
  const missedCount = statuses.filter(s => s === 'missed').length;
  const completionPercentage = Math.round(((prayedCount + lateCount) / 5) * 100);

  // Get last 7 days for quick selection
  const getRecentDates = () => {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(formatDateKey(date));
    }
    return dates;
  };

  const recentDates = getRecentDates();

  const dateObj = new Date(selectedDate);
  const isToday = selectedDate === today;
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const isFriday = dateObj.getDay() === 5;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: isDark ? '#8B949E' : '#64748B' }]}>
                {getGreeting()} 👋
              </Text>
              <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Prayer Tracker
              </Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={[styles.streakText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {stats?.currentStreak || 0}
              </Text>
              <Text style={[styles.streakLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                day streak
              </Text>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScrollView}
          contentContainerStyle={styles.dateScrollContent}
        >
          {recentDates.map((date) => {
            const d = new Date(date);
            const dayNum = d.getDate();
            const day = d.toLocaleDateString('en-US', { weekday: 'short' });
            const isSelected = date === selectedDate;
            const isTodayDate = date === today;

            return (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: isSelected
                      ? '#10B981'
                      : isDark
                      ? '#1C2128'
                      : '#FFFFFF',
                  },
                  isTodayDate && !isSelected && styles.todayChipBorder,
                ]}
              >
                <Text
                  style={[
                    styles.dateChipDay,
                    { color: isSelected ? 'rgba(255,255,255,0.8)' : isDark ? '#8B949E' : '#64748B' },
                  ]}
                >
                  {day}
                </Text>
                <Text
                  style={[
                    styles.dateChipNum,
                    { color: isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {dayNum}
                </Text>
                {isTodayDate && (
                  <View style={[styles.todayDot, { backgroundColor: isSelected ? '#FFFFFF' : '#10B981' }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressDate, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {dayName} {isFriday && '🕌'}
              </Text>
              <Text style={[styles.progressDateFull, { color: isDark ? '#8B949E' : '#64748B' }]}>
                {dateStr}
              </Text>
            </View>
            {!isToday && (
              <TouchableOpacity
                onPress={() => setSelectedDate(today)}
                style={styles.goTodayBtn}
              >
                <Text style={styles.goTodayText}>Today →</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Circular Progress */}
          <View style={styles.circularProgressContainer}>
            <View style={[styles.circularOuter, { borderColor: isDark ? '#30363D' : '#E2E8F0' }]}>
              <View
                style={[
                  styles.circularProgress,
                  {
                    backgroundColor: completionPercentage >= 80 ? '#10B981' :
                                    completionPercentage >= 60 ? '#F59E0B' :
                                    completionPercentage >= 40 ? '#EF4444' : isDark ? '#30363D' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.progressPercentage, { color: '#FFFFFF' }]}>
                  {completionPercentage}%
                </Text>
                <Text style={[styles.progressLabel, { color: 'rgba(255,255,255,0.8)' }]}>
                  Complete
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{prayedCount}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>On Time</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{lateCount}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>Late</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{qazaCount}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>Qaza</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{missedCount}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>Missed</Text>
            </View>
          </View>
        </View>

        {/* Prayer List */}
        <View style={styles.prayerSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Daily Prayers
          </Text>

          {PRAYERS.map((prayer) => {
            const info = getPrayerInfo(prayer.name);
            const status = dailyPrayers.prayers[prayer.name];

            return (
              <View
                key={prayer.name}
                style={[styles.prayerCard, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}
              >
                <View style={styles.prayerInfo}>
                  <View style={[styles.prayerIconContainer, {
                    backgroundColor: status === 'prayed' ? 'rgba(16, 185, 129, 0.15)' :
                                    status === 'late' ? 'rgba(245, 158, 11, 0.15)' :
                                    status === 'qaza' ? 'rgba(139, 92, 246, 0.15)' :
                                    status === 'missed' ? 'rgba(239, 68, 68, 0.15)' :
                                    isDark ? '#30363D' : '#F1F5F9',
                  }]}>
                    <Text style={styles.prayerIcon}>{info?.icon}</Text>
                  </View>
                  <View>
                    <Text style={[styles.prayerName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {info?.label}
                    </Text>
                    <Text style={[styles.prayerArabic, { color: isDark ? '#8B949E' : '#64748B' }]}>
                      {info?.arabic}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusButtons}>
                  {(['prayed', 'late', 'qaza', 'missed'] as PrayerStatus[]).map((s) => {
                    const config = STATUS_CONFIG[s];
                    const isSelected = status === s;

                    return (
                      <TouchableOpacity
                        key={s}
                        onPress={() => handlePrayerUpdate(prayer.name, s)}
                        style={[
                          styles.statusBtn,
                          {
                            backgroundColor: isSelected ? config.color : 'transparent',
                            borderColor: config.color,
                            borderWidth: isSelected ? 0 : 1.5,
                          },
                        ]}
                      >
                        <Text style={[styles.statusBtnIcon, { opacity: isSelected ? 1 : 0.7 }]}>
                          {config.icon}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Status Legend */}
        <View style={[styles.legendCard, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
          <View style={styles.legendRow}>
            {(['prayed', 'late', 'qaza', 'missed'] as PrayerStatus[]).map((s) => {
              const config = STATUS_CONFIG[s];
              return (
                <View key={s} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: config.color }]} />
                  <Text style={[styles.legendText, { color: isDark ? '#8B949E' : '#64748B' }]}>
                    {config.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Contribution Graph */}
        <ContributionGraph data={contributionData} weeks={12} />

        {/* Overall Stats */}
        {stats && (
          <View style={[styles.overallStatsCard, { backgroundColor: isDark ? '#1C2128' : '#FFFFFF' }]}>
            <Text style={[styles.overallTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              📊 30-Day Overview
            </Text>

            <View style={styles.overallGrid}>
              <View style={styles.overallItem}>
                <Text style={[styles.overallValue, { color: '#10B981' }]}>
                  {stats.totalPrayed}
                </Text>
                <Text style={[styles.overallLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  On Time
                </Text>
              </View>
              <View style={styles.overallItem}>
                <Text style={[styles.overallValue, { color: '#F59E0B' }]}>
                  {stats.totalLate}
                </Text>
                <Text style={[styles.overallLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  Late
                </Text>
              </View>
              <View style={styles.overallItem}>
                <Text style={[styles.overallValue, { color: '#8B5CF6' }]}>
                  {stats.totalQaza}
                </Text>
                <Text style={[styles.overallLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  Qaza
                </Text>
              </View>
              <View style={styles.overallItem}>
                <Text style={[styles.overallValue, { color: '#EF4444' }]}>
                  {stats.totalMissed}
                </Text>
                <Text style={[styles.overallLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  Missed
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#30363D' : '#E2E8F0' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${stats.consistencyPercentage}%`,
                      backgroundColor: stats.consistencyPercentage >= 80 ? '#10B981' :
                                      stats.consistencyPercentage >= 60 ? '#F59E0B' : '#EF4444',
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressBarText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {stats.consistencyPercentage}% Consistency
              </Text>
            </View>

            {/* Streaks */}
            <View style={styles.streaksContainer}>
              <View style={[styles.streakCard, { backgroundColor: isDark ? '#30363D' : '#F8FAFC' }]}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={[styles.streakValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {stats.currentStreak}
                </Text>
                <Text style={[styles.streakCardLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  Current Streak
                </Text>
              </View>
              <View style={[styles.streakCard, { backgroundColor: isDark ? '#30363D' : '#F8FAFC' }]}>
                <Text style={styles.streakEmoji}>🏆</Text>
                <Text style={[styles.streakValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {stats.longestStreak}
                </Text>
                <Text style={[styles.streakCardLabel, { color: isDark ? '#8B949E' : '#64748B' }]}>
                  Longest Streak
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Motivation Card */}
        <View style={[styles.motivationCard, { backgroundColor: '#10B981' }]}>
          <Text style={styles.motivationIcon}>💡</Text>
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>Daily Reminder</Text>
            <Text style={styles.motivationText}>
              "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer."
            </Text>
            <Text style={styles.motivationSource}>— Prophet Muhammad ﷺ</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  streakBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  streakIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  streakText: {
    fontSize: 24,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  dateScrollView: {
    marginTop: 16,
  },
  dateScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dateChip: {
    width: 52,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  todayChipBorder: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  dateChipDay: {
    fontSize: 11,
    fontWeight: '500',
  },
  dateChipNum: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  progressCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressDate: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressDateFull: {
    fontSize: 13,
    marginTop: 2,
  },
  goTodayBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goTodayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  circularProgressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgress: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  prayerSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prayerIcon: {
    fontSize: 22,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  prayerArabic: {
    fontSize: 13,
    marginTop: 2,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBtnIcon: {
    fontSize: 14,
  },
  legendCard: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  overallStatsCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  overallGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overallItem: {
    alignItems: 'center',
    flex: 1,
  },
  overallValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  overallLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressBarText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  streaksContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  streakCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  streakCardLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  motivationCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
  },
  motivationIcon: {
    fontSize: 28,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  motivationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  motivationSource: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 8,
  },
});
