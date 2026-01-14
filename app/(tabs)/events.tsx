import { EventCard } from '@/components/EventCard';
import { EventListItem } from '@/components/EventListItem';
import { HIJRI_MONTHS, ISLAMIC_EVENTS, IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FilterType = 'all' | 'religious' | 'wafat' | 'birth' | 'historic';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | null>(null);

  const filteredEvents = useMemo(() => {
    let events = [...ISLAMIC_EVENTS];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.titleArabic.includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Filter by month
    if (selectedMonth !== null) {
      events = events.filter(event => event.month === selectedMonth);
    }

    // Filter by type
    if (selectedFilter !== 'all') {
      events = events.filter(event => event.type === selectedFilter);
    }

    // Sort by month and day
    return events.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
  }, [searchQuery, selectedMonth, selectedFilter]);

  const filterButtons: { type: FilterType; label: string; icon: string }[] = [
    { type: 'all', label: 'All', icon: '📅' },
    { type: 'religious', label: 'Religious', icon: '🕌' },
    { type: 'wafat', label: 'Wafat', icon: '🕯️' },
    { type: 'birth', label: 'Birth', icon: '🌟' },
    { type: 'historic', label: 'Historic', icon: '📜' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
          Islamic Events
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
          المناسبات الإسلامية
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
          placeholder="Search events..."
          placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Month Filter */}
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
            All Months
          </Text>
        </TouchableOpacity>
        {HIJRI_MONTHS.map(month => (
          <TouchableOpacity
            key={month.number}
            style={[
              styles.monthChip,
              selectedMonth === month.number && styles.monthChipSelected,
              { backgroundColor: selectedMonth === month.number ? '#2E7D32' : isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
            onPress={() => setSelectedMonth(month.number)}
          >
            <Text
              style={[
                styles.monthChipText,
                { color: selectedMonth === month.number ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A' },
              ]}
            >
              {month.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        {filterButtons.map(filter => (
          <TouchableOpacity
            key={filter.type}
            style={[
              styles.filterButton,
              selectedFilter === filter.type && styles.filterButtonSelected,
              { backgroundColor: selectedFilter === filter.type ? '#2E7D32' : isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
            onPress={() => setSelectedFilter(filter.type)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === filter.type ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A' },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventListItem event={item} onPress={() => setSelectedEvent(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDark ? '#757575' : '#9E9E9E' }]}>
              No events found
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
              <Text style={[styles.closeButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedEvent && <EventCard event={selectedEvent} />}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'right',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    fontSize: 16,
    color: '#9E9E9E',
    padding: 4,
  },
  monthScrollView: {
    maxHeight: 44,
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonSelected: {},
  filterIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8,
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
