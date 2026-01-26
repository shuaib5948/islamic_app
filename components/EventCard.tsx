import { Colors } from '@/constants/theme';
import { IslamicEvent } from '@/data/hijri-events';
import { IslamicEventML } from '@/data/hijri-events-ml';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EventCardProps {
  event: IslamicEvent | IslamicEventML;
  displayTitle?: string;
  displayDescription?: string;
  isMalayalam?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, displayTitle, displayDescription, isMalayalam = false }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const getTypeColor = () => {
    return colors.eventTypes[event.type as keyof typeof colors.eventTypes] || colors.primary;
  };

  const getTypeLabel = () => {
    switch (event.type) {
      case 'religious':
        return isMalayalam ? 'മതപരം' : 'Religious';
      case 'wafat':
        return isMalayalam ? 'വഫാത്ത്' : 'Wafat';
      case 'birth':
        return isMalayalam ? 'ജനനം' : 'Birth';
      case 'historic':
        return isMalayalam ? 'ചരിത്രം' : 'Historic';
      default:
        return isMalayalam ? 'ഇവൻ്റ്' : 'Event';
    }
  };

  const title = displayTitle || event.title;
  const description = displayDescription || event.description;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.typeText}>{getTypeLabel()}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>

      {/* Description */}
      <Text style={[styles.description, { color: colors.text }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});