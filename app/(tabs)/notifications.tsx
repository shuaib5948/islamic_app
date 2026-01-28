import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { ISLAMIC_EVENTS, IslamicEvent } from '@/data/hijri-events';
import { PrayerName } from '@/data/prayer-tracker';
import { EVENT_NOTIFICATION_TEMPLATES, FRIDAY_NOTIFICATION, ISLAMIC_SPECIAL_DAYS, MONDAY_THURSDAY_NOTIFICATIONS, PRAYER_NOTIFICATIONS, RAMADAN_NOTIFICATIONS, SAMPLE_NOTIFICATIONS } from '@/data/sunnah-notifications';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTodayHijriAsync } from '@/utils/hijri-date';
import { getPrayersForDate } from '@/utils/prayer-storage';
import { getPrayerTimes } from '@/utils/prayer-times';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'event' | 'prayer' | 'reminder';
  hadith?: {
    text: string;
    source: string;
  };
}

// Function to remove emojis and Islamic honorifics from text
const cleanText = (text: string): string => {
  return text
    .replace(/ﷺ/g, '') // Remove Prophet honorific
    .replace(/\(RA\)/g, '') // Remove RadiAllahu Anhu
    .replace(/\(AS\)/g, '') // Remove Alayhis Salam
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
};

// Function to convert 24-hour time to 12-hour format
const formatTime12Hour = (timeString: string): string => {
  // Handle special cases like "Just now", "Today", etc.
  if (!timeString.includes(':')) {
    return timeString;
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    // If parsing fails, return original string
    return timeString;
  }
};

// Function to get time priority for sorting (lower number = more recent)
const getTimePriority = (timeString: string): number => {
  const now = new Date();

  // Handle special cases
  if (timeString === 'Just now') return now.getTime();
  if (timeString === 'Today') return now.getTime() - (1 * 60 * 1000); // 1 minute ago

  // Handle relative times
  if (timeString.includes('day ago')) {
    const days = parseInt(timeString.split(' ')[0]);
    return now.getTime() - (days * 24 * 60 * 60 * 1000);
  }

  if (timeString.includes('hour ago')) {
    const hours = parseInt(timeString.split(' ')[0]);
    return now.getTime() - (hours * 60 * 60 * 1000);
  }

  if (timeString.includes('minute ago')) {
    const minutes = parseInt(timeString.split(' ')[0]);
    return now.getTime() - (minutes * 60 * 1000);
  }

  // Handle time formats (both 12-hour and 24-hour)
  try {
    if (timeString.includes(':')) {
      let hours: number, minutes: number;

      if (timeString.includes('AM') || timeString.includes('PM')) {
        // 12-hour format: "5:30 AM" or "2:30 PM"
        const [time, period] = timeString.split(' ');
        [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
      } else {
        // 24-hour format: "05:30" or "14:30"
        [hours, minutes] = timeString.split(':').map(Number);
      }

      // Create a date for today with the specified time
      const timeDate = new Date(now);
      timeDate.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, it might be from yesterday
      // For sorting purposes, we'll assume times are from today
      return timeDate.getTime();
    }
  } catch {
    // If parsing fails, return a default priority
    return now.getTime() - (24 * 60 * 60 * 1000); // 1 day ago
  }

  // Default fallback
  return now.getTime() - (24 * 60 * 60 * 1000);
};

// Generate event notifications based on current Hijri date
const generateEventNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const currentHijri = await getTodayHijriAsync();
    const notifications: NotificationItem[] = [];

    // Check for events happening today
    ISLAMIC_EVENTS.forEach((event: IslamicEvent) => {
      // Current month events on the current day
      if (event.month === currentHijri.month && event.day === currentHijri.day) {
        // Get the appropriate template based on event type
        const template = EVENT_NOTIFICATION_TEMPLATES[event.type] || EVENT_NOTIFICATION_TEMPLATES.default;

        // Generate message using template
        let message = template.message;
        message = message.replace('{eventTitle}', cleanText(event.title));
        message = message.replace('{eventDescription}', event.description.substring(0, 100) + '...');

        // Special handling for birth events
        if (event.type === 'birth') {
          message = message.replace('{eventTitle}', cleanText(event.title.split(' of ')[1] || event.title));
        }

        notifications.push({
          id: `event-${event.id}`,
          title: cleanText(event.title),
          message,
          time: 'Today',
          read: false,
          type: 'event',
        });
      }
    });

    return notifications;
  } catch (error) {
    console.error('Error generating event notifications:', error);
    return [];
  }
};

