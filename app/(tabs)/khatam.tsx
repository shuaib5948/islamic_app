import { JuzCard, JuzProgressGrid } from '@/components/JuzCard';
import { KhatamGroupCard } from '@/components/KhatamGroupCard';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  calculateKhatamProgress,
  getJuzInfo,
  getRemainingJuz,
  KHATAM_DUA,
  KhatamGroup,
  QURAN_JUZ
} from '@/data/quran-khatam';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  assignJuz,
  createKhatamGroup,
  deleteKhatamGroup,
  getReminders,
  loadKhatamGroups,
  markJuzCompleted,
  markJuzIncomplete,
  removeAssignment,
} from '@/utils/khatam-storage';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function KhatamScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  // Labels with Malayalam translations
  const labels = {
    title: isMalayalam ? 'ഖുർആൻ ഖത്തം' : 'Quran Khatam',
    subtitle: 'ختم القرآن الجماعي',
    reminders: isMalayalam ? '⚠️ ഓർമ്മപ്പെടുത്തലുകൾ' : '⚠️ Reminders',
    juzRemaining: isMalayalam ? 'ജുസ് ബാക്കി' : 'Juz remaining',
    daysLeft: isMalayalam ? 'ദിവസങ്ങൾ ബാക്കി' : 'days left',
    groupKhatam: isMalayalam ? '🤝 ഗ്രൂപ്പ് ഖത്തം' : '🤝 Group Khatam',
    infoText: isMalayalam 
      ? '30 ജുസ് പങ്കെടുക്കുന്നവർക്കിടയിൽ വിതരണം ചെയ്ത് ഗ്രൂപ്പ് ഖുർആൻ ഖത്തം സംഘടിപ്പിക്കുക. പുരോഗതി ട്രാക്ക് ചെയ്യുക, സമയപരിധി നിശ്ചയിക്കുക, ഒരുമിച്ച് ഖുർആൻ പൂർത്തിയാക്കുക!'
      : 'Organize a group Quran Khatam by distributing 30 Juz among participants. Track progress, set deadlines, and complete the Quran together!',
    createNew: isMalayalam ? '+ പുതിയ ഖത്തം ഗ്രൂപ്പ് സൃഷ്ടിക്കുക' : '+ Create New Khatam Group',
    noGroups: isMalayalam ? 'ഖത്തം ഗ്രൂപ്പുകളൊന്നുമില്ല' : 'No Khatam Groups',
    createFirst: isMalayalam ? 'നിങ്ങളുടെ ആദ്യ ഗ്രൂപ്പ് ഖത്തം സൃഷ്ടിച്ച് ആരംഭിക്കുക' : 'Create your first group Khatam to get started',
    createKhatam: isMalayalam ? 'പുതിയ ഖത്തം സൃഷ്ടിക്കുക' : 'Create New Khatam',
    groupName: isMalayalam ? 'ഗ്രൂപ്പ് പേര്' : 'Group Name',
    description: isMalayalam ? 'വിവരണം' : 'Description',
    dedication: isMalayalam ? 'ആർക്കുവേണ്ടി (ഇസാലെ സവാബ്)' : 'Dedication (Isale Sawab)',
    targetDate: isMalayalam ? 'ലക്ഷ്യ തീയതി (YYYY-MM-DD)' : 'Target Date (YYYY-MM-DD)',
    cancel: isMalayalam ? 'റദ്ദാക്കുക' : 'Cancel',
    create: isMalayalam ? 'സൃഷ്ടിക്കുക' : 'Create',
    assignJuz: isMalayalam ? 'ജുസ് നിയോഗിക്കുക' : 'Assign Juz',
    participantName: isMalayalam ? 'പങ്കെടുക്കുന്നയാളുടെ പേര്' : 'Participant Name',
    assign: isMalayalam ? 'നിയോഗിക്കുക' : 'Assign',
    khatamComplete: isMalayalam ? '🎉 ഖത്തം പൂർത്തിയായി!' : '🎉 Khatam Complete!',
    duaTitle: isMalayalam ? 'ഖത്തം ദുആ' : 'Khatam Dua',
    delete: isMalayalam ? 'ഇല്ലാതാക്കുക' : 'Delete',
    progress: isMalayalam ? 'പുരോഗതി' : 'Progress',
    assigned: isMalayalam ? 'നിയോഗിച്ചത്' : 'Assigned',
    completed: isMalayalam ? 'പൂർത്തിയായി' : 'Completed',
    remaining: isMalayalam ? 'ബാക്കി' : 'Remaining',
  };

  const [groups, setGroups] = useState<KhatamGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<KhatamGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDuaModal, setShowDuaModal] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reminders, setReminders] = useState<{ group: KhatamGroup; daysLeft: number; incompleteCount: number }[]>([]);

  // Form states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupDedication, setNewGroupDedication] = useState('');
  const [newGroupTargetDate, setNewGroupTargetDate] = useState('');
  const [participantName, setParticipantName] = useState('');

  const loadData = useCallback(async () => {
    const loadedGroups = await loadKhatamGroups();
    setGroups(loadedGroups);
    const loadedReminders = await getReminders();
    setReminders(loadedReminders);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (!newGroupTargetDate.trim()) {
      Alert.alert('Error', 'Please enter a target date (YYYY-MM-DD)');
      return;
    }

    try {
      await createKhatamGroup(
        newGroupName.trim(),
        newGroupDescription.trim(),
        newGroupTargetDate.trim(),
        newGroupDedication.trim() || undefined
      );
      
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupDedication('');
      setNewGroupTargetDate('');
      setShowCreateModal(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    Alert.alert(
      'Delete Khatam',
      'Are you sure you want to delete this Khatam group?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteKhatamGroup(groupId);
            setSelectedGroup(null);
            await loadData();
          }
        },
      ]
    );
  };

  const handleJuzPress = (juzNumber: number) => {
    if (!selectedGroup) return;
    
    const assignment = selectedGroup.assignments.find(a => a.juzNumber === juzNumber);
    
    if (!assignment) {
      setSelectedJuz(juzNumber);
      setShowAssignModal(true);
    } else {
      Alert.alert(
        `Juz ${juzNumber}`,
        `Assigned to: ${assignment.participantName}\nStatus: ${assignment.isCompleted ? 'Completed ✅' : 'In Progress 📖'}`,
        [
          { text: 'Cancel', style: 'cancel' },
          ...(assignment.isCompleted 
            ? [{ 
                text: 'Mark Incomplete', 
                onPress: async () => {
                  await markJuzIncomplete(selectedGroup.id, juzNumber);
                  await loadData();
                  const updatedGroups = await loadKhatamGroups();
                  setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
                }
              }]
            : [{ 
                text: 'Mark Complete ✓', 
                onPress: async () => {
                  await markJuzCompleted(selectedGroup.id, juzNumber);
                  await loadData();
                  const updatedGroups = await loadKhatamGroups();
                  const updated = updatedGroups.find(g => g.id === selectedGroup.id);
                  setSelectedGroup(updated || null);
                  
                  // Check if khatam is complete
                  if (updated && calculateKhatamProgress(updated.assignments) === 100) {
                    setShowDuaModal(true);
                  }
                }
              }]
          ),
          { 
            text: 'Remove Assignment', 
            style: 'destructive',
            onPress: async () => {
              await removeAssignment(selectedGroup.id, juzNumber);
              await loadData();
              const updatedGroups = await loadKhatamGroups();
              setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
            }
          },
        ]
      );
    }
  };

  const handleAssignJuz = async () => {
    if (!selectedGroup || selectedJuz === null) return;
    if (!participantName.trim()) {
      Alert.alert('Error', 'Please enter participant name');
      return;
    }

    await assignJuz(selectedGroup.id, selectedJuz, participantName.trim());
    setParticipantName('');
    setSelectedJuz(null);
    setShowAssignModal(false);
    await loadData();
    const updatedGroups = await loadKhatamGroups();
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) || null);
  };

  const renderGroupList = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={[styles.headerBackIcon, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            📖 {labels.title}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            {labels.subtitle}
          </Text>
        </View>
      </View>

      {/* Reminders */}
      {reminders.length > 0 && (
        <View style={[styles.reminderContainer, { backgroundColor: isDark ? '#B71C1C' : '#FFEBEE' }]}>
          <Text style={[styles.reminderTitle, { color: isDark ? '#FFFFFF' : '#C62828' }]}>
            {labels.reminders}
          </Text>
          {reminders.map(reminder => (
            <Text 
              key={reminder.group.id} 
              style={[styles.reminderText, { color: isDark ? '#FFCDD2' : '#D32F2F' }]}
            >
              • {reminder.group.name}: {reminder.incompleteCount} {labels.juzRemaining}, {reminder.daysLeft} {labels.daysLeft}
            </Text>
          ))}
        </View>
      )}

      {/* Create New Button */}
      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: '#2E7D32' }]}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>{labels.createNew}</Text>
      </TouchableOpacity>

      {/* Groups List */}
      {groups.length > 0 ? (
        <View style={styles.groupsSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            Your Khatam Groups
          </Text>
          {groups.map(group => (
            <KhatamGroupCard
              key={group.id}
              group={group}
              onPress={() => setSelectedGroup(group)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: isDark ? '#757575' : '#9E9E9E' }]}>
            No Khatam groups yet
          </Text>
          <Text style={[styles.emptySubtext, { color: isDark ? '#616161' : '#BDBDBD' }]}>
            Create your first group to get started
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderGroupDetail = () => {
    if (!selectedGroup) return null;

    const progress = calculateKhatamProgress(selectedGroup.assignments);
    const remainingJuz = getRemainingJuz(selectedGroup.assignments);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedGroup(null)}
        >
          <Text style={[styles.backButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
            ← Back to Groups
          </Text>
        </TouchableOpacity>

        {/* Group Header */}
        <View style={[styles.groupHeader, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.groupTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            📖 {selectedGroup.name}
          </Text>
          {selectedGroup.dedication && (
            <Text style={[styles.groupDedication, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              Dedicated for: {selectedGroup.dedication}
            </Text>
          )}
          
          {/* Progress Circle */}
          <View style={styles.progressCircleContainer}>
            <View style={[styles.progressCircle, { borderColor: progress === 100 ? '#4CAF50' : '#2196F3' }]}>
              <Text style={[styles.progressPercent, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {progress}%
              </Text>
              <Text style={[styles.progressLabel, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                Complete
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#4CAF50' }]}>
                {selectedGroup.assignments.filter(a => a.isCompleted).length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: isDark ? '#9E9E9E' : '#757575' }]}>Done</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#FF9800' }]}>
                {selectedGroup.assignments.filter(a => !a.isCompleted).length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: isDark ? '#9E9E9E' : '#757575' }]}>In Progress</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: isDark ? '#9E9E9E' : '#757575' }]}>
                {remainingJuz.length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: isDark ? '#9E9E9E' : '#757575' }]}>Unassigned</Text>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteGroup(selectedGroup.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Group</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            Juz Progress Overview
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#9E9E9E' : '#757575' }]}>
            Tap any Juz to assign or update status
          </Text>
          <View style={[styles.gridCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <JuzProgressGrid 
              assignments={selectedGroup.assignments}
              onJuzPress={handleJuzPress}
            />
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#B0BEC5' : '#757575' }]}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#B0BEC5' : '#757575' }]}>Assigned</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: isDark ? '#37474F' : '#E0E0E0' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#B0BEC5' : '#757575' }]}>Unassigned</Text>
              </View>
            </View>
          </View>
        </View>

        {/* All Juz List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            All Juz Details
          </Text>
          {QURAN_JUZ.map(juz => (
            <JuzCard
              key={juz.number}
              juz={juz}
              assignment={selectedGroup.assignments.find(a => a.juzNumber === juz.number)}
              onPress={() => handleJuzPress(juz.number)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {selectedGroup ? renderGroupDetail() : renderGroupList()}

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: isDark ? '#F44336' : '#D32F2F' }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>New Khatam</Text>
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text style={[styles.modalSave, { color: '#4CAF50' }]}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Group Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g., Ramadan 1447 Khatam"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              placeholder="Add a description..."
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Dedication (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={newGroupDedication}
              onChangeText={setNewGroupDedication}
              placeholder="e.g., For the departed soul of..."
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Target Date * (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={newGroupTargetDate}
              onChangeText={setNewGroupTargetDate}
              placeholder="2026-02-28"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Assign Juz Modal */}
      <Modal
        visible={showAssignModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.assignModalOverlay}>
          <View style={[styles.assignModalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.assignModalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Assign Juz {selectedJuz}
            </Text>
            {selectedJuz && (
              <Text style={[styles.assignModalSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                {getJuzInfo(selectedJuz)?.name} - {getJuzInfo(selectedJuz)?.nameArabic}
              </Text>
            )}
            
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#263238' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={participantName}
              onChangeText={setParticipantName}
              placeholder="Participant name"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
              autoFocus
            />

            <View style={styles.assignModalButtons}>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAssignModal(false);
                  setSelectedJuz(null);
                  setParticipantName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.confirmButton]}
                onPress={handleAssignJuz}
              >
                <Text style={styles.confirmButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Khatam Complete Dua Modal */}
      <Modal
        visible={showDuaModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDuaModal(false)}
      >
        <View style={styles.duaModalOverlay}>
          <View style={[styles.duaModalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={styles.celebrationEmoji}>🎉📖✨</Text>
            <Text style={[styles.duaModalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              Khatam Complete!
            </Text>
            <Text style={[styles.duaModalSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              Congratulations! Make dua for completing the Quran:
            </Text>
            
            <ScrollView style={styles.duaScrollView}>
              <Text style={[styles.duaModalArabic, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {KHATAM_DUA.arabic}
              </Text>
              <Text style={[styles.duaModalTranslation, { color: isDark ? '#B0BEC5' : '#616161' }]}>
                {KHATAM_DUA.translation}
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.duaModalButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => setShowDuaModal(false)}
            >
              <Text style={styles.duaModalButtonText}>آمين - Ameen</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  headerBackButton: {
    marginRight: 12,
    padding: 4,
  },
  headerBackIcon: {
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
  reminderContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 13,
    lineHeight: 20,
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  createButton: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  groupsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginHorizontal: 20,
    marginTop: -8,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  duaCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  duaArabic: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
    marginBottom: 12,
  },
  duaTranslation: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Group Detail Styles
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupHeader: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  groupDedication: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  progressCircleContainer: {
    marginVertical: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickStatLabel: {
    fontSize: 11,
  },
  deleteButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
  },
  section: {
    marginTop: 8,
  },
  gridCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Assign Modal
  assignModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  assignModalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  assignModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  assignModalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  assignModalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  assignModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Dua Modal
  duaModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  duaModalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  duaModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  duaModalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  duaScrollView: {
    maxHeight: 300,
  },
  duaModalArabic: {
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'right',
    marginBottom: 16,
  },
  duaModalTranslation: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  duaModalButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  duaModalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
