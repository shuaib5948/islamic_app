import { JuzAssignment, JuzInfo } from '@/data/quran-khatam';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface JuzCardProps {
  juz: JuzInfo;
  assignment?: JuzAssignment;
  onPress: () => void;
  onLongPress?: () => void;
}

export const JuzCard: React.FC<JuzCardProps> = ({ juz, assignment, onPress, onLongPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isAssigned = !!assignment;
  const isCompleted = assignment?.isCompleted || false;

  const getStatusColor = () => {
    if (isCompleted) return '#4CAF50';
    if (isAssigned) return '#FF9800';
    return isDark ? '#37474F' : '#E0E0E0';
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✅';
    if (isAssigned) return '📖';
    return '○';
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderLeftColor: getStatusColor(),
        }
      ]}
    >
      <View style={[styles.numberContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.numberText}>{juz.number}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.juzName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            Juz {juz.number}: {juz.name}
          </Text>
          <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
        </View>
        
        <Text style={[styles.juzNameArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
          {juz.nameArabic}
        </Text>
        
        <Text style={[styles.surahInfo, { color: isDark ? '#9E9E9E' : '#757575' }]}>
          {juz.startSurah} {juz.startVerse} → {juz.endSurah} {juz.endVerse}
        </Text>
        
        {isAssigned && (
          <View style={[styles.assigneeContainer, { backgroundColor: isDark ? '#263238' : '#F5F5F5' }]}>
            <Text style={[styles.assigneeLabel, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              👤 Assigned to:
            </Text>
            <Text style={[styles.assigneeName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {assignment.participantName}
            </Text>
            {isCompleted && (
              <Text style={[styles.completedDate, { color: '#4CAF50' }]}>
                ✓ Completed
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface JuzGridProps {
  assignments: JuzAssignment[];
  onJuzPress: (juzNumber: number) => void;
}

export const JuzProgressGrid: React.FC<JuzGridProps> = ({ assignments, onJuzPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getJuzStatus = (juzNumber: number) => {
    const assignment = assignments.find(a => a.juzNumber === juzNumber);
    if (assignment?.isCompleted) return 'completed';
    if (assignment) return 'assigned';
    return 'unassigned';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'assigned': return '#FF9800';
      default: return isDark ? '#37474F' : '#E0E0E0';
    }
  };

  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 30 }, (_, i) => i + 1).map(juzNumber => {
        const status = getJuzStatus(juzNumber);
        return (
          <TouchableOpacity
            key={juzNumber}
            onPress={() => onJuzPress(juzNumber)}
            style={[
              styles.gridCell,
              { backgroundColor: getStatusColor(status) }
            ]}
          >
            <Text style={[
              styles.gridCellText,
              { color: status === 'unassigned' && !isDark ? '#757575' : '#FFFFFF' }
            ]}>
              {juzNumber}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  juzName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  statusIcon: {
    fontSize: 16,
  },
  juzNameArabic: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 2,
  },
  surahInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  assigneeContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  assigneeLabel: {
    fontSize: 11,
  },
  assigneeName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  completedDate: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  // Grid styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 8,
  },
  gridCell: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCellText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