// Generate Sunnah fasting notifications based on day of week and Islamic occasions
const generateSunnahNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const notifications: NotificationItem[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHijri = await getTodayHijriAsync();

    // Check for Ramadan (month 9 in Hijri calendar)
    const isRamadan = currentHijri.month === 9;

    // Monday and Thursday - highly recommended for Sunnah fasting
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      const notificationData = dayOfWeek === 1 ? MONDAY_THURSDAY_NOTIFICATIONS[0] : MONDAY_THURSDAY_NOTIFICATIONS[1];
      notifications.push({
        id: notificationData.id,
        title: notificationData.title,
        message: notificationData.message,
        time: 'Today',
        read: false,
        type: 'reminder',
        hadith: notificationData.hadith
      });
    }

    // Friday - Special Friday Sunnah practices
    if (dayOfWeek === 5) {
      notifications.push({
        id: FRIDAY_NOTIFICATION.id,
        title: FRIDAY_NOTIFICATION.title,
        message: FRIDAY_NOTIFICATION.message,
        time: 'Today',
        read: false,
        type: 'reminder',
        hadith: FRIDAY_NOTIFICATION.hadith
      });
    }

    // Ramadan notifications
    if (isRamadan) {
      // General Ramadan notification
      notifications.push({
        id: RAMADAN_NOTIFICATIONS[0].id,
        title: RAMADAN_NOTIFICATIONS[0].title,
        message: RAMADAN_NOTIFICATIONS[0].message,
        time: 'Today',
        read: false,
        type: 'reminder',
        hadith: RAMADAN_NOTIFICATIONS[0].hadith
      });

      // Last 10 nights of Ramadan
      if (currentHijri.day >= 21 && currentHijri.day <= 30) {
        notifications.push({
          id: RAMADAN_NOTIFICATIONS[1].id,
          title: RAMADAN_NOTIFICATIONS[1].title,
          message: RAMADAN_NOTIFICATIONS[1].message,
          time: 'Today',
          read: false,
          type: 'reminder',
          hadith: RAMADAN_NOTIFICATIONS[1].hadith
        });
      }
    }

    // Islamic special days
    ISLAMIC_SPECIAL_DAYS.forEach(specialDay => {
      if (currentHijri.month === specialDay.month && currentHijri.day === specialDay.day) {
        notifications.push({
          id: `sunnah-${specialDay.title.toLowerCase().replace(/\s+/g, '-')}`,
          title: `${specialDay.title} - Sunnah Reminder`,
          message: specialDay.message,
          time: 'Today',
          read: false,
          type: 'reminder',
        });
      }
    });

    return notifications;
  } catch (error) {
    console.error('Error generating Sunnah notifications:', error);
    return [];
  }
};

