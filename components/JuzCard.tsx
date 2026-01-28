import { Colors } from '@/constants/theme';
import { JuzAssignment, JuzInfo } from '@/data/quran-khatam';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
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
  const colors = Colors[colorScheme];

  const isAssigned = !!assignment;
  const isCompleted = assignment?.isCompleted || false;

  const getStatusColor = () => {
    if (isCompleted) return '#4CAF50';
    if (isAssigned) return '#FF9800';
    return colors.secondary; // For unassigned, keep theme color
  };

  const getStatusIconProps = () => {
    if (isCompleted) return { name: 'checkmark-circle-outline' as const, color: '#4CAF50' };
    if (isAssigned) return { name: 'book-outline' as const, color: '#FF9800' };
    return { name: 'radio-button-off-outline' as const, color: colors.secondary };
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        { 
          backgroundColor: colors.card,
          borderLeftColor: getStatusColor(),
        }
      ]}
    >
      <View style={[styles.numberContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.numberText}>{juz.number}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.juzName, { color: colors.text }]}>
            Juz {juz.number}: {juz.name}
          </Text>
          <Ionicons {...getStatusIconProps()} size={16} />
        </View>
        
        <Text style={[styles.juzNameArabic, { color: colors.secondary }]}>
          {juz.nameArabic}
        </Text>
        
        <Text style={[styles.surahInfo, { color: colors.secondary }]}>
          {juz.startSurah} {juz.startVerse} → {juz.endSurah} {juz.endVerse}
        </Text>
        
        {isAssigned && (
          <View style={[styles.assigneeContainer, { backgroundColor: colors.background }]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="person" size={12} color={colors.secondary} />
              <Text style={[styles.assigneeLabel, { color: colors.secondary, marginLeft: 4 }]}>
                Assigned to:
              </Text>
            </View>
            <Text style={[styles.assigneeName, { color: colors.text }]}>
              {assignment.participantName}
            </Text>
            {isCompleted && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="checkmark" size={12} color='#4CAF50' />
                <Text style={[styles.completedDate, { color: '#4CAF50', marginLeft: 4 }]}>
                  Completed
                </Text>
              </View>
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
  const colors = Colors[colorScheme];

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
      default: return colors.secondary;
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
              { color: status === 'unassigned' ? colors.text : '#FFFFFF' }
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
