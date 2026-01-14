import { IslamicEvent } from '@/data/hijri-events';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EventCardProps {
  event: IslamicEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getTypeColor = () => {
    switch (event.type) {
      case 'religious':
        return '#1B5E20';
      case 'wafat':
        return '#4A148C';
      case 'birth':
        return '#0D47A1';
      case 'historic':
        return '#E65100';
      default:
        return '#37474F';
    }
  };

  const getTypeLabel = () => {
    switch (event.type) {
      case 'religious':
        return '🕌 Religious';
      case 'wafat':
        return '🕯️ Wafat';
      case 'birth':
        return '🌟 Birth';
      case 'historic':
        return '📜 Historic';
      default:
        return 'Event';
    }
  };

  const getImportanceBadge = () => {
    switch (event.importance) {
      case 'high':
        return { label: '★★★', color: '#FFD700' };
      case 'medium':
        return { label: '★★', color: '#C0C0C0' };
      case 'low':
        return { label: '★', color: '#CD7F32' };
      default:
        return { label: '', color: 'transparent' };
    }
  };

  const importance = getImportanceBadge();

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.typeText}>{getTypeLabel()}</Text>
        </View>
        <Text style={[styles.importance, { color: importance.color }]}>{importance.label}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
        {event.title}
      </Text>
      <Text style={[styles.titleArabic, { color: isDark ? '#B0BEC5' : '#546E7A' }]}>
        {event.titleArabic}
      </Text>

      {/* Description */}
      <Text style={[styles.description, { color: isDark ? '#E0E0E0' : '#424242' }]}>
        {event.description}
      </Text>

      {/* Dhikr Section */}
      {event.dhikr && event.dhikr.length > 0 && (
        <View style={[styles.section, { backgroundColor: isDark ? '#263238' : '#E8F5E9' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#81C784' : '#2E7D32' }]}>
            📿 Dhikr
          </Text>
          {event.dhikr.map((d, index) => (
            <Text 
              key={index} 
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

      {/* Dua Section */}
      {event.dua && event.dua.length > 0 && (
        <View style={[styles.section, { backgroundColor: isDark ? '#1A237E' : '#E3F2FD' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#90CAF9' : '#1565C0' }]}>
            🤲 Dua
          </Text>
          {event.dua.map((d, index) => (
            <Text 
              key={index} 
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

      {/* Aurad Section */}
      {event.aurad && event.aurad.length > 0 && (
        <View style={[styles.section, { backgroundColor: isDark ? '#4A148C' : '#F3E5F5' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#CE93D8' : '#7B1FA2' }]}>
            📖 Aurad (Recitations)
          </Text>
          {event.aurad.map((a, index) => (
            <Text 
              key={index} 
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
          {event.specialPractices.map((practice, index) => (
            <Text 
              key={index} 
              style={[styles.practiceText, { color: isDark ? '#E0E0E0' : '#37474F' }]}
            >
              • {practice}
            </Text>
          ))}
        </View>
      )}
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
  importance: {
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleArabic: {
    fontSize: 20,
    textAlign: 'right',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 32,
    marginBottom: 8,
  },
  practiceText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 4,
  },
});
