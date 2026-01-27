import { Colors } from '@/constants/theme';
import { Khatam, KhatamGroup, calculateKhatamProgress } from '@/data/quran-khatam';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface KhatamGroupCardProps {
  group: KhatamGroup;
  onPress: () => void;
  onSelectKhatam: (group: KhatamGroup, khatam: Khatam) => void;
  onAddKhatam: (group: KhatamGroup) => void;
}

export const KhatamGroupCard: React.FC<KhatamGroupCardProps> = ({ group, onPress, onSelectKhatam, onAddKhatam }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];

  const allAssignments = group.khatams.flatMap(k => k.assignments);
  const progress = calculateKhatamProgress(allAssignments);
  const completedCount = allAssignments.filter(a => a.isCompleted).length;
  const assignedCount = allAssignments.length;

  const today = new Date();
  const targetDate = new Date(group.targetDate);
  const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const getDaysLeftColor = () => {
    if (group.isCompleted) return colors.primary;
    if (daysLeft < 0) return '#F44336'; // Keep red for overdue
    if (daysLeft <= 3) return colors.accent;
    if (daysLeft <= 7) return colors.secondary;
    return colors.primary;
  };

  const getDaysLeftText = () => {
    if (group.isCompleted) return 'Completed!';
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Due today!';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        group.isCompleted && styles.completedContainer,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="book" size={18} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text, marginLeft: 8 }]}>
              {group.name}
            </Text>
          </View>
          {group.dedication && (
            <Text style={[styles.dedication, { color: colors.secondary }]}>
              For: {group.dedication}
            </Text>
          )}
        </View>
        <View style={[styles.daysLeftBadge, { backgroundColor: getDaysLeftColor() }]}>
          {group.isCompleted ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
              <Text style={[styles.daysLeftText, {marginLeft: 4}]}>{getDaysLeftText()}</Text>
            </View>
          ) : (
            <Text style={styles.daysLeftText}>{getDaysLeftText()}</Text>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={[styles.progressBarBg, { backgroundColor: colors.secondary }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progress}%`,
                backgroundColor: progress === 100 ? '#4CAF50' : '#FF9800',
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.secondary }]}>
          {progress}% Complete
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
            {completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.secondary }]}>
            Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDark ? '#FF9800' : '#E65100' }]}>
            {assignedCount - completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.secondary }]}>
            In Progress
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDark ? '#9E9E9E' : '#757575' }]}>
            {30 - assignedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.secondary }]}>
            Unassigned
          </Text>
        </View>
      </View>

      {/* Description */}
      {group.description && (
        <Text 
          style={[styles.description, { color: colors.secondary }]}
          numberOfLines={2}
        >
          {group.description}
        </Text>
      )}

      {/* Tap hint */}
      <Text style={[styles.tapHint, { color: colors.secondary }]}>
        Tap to manage →
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedContainer: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  dedication: {
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  daysLeftBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysLeftText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  tapHint: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 8,
  },
});
