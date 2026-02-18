import { ContributionGraph } from '@/components/ContributionGraph';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    DailyPrayers,
    PRAYERS,
    PrayerName,
    PrayerStats,
    PrayerStatus,
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
import {
    PrayerTimes,
    PrayerTimesData,
    formatTimeDisplay,
    getDefaultPrayerTimes,
    getNextPrayerInfo,
    getPrayerTimes,
} from '@/utils/prayer-times';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prayer icon mapping (using Ionicons)
const PRAYER_ICONS: Record<PrayerName, string> = {
  fajr: 'sunny-outline',
  dhuhr: 'sunny',
  asr: 'partly-sunny-outline',
  maghrib: 'cloudy-night-outline',
  isha: 'moon-outline',
};

// Helper: get current prayer index (last whose time has started)
const getCurrentPrayerIndex = (prayerTimes: PrayerTimes, now: Date) => {
  const prayerOrder: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let lastIdx = -1;
  for (let i = 0; i < prayerOrder.length; i++) {
    const prayer = prayerOrder[i];
    const [h, m] = prayerTimes[prayer].split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(h, m, 0, 0);
    if (now >= prayerTime) {
      lastIdx = i;
    }
  }
  return lastIdx;
};

export default function PrayerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  // Labels with Malayalam translations
  const labels = {
    prayerTracker: isMalayalam ? 'നമസ്കാര ട്രാക്കർ' : 'Prayer Tracker',
    buildConsistency: isMalayalam ? 'സ്ഥിരത വളർത്തുക' : 'Build Consistency in Salah',
    nextPrayer: isMalayalam ? 'അടുത്ത നമസ്കാരം' : 'Next Prayer',
    timeLeft: isMalayalam ? 'സമയം ബാക്കി' : 'time left',
    todayProgress: isMalayalam ? 'ഇന്നത്തെ പുരോഗതി' : "Today's Progress",
    prayersCompleted: isMalayalam ? 'നമസ്കാരങ്ങൾ പൂർത്തിയായി' : 'prayers completed',
    markPrayer: isMalayalam ? 'നമസ്കാരം രേഖപ്പെടുത്തുക' : 'Mark Prayer',
    onTime: isMalayalam ? 'സമയത്ത് (അദാ)' : 'On-time (Adaah)',
    late: isMalayalam ? 'വൈകി (ഖളാ)' : 'Late (Qada)',
    howCompleted: isMalayalam ? 'എങ്ങനെ പൂർത്തിയാക്കി?' : 'How was it completed?',
    cancel: isMalayalam ? 'റദ്ദാക്കുക' : 'Cancel',
    dayStreak: isMalayalam ? 'ദിവസ സ്ട്രീക്ക്' : 'Day Streak',
    consistency: isMalayalam ? 'സ്ഥിരത' : 'Consistency',
    thisMonth: isMalayalam ? 'ഈ മാസം' : 'This Month',
    allPrayersComplete: isMalayalam ? 'എല്ലാ നമസ്കാരങ്ങളും പൂർത്തിയായി! 🎉' : 'All prayers complete! 🎉',
    keepGoing: isMalayalam ? 'തുടരുക!' : 'Keep going!',
    loadingLocation: isMalayalam ? 'സ്ഥാനം കണ്ടെത്തുന്നു...' : 'Getting location...',
  };

  const today = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [dailyPrayers, setDailyPrayers] = useState<DailyPrayers>(createEmptyDailyPrayers(today));
  const [stats, setStats] = useState<PrayerStats | null>(null);
  const [contributionData, setContributionData] = useState<Record<string, DailyPrayers>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerName | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Prayer times state
  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(true);

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load prayer times based on location
  const loadPrayerTimes = useCallback(async (forceRefresh = false) => {
    setLoadingPrayerTimes(true);
    try {
      const data = await getPrayerTimes(3, forceRefresh); // Method 3 = Muslim World League
      setPrayerTimesData(data);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setLoadingPrayerTimes(false);
    }
  }, []);

  // Get current prayer times (from API or fallback)
  const prayerTimes: PrayerTimes = useMemo(() => {
    return prayerTimesData?.times || getDefaultPrayerTimes();
  }, [prayerTimesData]);

  const currentPrayerIdx = useMemo(() => getCurrentPrayerIndex(prayerTimes, currentTime), [prayerTimes, currentTime]);

  const loadData = useCallback(async () => {
    const prayers = await getPrayersForDate(selectedDate);
    setDailyPrayers(prayers);

    const calculatedStats = await calculateStats(30);
    setStats(calculatedStats);

    const graphData = await getContributionData(12);
    setContributionData(graphData);
  }, [selectedDate]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadPrayerTimes(true)]);
    setRefreshing(false);
  }, [loadData, loadPrayerTimes]);

  const handlePrayerTap = (prayer: PrayerName) => {
    const currentStatus = dailyPrayers.prayers[prayer];
    if (currentStatus === 'not_tracked') {
      setSelectedPrayer(prayer);
      setShowStatusModal(true);
    } else {
      // Toggle off if already marked
      handlePrayerUpdate(prayer, 'not_tracked');
    }
  };

  const handlePrayerUpdate = async (prayer: PrayerName, status: PrayerStatus) => {
    await updatePrayerStatus(selectedDate, prayer, status);
    await loadData();
    setShowStatusModal(false);
    setSelectedPrayer(null);
  };

  // Calculate today's progress
  const statuses = Object.values(dailyPrayers.prayers);
  const completedCount = statuses.filter(s => s === 'prayed' || s === 'late').length;
  const onTimeCount = statuses.filter(s => s === 'prayed').length;
  const lateCount = statuses.filter(s => s === 'late').length;

  // Get next prayer using location-based times
  const getNextPrayer = useMemo(() => {
    const nextPrayer = getNextPrayerInfo(prayerTimes, currentTime);
    return {
      name: nextPrayer.name as PrayerName,
      info: getPrayerInfo(nextPrayer.name as PrayerName),
      timeLeft: nextPrayer.timeLeft,
      timeString: formatTimeDisplay(nextPrayer.time),
    };
  }, [currentTime, prayerTimes]);

  const isToday = selectedDate === today;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {labels.prayerTracker}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {stats && (
                <View style={styles.streakContainer}>
                  <Ionicons name="flame" size={20} color="#F59E0B" />
                  <Text style={[styles.streakText, { color: colors.text }]}>
                    {stats.currentStreak}
                  </Text>
                </View>
              )}
              <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notificationsButton}>
                <Ionicons name="notifications-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Location indicator */}
          <View style={[styles.locationContainer, { backgroundColor: colors.card }]}>
            {loadingPrayerTimes ? (
              <View style={styles.locationRow}>
                <ActivityIndicator size="small" color={colors.secondary} />
                <Text style={[styles.locationText, { color: colors.secondary }]}>
                  {labels.loadingLocation}
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.locationRow} onPress={() => loadPrayerTimes(true)}>
                <Ionicons name="location-outline" size={16} color={colors.secondary} />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {prayerTimesData?.location?.city || 'Unknown Location'}{prayerTimesData?.location?.country ? `, ${prayerTimesData.location.country}` : ''}
                </Text>
                <Ionicons name="refresh-outline" size={14} color={colors.secondary} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Combined Card: Next Prayer + Today's Goal */}
        <View style={[styles.combinedCard, { backgroundColor: colors.primary }]}>
          {/* Left: Next Prayer */}
          <View style={styles.combinedLeft}>
            <Text style={[styles.combinedLabel, { color: colors.hadithText }]}>
              {labels.nextPrayer}
            </Text>
            {loadingPrayerTimes ? (
              <ActivityIndicator size="small" color={colors.hadithText} style={{ marginVertical: 10 }} />
            ) : (
              <>
                <View style={styles.nextPrayerNameRow}>
                  <Ionicons 
                    name={PRAYER_ICONS[getNextPrayer.name] as any} 
                    size={20} 
                    color={colors.hadithText} 
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.combinedPrayerName, { color: colors.hadithText }]}>
                    {getNextPrayer.info?.label}
                  </Text>
                </View>
                <Text style={[styles.combinedCountdown, { color: colors.accent }]}>
                  {getNextPrayer.timeLeft}
                </Text>
                <Text style={[styles.combinedTime, { color: colors.hadithText }]}>
                  at {getNextPrayer.timeString}
                </Text>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.combinedDivider, { backgroundColor: colors.hadithText }]} />

          {/* Right: Today's Goal */}
          <View style={styles.combinedRight}>
            <Text style={[styles.combinedLabel, { color: colors.hadithText }]}>
              {labels.todayProgress}
            </Text>
            <View style={[
              styles.goalCircle,
              { 
                borderColor: completedCount === 5 ? colors.accent : colors.hadithText,
                backgroundColor: completedCount === 5 ? 'rgba(232, 226, 216, 0.3)' : 'transparent'
              }
            ]}>
              <Text style={[styles.goalCount, { color: completedCount === 5 ? colors.accent : colors.hadithText }]}>
                {completedCount}/5
              </Text>
            </View>
            {completedCount === 5 ? (
              <Text style={[styles.goalCompleteText, { color: colors.accent }]}>🎉 Done!</Text>
            ) : (
              <View style={styles.goalMiniStats}>
                <Text style={[styles.goalMiniStat, { color: colors.accent }]}>✓{onTimeCount}</Text>
                <Text style={[styles.goalMiniStat, { color: colors.accent }]}>⏱{lateCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Date Navigator - Single Line */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity
            onPress={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(formatDateKey(d));
            }}
            style={styles.dateArrowBtn}
          >
            <Text style={[styles.dateArrow, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSelectedDate(today)}
            style={styles.dateDisplay}
          >
            <Text style={[styles.dateText, { color: colors.text }]}>
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {isToday && <Text style={styles.todayBadge}> • Today</Text>}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              if (d <= new Date()) {
                setSelectedDate(formatDateKey(d));
              }
            }}
            style={[styles.dateArrowBtn, new Date(selectedDate) >= new Date(today) && styles.dateArrowDisabled]}
            disabled={new Date(selectedDate) >= new Date(today)}
          >
            <Text style={[styles.dateArrow, { color: new Date(selectedDate) >= new Date(today) ? colors.secondary : colors.text }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Prayer List - Clean Card Design */}
        <View style={styles.prayerSection}>
          {PRAYERS.map((prayer, idx) => {
            const info = getPrayerInfo(prayer.name);
            const status = dailyPrayers.prayers[prayer.name];
            const isCompleted = status === 'prayed' || status === 'late';
            const isLate = status === 'late';
            const time = prayerTimes[prayer.name];
            // Determine if prayer can be marked
            const isFutureDate = selectedDate > today;
            const isToday = selectedDate === today;
            const isFuturePrayer = isToday && idx > currentPrayerIdx;
            const canMark = !isFutureDate && (!isToday || !isFuturePrayer);
            return (
              <TouchableOpacity
                key={prayer.name}
                onPress={() => canMark && handlePrayerTap(prayer.name)}
                activeOpacity={canMark ? 0.7 : 1}
                disabled={!canMark}
                style={[
                  styles.prayerCard,
                  { 
                    backgroundColor: isLate 
                      ? (isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)')
                      : colors.card
                  },
                  isCompleted && (isLate ? styles.prayerCardLate : styles.prayerCardCompleted),
                  !canMark && { opacity: 0.5 },
                ]}
              >
                <View style={styles.prayerLeft}>
                  <View style={[
                    styles.prayerIconContainer,
                    {
                      backgroundColor: isCompleted
                        ? status === 'prayed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.2)'
                        : colors.secondary + '20', // Add transparency to secondary color
                    }
                  ]}>
                    <Ionicons 
                      name={PRAYER_ICONS[prayer.name] as any} 
                      size={22} 
                      color={isCompleted 
                        ? status === 'prayed' ? '#10B981' : '#F59E0B'
                        : colors.secondary
                      } 
                    />
                  </View>
                  <View>
                    <View style={styles.prayerNameRow}>
                      <Text style={[styles.prayerName, { color: isLate ? '#F59E0B' : colors.text }]}>
                        {info?.label}
                      </Text>
                      <Text style={[styles.prayerTime, { color: isLate ? '#D97706' : colors.secondary }]}>
                        {formatTimeDisplay(time)}
                      </Text>
                    </View>
                    <Text style={[styles.prayerArabic, { color: isLate ? '#D97706' : colors.secondary }]}>
                      {info?.arabic}
                    </Text>
                  </View>
                </View>

                <View style={styles.prayerRight}>
                  {isCompleted ? (
                    <View style={[
                      styles.completedBadge,
                      { backgroundColor: status === 'prayed' ? '#10B981' : '#F59E0B' }
                    ]}>
                      <Ionicons 
                        name={status === 'prayed' ? 'checkmark' : 'time-outline'} 
                        size={12} 
                        color="#FFFFFF" 
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.completedBadgeText}>
                        {status === 'prayed' ? 'On-time' : 'Late'}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.markButton, { borderColor: colors.secondary + '40' }]}>
                      <Text style={[styles.markButtonText, { color: colors.secondary }]}>
                        Tap to mark
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Consistency Calendar */}
        <ContributionGraph data={contributionData} weeks={12} />

        {/* Stats Summary */}
        {stats && (
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statsTitleRow}>
              <Ionicons name="stats-chart" size={18} color={colors.text} style={{ marginRight: 8 }} />
              <Text style={[styles.statsTitle, { color: colors.text }]}>
                30-Day Summary
              </Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: '#10B981' }]}>{stats.totalPrayed}</Text>
                <Text style={[styles.statsLabel, { color: colors.secondary }]}>On-time</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: '#F59E0B' }]}>{stats.totalLate}</Text>
                <Text style={[styles.statsLabel, { color: colors.secondary }]}>Late</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: colors.text }]}>{stats.consistencyPercentage}%</Text>
                <Text style={[styles.statsLabel, { color: colors.secondary }]}>Consistency</Text>
              </View>
            </View>

            {/* Streak Cards */}
            <View style={styles.streakCardsRow}>
              <View style={[styles.streakCard, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="flame" size={20} color="#F59E0B" />
                <Text style={[styles.streakCardValue, { color: colors.text }]}>
                  {stats.currentStreak}
                </Text>
                <Text style={[styles.streakCardLabel, { color: colors.secondary }]}>
                  Current
                </Text>
              </View>
              <View style={[styles.streakCard, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="trophy" size={20} color="#10B981" />
                <Text style={[styles.streakCardValue, { color: colors.text }]}>
                  {stats.longestStreak}
                </Text>
                <Text style={[styles.streakCardLabel, { color: colors.secondary }]}>
                  Best
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Motivation Quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.card }]}>
          <Ionicons name="bulb-outline" size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
          <Text style={[styles.quoteText, { color: colors.text }]}>
            &quot;The first matter the slave will be brought to account for is prayer.&quot;
          </Text>
          <Text style={[styles.quoteSource, { color: colors.secondary }]}>
            — Prophet Muhammad ﷺ
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Status Selection Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.accent }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {labels.markPrayer}
            </Text>
            {selectedPrayer && (
              <View style={styles.modalPrayerInfo}>
                <Ionicons 
                  name={PRAYER_ICONS[selectedPrayer] as any} 
                  size={28} 
                  color={colors.text} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.modalPrayerName, { color: colors.text }]}>
                  {getPrayerInfo(selectedPrayer)?.label}
                </Text>
              </View>
            )}
            <Text style={[styles.modalSubtitle, { color: colors.secondary }]}>
              {labels.howCompleted}
            </Text>

            <TouchableOpacity
              style={[styles.statusOption, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }]}
              onPress={() => selectedPrayer && handlePrayerUpdate(selectedPrayer, 'prayed')}
            >
              <Ionicons name="checkmark-circle" size={28} color="#10B981" style={{ marginRight: 14 }} />
              <View>
                <Text style={[styles.statusOptionTitle, { color: '#10B981' }]}>{labels.onTime}</Text>
                <Text style={[styles.statusOptionDesc, { color: colors.secondary }]}>
                  Prayed within the designated time
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusOption, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }]}
              onPress={() => selectedPrayer && handlePrayerUpdate(selectedPrayer, 'late')}
            >
              <Ionicons name="time" size={28} color="#F59E0B" style={{ marginRight: 14 }} />
              <View>
                <Text style={[styles.statusOptionTitle, { color: '#F59E0B' }]}>{labels.late}</Text>
                <Text style={[styles.statusOptionDesc, { color: colors.secondary }]}>
                  Made up after the time passed
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.secondary + '20' }]}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                {labels.cancel}
              </Text>
            </TouchableOpacity>
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
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  notificationsButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Location Container
  locationContainer: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  // Combined Card (Next Prayer + Today's Goal)
  combinedCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  combinedLeft: {
    flex: 1,
  },
  combinedLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nextPrayerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPrayerIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  combinedPrayerName: {
    fontSize: 20,
    fontWeight: '800',
  },
  combinedCountdown: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  combinedTime: {
    fontSize: 12,
    marginTop: 2,
  },
  combinedDivider: {
    width: 1,
    height: 80,
    marginHorizontal: 16,
  },
  combinedRight: {
    alignItems: 'center',
    minWidth: 90,
  },
  goalCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    maxWidth: 80,
  },
  goalCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  goalCompleteText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 6,
  },
  goalMiniStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  goalMiniStat: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Date Navigator
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  dateArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateArrowDisabled: {
    opacity: 0.3,
  },
  dateArrow: {
    fontSize: 22,
    fontWeight: '600',
  },
  dateDisplay: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayBadge: {
    color: '#10B981',
    fontWeight: '700',
  },
  // Prayer Section
  prayerSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  prayerCardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  prayerCardLate: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  prayerLeft: {
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
  prayerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  prayerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerArabic: {
    fontSize: 12,
    marginTop: 2,
  },
  prayerRight: {},
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  markButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  markButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Stats Card
  statsCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  statsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  streakCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  streakCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  streakCardValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  streakCardLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  // Quote Card
  quoteCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quoteSource: {
    fontSize: 12,
    marginTop: 8,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalPrayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalPrayerIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  modalPrayerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 12,
  },
  statusOptionIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  statusOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
