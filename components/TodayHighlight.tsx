import { Colors } from '@/constants/theme';
import { IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HijriDate } from '@/utils/hijri-date';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TodayHighlightProps {
  hijriDate: HijriDate;
  gregorianDate: Date;
  events: IslamicEvent[];
  isToday?: boolean;
  onDeleteEvent?: (eventId: string) => void;
}

const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
};

export const TodayHighlight: React.FC<TodayHighlightProps> = ({
  hijriDate,
  gregorianDate,
  events,
  isToday = true,
  onDeleteEvent,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDaysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isFriday = gregorianDate.getDay() === 5;
  const primaryEvent = events[0]; // Removed importance-based selection

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <View style={styles.hijriDateContainer}>
            <Text style={styles.hijriDay}>{toArabicNumerals(hijriDate.day)}</Text>
            <View style={styles.hijriMonthYear}>
              <Text style={styles.hijriMonth}>{hijriDate.monthName}</Text>
              <Text style={styles.hijriMonthArabic}>{hijriDate.monthNameArabic}</Text>
              <Text style={styles.hijriYear}>{toArabicNumerals(hijriDate.year)} هـ</Text>
            </View>
          </View>
          
          <View style={styles.weekdayContainer}>
            <Text style={[styles.weekday, isFriday && isToday && styles.fridayText]}>
              {weekDays[gregorianDate.getDay()]}
            </Text>
            <Text style={styles.weekdayArabic}>
              {weekDaysArabic[gregorianDate.getDay()]}
            </Text>
            {isToday && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Today</Text>
              </View>
            )}
            {isFriday && isToday && (
              <View style={styles.fridayBadge}>
                <Text style={styles.fridayBadgeText}>🕌 Jumu&apos;ah</Text>
              </View>
            )}
          </View>
        </View>

        {/* Event Title - Clickable */}
        {events.length > 0 ? (
          <TouchableOpacity 
            style={styles.significanceButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.significanceHeader}>
              <Text style={styles.eventTitleText} numberOfLines={1}>
                {primaryEvent.title}
              </Text>
              <Text style={styles.significanceArrow}>›</Text>
            </View>
            {events.length > 1 && (
              <Text style={styles.moreEventsPreview}>
                +{events.length - 1} more event{events.length > 2 ? 's' : ''}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.noEventBox}>
            <Text style={styles.noEventText}>No special events on this day</Text>
          </View>
        )}
      </View>

      {/* Modal for Full Content */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.accent }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isToday ? "Today's Significance" : `${hijriDate.day} ${hijriDate.monthName}`}
              </Text>
              <View style={styles.modalHeaderButtons}>
                {events.some(event => event.id?.startsWith('custom_')) && onDeleteEvent && (
                  <TouchableOpacity 
                    onPress={() => {
                      const customEvent = events.find(event => event.id?.startsWith('custom_'));
                      if (customEvent && customEvent.id) {
                        onDeleteEvent(customEvent.id);
                        setModalVisible(false);
                      }
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={20} color="#E53935" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeButtonText, { color: colors.accent }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Date Info */}
              <View style={[styles.dateInfoSection, { backgroundColor: colors.primary }]}>
                <Text style={styles.modalDateText}>
                  {hijriDate.day} {hijriDate.monthName} {hijriDate.year} AH
                </Text>
                <Text style={styles.modalDateArabic}>{hijriDate.monthNameArabic}</Text>
                <Text style={styles.modalGregorianDate}>
                  {weekDays[gregorianDate.getDay()]}, {gregorianDate.getDate()} {months[gregorianDate.getMonth()]} {gregorianDate.getFullYear()}
                </Text>
              </View>

              {/* Events */}
              {events.map((event, index) => (
                <View key={event.id || index} style={[styles.eventCard, { backgroundColor: colors.background }]}>
                  {/* Event Header */}
                  <View style={styles.eventCardHeader}>
                    <View style={styles.eventCardTitles}>
                      <Text style={[styles.eventCardTitle, { color: colors.text }]}>
                        {event.title}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text style={[styles.eventCardDescription, { color: colors.text }]}>
                    {event.description}
                  </Text>
                </View>
              ))}

              {/* No events but Friday */}
              {events.length === 0 && isFriday && (
                <View style={[styles.eventCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.noEventText, { color: colors.text }]}>
                    Blessed Friday!
                  </Text>
                  <Text style={[styles.eventCardDescription, { color: colors.text }]}>
                    Send abundant Salawat upon the Prophet ﷺ. Friday is the best day of the week.
                  </Text>
                </View>
              )}

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
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
  todayBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
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
  significanceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  significanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  significanceLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },
  eventTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    flex: 1,
  },
  significanceArrow: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  significancePreview: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 6,
  },
  moreEventsPreview: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  noEventBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  noEventText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  modalBody: {
    padding: 16,
  },
  dateInfoSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  modalDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalDateArabic: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  modalGregorianDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  eventCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventCardTitles: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCardDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});
