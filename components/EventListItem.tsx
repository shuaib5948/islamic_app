import { HIJRI_MONTHS, IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventListItemProps {
  event: IslamicEvent;
  onPress: () => void;
}

export const EventListItem: React.FC<EventListItemProps> = ({ event, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getTypeColor = () => {
    switch (event.type) {
      case 'religious':
        return '#4CAF50';
      case 'wafat':
        return '#9C27B0';
      case 'birth':
        return '#2196F3';
      case 'historic':
        return '#FF9800';
      default:
        return '#607D8B';
    }
  };

  const getTypeIcon = () => {
    switch (event.type) {
      case 'religious':
        return '🕌';
      case 'wafat':
        return '🕯️';
      case 'birth':
        return '🌟';
      case 'historic':
        return '📜';
      default:
        return '📅';
    }
  };

  const monthName = HIJRI_MONTHS.find(m => m.number === event.month)?.name || '';

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
    >
      <View style={[styles.dateContainer, { backgroundColor: getTypeColor() }]}>
        <Text style={styles.dayNumber}>{event.day}</Text>
        <Text style={styles.monthAbbr}>{monthName.substring(0, 3)}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{getTypeIcon()}</Text>
          <Text 
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
            numberOfLines={1}
          >
            {event.title}
          </Text>
        </View>
        <Text 
          style={[styles.titleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}
          numberOfLines={1}
        >
          {event.titleArabic}
        </Text>
        <Text 
          style={[styles.description, { color: isDark ? '#9E9E9E' : '#616161' }]}
          numberOfLines={2}
        >
          {event.description}
        </Text>
        
        {/* Feature indicators */}
        <View style={styles.featuresRow}>
          {event.dhikr && event.dhikr.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
              <Text style={[styles.featureText, { color: isDark ? '#81C784' : '#2E7D32' }]}>📿 Dhikr</Text>
            </View>
          )}
          {event.dua && event.dua.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#0D47A1' : '#E3F2FD' }]}>
              <Text style={[styles.featureText, { color: isDark ? '#90CAF9' : '#1565C0' }]}>🤲 Dua</Text>
            </View>
          )}
          {event.aurad && event.aurad.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#4A148C' : '#F3E5F5' }]}>
              <Text style={[styles.featureText, { color: isDark ? '#CE93D8' : '#7B1FA2' }]}>📖 Aurad</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: isDark ? '#757575' : '#BDBDBD' }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    width: 50,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  monthAbbr: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  titleArabic: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
