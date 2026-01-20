import { HIJRI_MONTHS, IslamicEvent } from '@/data/hijri-events';
import { HIJRI_MONTHS_ML, IslamicEventML } from '@/data/hijri-events-ml';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Event type icons
const TYPE_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  religious: 'star',
  wafat: 'heart-outline',
  birth: 'sparkles',
  historic: 'book-outline',
  default: 'calendar-outline',
};

interface EventListItemProps {
  event: IslamicEvent | IslamicEventML;
  onPress: () => void;
  displayTitle?: string;
  isMalayalam?: boolean;
}

export const EventListItem: React.FC<EventListItemProps> = ({ event, onPress, displayTitle, isMalayalam = false }) => {
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

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    return TYPE_ICONS[event.type] || TYPE_ICONS.default;
  };

  const months = isMalayalam ? HIJRI_MONTHS_ML : HIJRI_MONTHS;
  const month = months.find(m => m.number === event.month);
  const monthName = month?.name || '';

  const title = displayTitle || event.title;
  const description = isMalayalam && 'descriptionMl' in event ? event.descriptionMl : event.description;

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
          <Ionicons 
            name={getTypeIcon()} 
            size={14} 
            color={isDark ? '#B0BEC5' : '#757575'} 
            style={styles.iconStyle}
          />
          <Text 
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
            numberOfLines={1}
          >
            {title}
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
          {description}
        </Text>
        
        {/* Feature indicators */}
        <View style={styles.featuresRow}>
          {event.dhikr && event.dhikr.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
              <View style={styles.featureContent}>
                <Ionicons name="ellipse-outline" size={10} color={isDark ? '#81C784' : '#2E7D32'} />
                <Text style={[styles.featureText, { color: isDark ? '#81C784' : '#2E7D32' }]}>
                  {' '}{isMalayalam ? 'ദിക്ർ' : 'Dhikr'}
                </Text>
              </View>
            </View>
          )}
          {event.dua && event.dua.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#0D47A1' : '#E3F2FD' }]}>
              <View style={styles.featureContent}>
                <Ionicons name="hand-left-outline" size={10} color={isDark ? '#90CAF9' : '#1565C0'} />
                <Text style={[styles.featureText, { color: isDark ? '#90CAF9' : '#1565C0' }]}>
                  {' '}{isMalayalam ? 'ദുആ' : 'Dua'}
                </Text>
              </View>
            </View>
          )}
          {event.aurad && event.aurad.length > 0 && (
            <View style={[styles.featureTag, { backgroundColor: isDark ? '#4A148C' : '#F3E5F5' }]}>
              <View style={styles.featureContent}>
                <Ionicons name="book-outline" size={10} color={isDark ? '#CE93D8' : '#7B1FA2'} />
                <Text style={[styles.featureText, { color: isDark ? '#CE93D8' : '#7B1FA2' }]}>
                  {' '}{isMalayalam ? 'ഔറാദ്' : 'Aurad'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#757575' : '#BDBDBD'} />
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
  iconStyle: {
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
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});
