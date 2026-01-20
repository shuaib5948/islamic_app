import { EventCard } from '@/components/EventCard';
import { EventListItem } from '@/components/EventListItem';
import { useLanguage } from '@/contexts/LanguageContext';
import { HIJRI_MONTHS, ISLAMIC_EVENTS, IslamicEvent } from '@/data/hijri-events';
import { HIJRI_MONTHS_ML, ISLAMIC_EVENTS_ML, IslamicEventML } from '@/data/hijri-events-ml';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, t } = useLanguage();
  const isMalayalam = language === 'ml';

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | IslamicEventML | null>(null);

  // Get the appropriate events and months based on language
  const events = isMalayalam ? ISLAMIC_EVENTS_ML : ISLAMIC_EVENTS;
  const months = isMalayalam ? HIJRI_MONTHS_ML : HIJRI_MONTHS;

  const filteredEvents = useMemo(() => {
    let eventList = [...events];

    // Filter by month
    if (selectedMonth !== null) {
      eventList = eventList.filter(event => event.month === selectedMonth);
    }

    // Sort by month and day
    return eventList.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
  }, [selectedMonth, events]);

  // Accurate Hijri date state (async, like calendar)
  const [todayHijri, setTodayHijri] = useState<import('@/utils/hijri-date').HijriDate | null>(null);
  const [isLoadingHijri, setIsLoadingHijri] = useState(true);

  // Fetch accurate Hijri date on mount
  useEffect(() => {
    let mounted = true;
    setIsLoadingHijri(true);
    import('@/utils/hijri-date').then(mod => mod.getTodayHijriAsync()).then(date => {
      if (mounted) {
        setTodayHijri(date);
        setIsLoadingHijri(false);
        // Set default selectedMonth to current Hijri month
        setSelectedMonth(date?.month ?? null);
      }
    }).catch(() => setIsLoadingHijri(false));
    return () => { mounted = false; };
  }, []);

  const todayHijriMonth = todayHijri?.month;
  const todayHijriDay = todayHijri?.day;

  // Find the upcoming event (Hijri logic, after date loads)
  const upcomingEvent = useMemo(() => {
    if (!todayHijriMonth || !todayHijriDay) return null;
    const sorted = [...events].sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
    return (
      sorted.find(e =>
        e.month > todayHijriMonth || (e.month === todayHijriMonth && e.day >= todayHijriDay)
      ) || sorted[0]
    );
  }, [events, todayHijriMonth, todayHijriDay]);

  // Get display title based on language
  const getEventTitle = (event: IslamicEvent | IslamicEventML): string => {
    if (isMalayalam && 'titleMl' in event) {
      return event.titleMl;
    }
    return event.title;
  };

  // Get display description based on language
  const getEventDescription = (event: IslamicEvent | IslamicEventML): string => {
    if (isMalayalam && 'descriptionMl' in event) {
      return event.descriptionMl;
    }
    return event.description;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {isMalayalam ? 'ഇസ്ലാമിക മുഹൂർത്തങ്ങൾ' : 'Islamic Events'}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            المناسبات الإسلامية
          </Text>
        </View>
      </View>

      {/* Upcoming Event Box (only after Hijri date loads) */}
      {!isLoadingHijri && upcomingEvent && (
        <View style={[styles.upcomingBox, { backgroundColor: isDark ? '#1E3A5F' : '#E3F2FD' }]}> 
          <Text style={[styles.upcomingLabel, { color: isDark ? '#90CAF9' : '#1565C0' }]}> 
            {isMalayalam ? 'അടുത്ത പരിപാടി' : 'Upcoming Event'}
          </Text>
          <Text style={[styles.upcomingTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}> 
            {(() => {
              if (isMalayalam && 'titleMl' in upcomingEvent && upcomingEvent.titleMl) return upcomingEvent.titleMl;
              if ('title' in upcomingEvent && upcomingEvent.title) return upcomingEvent.title;
              return '';
            })()}
          </Text>
          <Text style={[styles.upcomingDate, { color: isDark ? '#B0BEC5' : '#757575' }]}> 
            {upcomingEvent.day} {months[upcomingEvent.month - 1]?.name}
          </Text>
        </View>
      )}

      {/* Month Filter */}
      <View style={{ zIndex: 2, elevation: 2, backgroundColor: isDark ? '#121212' : '#F5F5F5', marginBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScrollView}
          contentContainerStyle={styles.monthScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.monthChip,
              selectedMonth === null && styles.monthChipSelected,
              { backgroundColor: selectedMonth === null ? '#2E7D32' : isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
            onPress={() => setSelectedMonth(null)}
          >
            <Text
              style={[
                styles.monthChipText,
                { color: selectedMonth === null ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A' },
              ]}
            >
              {isMalayalam ? 'എല്ലാ മാസങ്ങളും' : 'All Months'}
            </Text>
          </TouchableOpacity>
          {months.map(month => (
            <TouchableOpacity
              key={month.number}
              style={[
                styles.monthChip,
                selectedMonth === month.number && styles.monthChipSelected,
                {
                  backgroundColor: selectedMonth === month.number ? '#2E7D32' : isDark ? '#1E1E1E' : '#FFFFFF',
                  paddingHorizontal: 28, // more padding for longer names
                  minWidth: 120, // increased minimum width
                  alignSelf: 'flex-start',
                  maxWidth: 260, // prevent overflow on very long names
                },
              ]}
              onPress={() => setSelectedMonth(month.number)}
            >
              <Text
                style={[
                  styles.monthChipText,
                  { color: selectedMonth === month.number ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A' },
                ]}
              >
                {isMalayalam && 'nameEn' in month ? month.name : month.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventListItem 
            event={item} 
            onPress={() => setSelectedEvent(item)}
            displayTitle={getEventTitle(item)}
            isMalayalam={isMalayalam}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDark ? '#757575' : '#9E9E9E' }]}>
              {isMalayalam ? 'ഇവൻ്റുകളൊന്നും കണ്ടെത്തിയില്ല' : 'No events found'}
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* Event Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                {isMalayalam ? '✕ അടയ്ക്കുക' : '✕ Close'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedEvent && (
              <EventCard 
                event={selectedEvent} 
                displayTitle={getEventTitle(selectedEvent)}
                displayDescription={getEventDescription(selectedEvent)}
                isMalayalam={isMalayalam}
              />
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
  },
  upcomingBox: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  upcomingLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  upcomingDate: {
    fontSize: 13,
    textAlign: 'center',
  },
  monthScrollView: {
    maxHeight: 80, // increased height for full chip visibility
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthChip: {
    width: 100, // fixed width
    height: 40, // fixed height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 8,
    marginVertical: 8, // add vertical margin for spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthChipSelected: {},
  monthChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8, // increased top padding to give more space below month cards
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
