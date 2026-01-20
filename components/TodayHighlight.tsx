import { IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HijriDate } from '@/utils/hijri-date';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TodayHighlightProps {
  hijriDate: HijriDate;
  gregorianDate: Date;
  events: IslamicEvent[];
  isToday?: boolean;
}

export const TodayHighlight: React.FC<TodayHighlightProps> = ({
  hijriDate,
  gregorianDate,
  events,
  isToday = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDaysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isFriday = gregorianDate.getDay() === 5;
  const primaryEvent = events.find(e => e.importance === 'high') || events[0];

  return (
    <>
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
                <Text style={styles.fridayBadgeText}>🕌 Jumu'ah</Text>
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
              <Text style={styles.significanceIcon}>
                {primaryEvent?.type === 'religious' ? '🕌' : 
                 primaryEvent?.type === 'wafat' ? '🕯️' : 
                 primaryEvent?.type === 'birth' ? '🌟' : 
                 primaryEvent?.type === 'historic' ? '📜' : '✨'}
              </Text>
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
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {isToday ? "Today's Significance" : `${hijriDate.day} ${hijriDate.monthName}`}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: isDark ? '#B0BEC5' : '#757575' }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Date Info */}
              <View style={[styles.dateInfoSection, { backgroundColor: isDark ? '#1B5E20' : '#2E7D32' }]}>
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
                <View key={event.id || index} style={[styles.eventCard, { backgroundColor: isDark ? '#263238' : '#F5F5F5' }]}>
                  {/* Event Header */}
                  <View style={styles.eventCardHeader}>
                    <Text style={styles.eventCardIcon}>
                      {event.type === 'religious' ? '🕌' : 
                       event.type === 'wafat' ? '🕯️' : 
                       event.type === 'birth' ? '🌟' : '📜'}
                    </Text>
                    <View style={styles.eventCardTitles}>
                      <Text style={[styles.eventCardTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                        {event.title}
                      </Text>
                      <Text style={[styles.eventCardTitleArabic, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>
                        {event.titleArabic}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text style={[styles.eventCardDescription, { color: isDark ? '#E0E0E0' : '#424242' }]}>
                    {event.description}
                  </Text>

                  {/* Dhikr */}
                  {event.dhikr && event.dhikr.length > 0 && (
                    <View style={[styles.section, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
                      <Text style={[styles.sectionTitle, { color: isDark ? '#81C784' : '#2E7D32' }]}>
                        📿 Dhikr
                      </Text>
                      {event.dhikr.map((d, i) => (
                        <Text 
                          key={i} 
                          style={[
                            styles.arabicText, 
                            { 
                              color: isDark ? '#E0E0E0' : '#1B5E20',
                              textAlign: d.match(/[\u0600-\u06FF]/) ? 'right' : 'left'
                            }
                          ]}
                        >
                          {d}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Dua */}
                  {event.dua && event.dua.length > 0 && (
                    <View style={[styles.section, { backgroundColor: isDark ? '#1A237E' : '#E3F2FD' }]}>
                      <Text style={[styles.sectionTitle, { color: isDark ? '#90CAF9' : '#1565C0' }]}>
                        🤲 Dua
                      </Text>
                      {event.dua.map((d, i) => (
                        <Text 
                          key={i} 
                          style={[
                            styles.arabicText, 
                            { 
                              color: isDark ? '#E0E0E0' : '#0D47A1',
                              textAlign: d.match(/[\u0600-\u06FF]/) ? 'right' : 'left'
                            }
                          ]}
                        >
                          {d}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Aurad */}
                  {event.aurad && event.aurad.length > 0 && (
                    <View style={[styles.section, { backgroundColor: isDark ? '#4A148C' : '#F3E5F5' }]}>
                      <Text style={[styles.sectionTitle, { color: isDark ? '#CE93D8' : '#7B1FA2' }]}>
                        📖 Aurad (Recitations)
                      </Text>
                      {event.aurad.map((a, i) => (
                        <Text 
                          key={i} 
                          style={[styles.practiceText, { color: isDark ? '#E0E0E0' : '#4A148C' }]}
                        >
                          • {a}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Special Practices */}
                  {event.specialPractices && event.specialPractices.length > 0 && (
                    <View style={[styles.section, { backgroundColor: isDark ? '#37474F' : '#ECEFF1' }]}>
                      <Text style={[styles.sectionTitle, { color: isDark ? '#B0BEC5' : '#455A64' }]}>
                        ✨ Recommended Practices
                      </Text>
                      {event.specialPractices.map((practice, i) => (
                        <Text 
                          key={i} 
                          style={[styles.practiceText, { color: isDark ? '#E0E0E0' : '#37474F' }]}
                        >
                          • {practice}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* No events but Friday */}
              {events.length === 0 && isFriday && (
                <View style={[styles.eventCard, { backgroundColor: isDark ? '#263238' : '#F5F5F5' }]}>
                  <Text style={[styles.noEventText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    🕌 Blessed Friday!
                  </Text>
                  <Text style={[styles.eventCardDescription, { color: isDark ? '#E0E0E0' : '#424242' }]}>
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
  significanceIcon: {
    fontSize: 20,
    marginRight: 10,
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
  eventCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  eventCardTitles: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCardTitleArabic: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 4,
  },
  eventCardDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  section: {
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  arabicText: {
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 6,
  },
  practiceText: {
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 4,
  },
});