// Generate prayer notifications based on prayer times and completion status
const generatePrayerNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const notifications: NotificationItem[] = [];
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get today's prayer times
    const prayerTimes = await getPrayerTimes();
    if (!prayerTimes) return notifications;

    // Get today's prayer completion status
    const prayersForToday = await getPrayersForDate(todayString);

    // Prayer names and their display names
    const prayerNames: { [key in PrayerName]: string } = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
    };

    // Check each prayer
    Object.entries(prayerNames).forEach(([prayerKey, prayerDisplayName]) => {
      const prayerName = prayerKey as PrayerName;
      const prayerTime = prayerTimes?.times[prayerName];
      const prayerStatus = prayersForToday?.[prayerName]?.status || 'not_tracked';

      if (prayerTime && (prayerStatus === 'not_tracked' || prayerStatus === 'missed')) {
        // Check if prayer time has passed
        const [hours, minutes] = prayerTime.split(':').map(Number);
        const prayerDateTime = new Date(today);
        prayerDateTime.setHours(hours, minutes, 0, 0);

        if (today > prayerDateTime) {
          // Prayer time has passed and prayer not completed - send reminder
          notifications.push({
            id: `prayer-missed-${prayerName}`,
            title: PRAYER_NOTIFICATIONS.missed.title.replace('{prayerName}', prayerDisplayName),
            message: PRAYER_NOTIFICATIONS.missed.message.replace('{prayerName}', prayerDisplayName),
            time: prayerTime,
            read: false,
            type: 'prayer',
          });
        } else {
          // Prayer time is upcoming - send reminder for prayer time
          const timeUntilPrayer = prayerDateTime.getTime() - today.getTime();
          if (timeUntilPrayer <= 15 * 60 * 1000 && timeUntilPrayer > 0) { // Within 15 minutes
            notifications.push({
              id: `prayer-upcoming-${prayerName}`,
              title: PRAYER_NOTIFICATIONS.upcoming.title.replace('{prayerName}', prayerDisplayName),
              message: PRAYER_NOTIFICATIONS.upcoming.message
                .replace('{prayerName}', prayerDisplayName)
                .replace('{prayerTime}', prayerTime),
              time: prayerTime,
              read: false,
              type: 'prayer',
            });
          }
        }
      } else if (prayerStatus === 'prayed') {
        // Prayer completed - send congratulatory message
        const existingNotification = notifications.find(n => n.id === `prayer-completed-${prayerName}`);
        if (!existingNotification) {
          notifications.push({
            id: `prayer-completed-${prayerName}`,
            title: `${prayerDisplayName} Prayer Completed! ✅`,
            message: `Alhamdulillah! You have completed your ${prayerDisplayName} prayer. May Allah accept it.`,
            time: prayerTime || 'Today',
            read: false,
            type: 'prayer',
          });
        }
      }
    });

    // Check if all prayers are completed
    const allCompleted = Object.values(prayersForToday.prayers).every(status => status === 'prayed' || status === 'late');
    if (allCompleted) {
      notifications.push({
        id: `prayer-all-completed-${todayString}`,
        title: 'All Prayers Completed! 🎉',
        message: 'MashaAllah! You have completed all your daily prayers. May Allah accept your worship.',
        time: 'Today',
        read: false,
        type: 'prayer',
      });
    }

    return notifications;
  } catch (error) {
    console.error('Error generating prayer notifications:', error);
    return [];
  }
};

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hadithModal, setHadithModal] = useState<{
    visible: boolean;
    hadith?: { text: string; source: string };
    title?: string;
  }>({ visible: false });

  const loadNotifications = async () => {
    try {
      const [eventNotifications, prayerNotifications, sunnahNotifications] = await Promise.all([
        generateEventNotifications(),
        generatePrayerNotifications(),
        generateSunnahNotifications(),
      ]);

      // Combine event, prayer, and Sunnah notifications
      const allNotifications = [...eventNotifications, ...prayerNotifications, ...sunnahNotifications];

      // Add sample notification for testing
      allNotifications.push(...SAMPLE_NOTIFICATIONS);

      // Sort by time: most recent first
      allNotifications.sort((a, b) => {
        const timeA = getTimePriority(a.time);
        const timeB = getTimePriority(b.time);
        return timeB - timeA; // Most recent first
      });

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to sample notifications
      setNotifications([
        {
          id: 'fallback-1',
          title: 'Welcome to Islamic App',
          message: 'Stay connected with Islamic events and reminders.',
          time: 'Just now',
          read: false,
          type: 'reminder',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Refresh notifications every 5 minutes to check for prayer time updates
    const interval = setInterval(() => {
      loadNotifications();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={[styles.deleteButton, { backgroundColor: '#C62828' }]}
      onPress={() => deleteNotification(id)}
    >
      <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
      <Text style={styles.deleteText}>
        {isMalayalam ? 'ഇല്ലാതാക്കുക' : 'Delete'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            {isMalayalam ? 'അറിയിപ്പുകൾ' : 'Notifications'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="hourglass-outline" size={64} color={isDark ? Colors.dark.secondary : Colors.light.secondary} />
              <Text style={[styles.emptyText, { color: isDark ? Colors.dark.secondary : Colors.light.secondary }]}>
                {isMalayalam ? 'ലോഡിംഗ്...' : 'Loading...'}
              </Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color={isDark ? Colors.dark.secondary : Colors.light.secondary} />
              <Text style={[styles.emptyText, { color: isDark ? Colors.dark.secondary : Colors.light.secondary }]}>
                {isMalayalam ? 'അറിയിപ്പുകളൊന്നുമില്ല' : 'No notifications yet'}
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <Swipeable
                  key={notification.id}
                  renderRightActions={() => renderRightActions(notification.id)}
                  rightThreshold={40}
                >
                  <TouchableOpacity
                    style={[
                      styles.notificationItem,
                      {
                        backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
                        borderColor: isDark ? Colors.dark.accent : Colors.light.accent,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      // Mark notification as read
                      markNotificationAsRead(notification.id);

                      // Handle different notification types
                      if (notification.type === 'prayer') {
                        router.push('/prayer');
                      } else if (notification.type === 'event') {
                        // Extract event ID from notification ID (format: event-{eventId})
                        const eventId = notification.id.replace('event-', '');
                        router.push(`/events?eventId=${eventId}`);
                      } else if (notification.type === 'reminder' && notification.hadith) {
                        // Show Hadith modal for Sunnah reminders
                        setHadithModal({
                          visible: true,
                          hadith: notification.hadith,
                          title: notification.title
                        });
                      }
                    }}
                  >
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={[styles.notificationTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                      <Text style={[styles.notificationMessage, { color: isDark ? Colors.dark.secondary : Colors.light.secondary }]}>
                        {notification.message}
                      </Text>
                      <Text style={[styles.notificationTime, { color: isDark ? Colors.dark.secondary : Colors.light.secondary }]}>
                        {formatTime12Hour(notification.time)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? Colors.dark.secondary : Colors.light.secondary}
                      style={styles.arrowIcon}
                    />
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Hadith Modal */}
      <Modal
        visible={hadithModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHadithModal({ visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                {hadithModal.title}
              </Text>
              <TouchableOpacity
                onPress={() => setHadithModal({ visible: false })}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
              </TouchableOpacity>
            </View>

            {hadithModal.hadith && (
              <ScrollView style={styles.hadithContainer}>
                <Text style={[styles.hadithText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                  &ldquo;{hadithModal.hadith.text}&rdquo;
                </Text>
                <Text style={[styles.hadithSource, { color: isDark ? Colors.dark.secondary : Colors.light.secondary }]}>
                  — {hadithModal.hadith.source}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.accent,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 16,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.accent,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  hadithContainer: {
    padding: 20,
  },
  hadithText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  hadithSource: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});
