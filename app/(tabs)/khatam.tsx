import { JuzCard, JuzProgressGrid } from '@/components/JuzCard';
import { KhatamGroupCard } from '@/components/KhatamGroupCard';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    calculateKhatamProgress,
    getJuzInfo,
    getRemainingJuz,
    Khatam,
    KHATAM_DUA,
    KhatamGroup,
    QURAN_JUZ
} from '@/data/quran-khatam';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    addKhatamToGroup,
    assignJuz,
    createKhatamGroup,
    deleteKhatamGroup,
    getReminders,
    loadKhatamGroups,
    markJuzCompleted,
    markJuzIncomplete,
    removeAssignment,
    removeKhatamFromGroup,
} from '@/utils/khatam-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KhatamScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  // Labels with Malayalam translations
  const labels = {
    title: isMalayalam ? 'ഖുർആൻ ഖത്തം' : 'Quran Khatam',
    subtitle: 'ختم القرآن الجماعي',
    reminders: isMalayalam ? 'ഓർമ്മപ്പെടുത്തലുകൾ' : 'Reminders',
    juzRemaining: isMalayalam ? 'ജുസ് ബാക്കി' : 'Juz remaining',
    daysLeft: isMalayalam ? 'ദിവസങ്ങൾ ബാക്കി' : 'days left',
    groupKhatam: isMalayalam ? 'ഗ്രൂപ്പ് ഖത്തം' : 'Group Khatam',
    infoText: isMalayalam 
      ? '30 ജുസ് പങ്കെടുക്കുന്നവർക്കിടയിൽ വിതരണം ചെയ്ത് ഗ്രൂപ്പ് ഖുർആൻ ഖത്തം സംഘടിപ്പിക്കുക. പുരോഗതി ട്രാക്ക് ചെയ്യുക, സമയപരിധി നിശ്ചയിക്കുക, ഒരുമിച്ച് ഖുർആൻ പൂർത്തിയാക്കുക!'
      : 'Organize a group Quran Khatam by distributing 30 Juz among participants. Track progress, set deadlines, and complete the Quran together!',
    createNew: isMalayalam ? 'ഗ്രൂപ്പ് സൃഷ്ടിക്കുക' : 'Create Group',
    noGroups: isMalayalam ? 'ഖത്തം ഗ്രൂപ്പുകളൊന്നുമില്ല' : 'No Khatam Groups',
    createFirst: isMalayalam ? 'നിങ്ങളുടെ ആദ്യ ഗ്രൂപ്പ് ഖത്തം സൃഷ്ടിച്ച് ആരംഭിക്കുക' : 'Create your first group Khatam to get started',
    joinGroup: isMalayalam ? 'ഗ്രൂപ്പിൽ ചേരുക' : 'Join Group',
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
    khatamComplete: isMalayalam ? 'ഖത്തം പൂർത്തിയായി!' : 'Khatam Complete!',
    duaTitle: isMalayalam ? 'ഖത്തം ദുആ' : 'Khatam Dua',
    delete: isMalayalam ? 'ഇല്ലാതാക്കുക' : 'Delete',
    progress: isMalayalam ? 'പുരോഗതി' : 'Progress',
    assigned: isMalayalam ? 'നിയോഗിച്ചത്' : 'Assigned',
    completed: isMalayalam ? 'പൂർത്തിയായി' : 'Completed',
    remaining: isMalayalam ? 'ബാക്കി' : 'Remaining',
  };

  const [groups, setGroups] = useState<KhatamGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<KhatamGroup | null>(null);
  const [selectedKhatam, setSelectedKhatam] = useState<Khatam | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDuaModal, setShowDuaModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reminders, setReminders] = useState<{ group: KhatamGroup; daysLeft: number; incompleteCount: number }[]>([]);

  // Form states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupDedication, setNewGroupDedication] = useState('');
  const [newGroupTargetDate, setNewGroupTargetDate] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const getTargetDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

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
      const newGroup = await createKhatamGroup(
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
      
      // Show join code
      Alert.alert(
        'Group Created!',
        `Your group "${newGroup.name}" has been created.\n\nJoin Code: ${newGroup.joinCode}\n\nShare this code with others to join the group.`
      );
    } catch {
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
    if (!selectedGroup || !selectedKhatam) return;
    
    const assignment = selectedKhatam.assignments.find(a => a.juzNumber === juzNumber);
    
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
                  await markJuzIncomplete(selectedGroup!.id, selectedKhatam!.id, juzNumber);
                  await loadData();
                  const updatedGroups = await loadKhatamGroups();
                  const updatedGroup = updatedGroups.find(g => g.id === selectedGroup!.id);
                  setSelectedGroup(updatedGroup || null);
                  if (updatedGroup) {
                    setSelectedKhatam(updatedGroup.khatams.find(k => k.id === selectedKhatam!.id) || null);
                  }
                }
              }]
            : [{ 
                text: 'Mark Complete ✓', 
                onPress: async () => {
                  await markJuzCompleted(selectedGroup!.id, selectedKhatam!.id, juzNumber);
                  await loadData();
                  const updatedGroups = await loadKhatamGroups();
                  const updatedGroup = updatedGroups.find(g => g.id === selectedGroup!.id);
                  setSelectedGroup(updatedGroup || null);
                  if (updatedGroup) {
                    const updatedKhatam = updatedGroup.khatams.find(k => k.id === selectedKhatam!.id);
                    setSelectedKhatam(updatedKhatam || null);
                    
                    // Check if khatam is complete
                    if (updatedKhatam && calculateKhatamProgress(updatedKhatam.assignments) === 100) {
                      setShowDuaModal(true);
                    }
                  }
                }
              }]
          ),
          { 
            text: 'Remove Assignment', 
            style: 'destructive',
            onPress: async () => {
              await removeAssignment(selectedGroup!.id, selectedKhatam!.id, juzNumber);
              await loadData();
              const updatedGroups = await loadKhatamGroups();
              const updatedGroup = updatedGroups.find(g => g.id === selectedGroup!.id);
              setSelectedGroup(updatedGroup || null);
              if (updatedGroup) {
                setSelectedKhatam(updatedGroup.khatams.find(k => k.id === selectedKhatam!.id) || null);
              }
            }
          },
        ]
      );
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter a join code');
      return;
    }

    const groups = await loadKhatamGroups();
    const group = groups.find(g => g.joinCode === joinCode.trim());

    if (!group) {
      Alert.alert('Error', 'Invalid join code');
      return;
    }

    setJoinCode('');
    setShowJoinModal(false);
    setSelectedGroup(group);
    setSelectedKhatam(group.khatams[0]);
  };

  const handleAssignJuz = async () => {
    if (!selectedGroup || !selectedKhatam || selectedJuz === null) return;
    if (!participantName.trim()) {
      Alert.alert('Error', 'Please enter participant name');
      return;
    }

    await assignJuz(selectedGroup.id, selectedKhatam.id, selectedJuz, participantName.trim());
    setParticipantName('');
    setSelectedJuz(null);
    setShowAssignModal(false);
    await loadData();
    const updatedGroups = await loadKhatamGroups();
    const updatedGroup = updatedGroups.find(g => g.id === selectedGroup.id);
    setSelectedGroup(updatedGroup || null);
    if (updatedGroup) {
      setSelectedKhatam(updatedGroup.khatams.find(k => k.id === selectedKhatam.id) || null);
    }
  };

  const handleSelectKhatam = (group: KhatamGroup, khatam: Khatam) => {
    setSelectedGroup(group);
    setSelectedKhatam(khatam);
  };

  const handleAddKhatam = async (group: KhatamGroup) => {
    const newKhatam = await addKhatamToGroup(group.id);
    if (newKhatam) {
      await loadData();
    }
  };

  const renderGroupList = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={[styles.headerBackIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            {labels.title}
          </Text>
        </View>
      </View>

      {/* Reminders */}
      {reminders.length > 0 && (
        <View style={[styles.reminderContainer, { backgroundColor: isDark ? '#B71C1C' : '#FFEBEE' }]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="warning" size={16} color={isDark ? '#FFFFFF' : '#C62828'} />
            <Text style={[styles.reminderTitle, { color: isDark ? '#FFFFFF' : '#C62828', marginLeft: 8 }]}>
              {labels.reminders}
            </Text>
          </View>
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

      {/* Action Boxes */}
      <View style={styles.actionBoxes}>
        <TouchableOpacity 
          style={[styles.actionBox, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.actionBoxText}>{labels.createNew}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBox, { backgroundColor: colors.secondary }]}
          onPress={() => setShowJoinModal(true)}
        >
          <Text style={styles.actionBoxText}>{labels.joinGroup}</Text>
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      {groups.length > 0 ? (
        <View style={styles.groupsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Khatam Groups
          </Text>
          {groups.map(group => (
            <KhatamGroupCard
              key={group.id}
              group={group}
              onPress={() => {
                setSelectedGroup(group);
                setSelectedKhatam(group.khatams[0]);
              }}
              onSelectKhatam={handleSelectKhatam}
              onAddKhatam={handleAddKhatam}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            No Khatam groups yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
            Create your first group to get started
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderGroupDetail = () => {
    if (!selectedGroup || !selectedKhatam) return null;

    const progress = calculateKhatamProgress(selectedKhatam.assignments);
    const remainingJuz = getRemainingJuz(selectedKhatam.assignments);

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Back Button */}
        <View style={styles.backButton}>
          <TouchableOpacity 
            onPress={() => {
              setSelectedGroup(null);
              setSelectedKhatam(null);
            }}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>
              ← Back to Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Share.share({
              message: `Join my Quran Khatam group "${selectedGroup.name}" with code: ${selectedGroup.joinCode}`
            })}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="link" size={14} color={colors.primary} />
              <Text style={[styles.joinCodeText, { color: colors.text, marginLeft: 8 }]}>
                {selectedGroup.joinCode}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Khatam Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 8 }}
          contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: 4 }}
        >
          {selectedGroup.khatams.map(khatam => (
            <TouchableOpacity
              key={khatam.id}
              style={[
                {
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  minWidth: 60,
                  alignItems: 'center',
                  backgroundColor: selectedKhatam?.id === khatam.id ? colors.primary : colors.secondary
                }
              ]}
              onPress={() => setSelectedKhatam(khatam)}
              onLongPress={() => {
                Alert.alert(
                  'Delete Khatam',
                  `Are you sure you want to delete "${khatam.name}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: async () => {
                        await removeKhatamFromGroup(selectedGroup.id, khatam.id);
                        await loadData();
                        const updatedGroups = await loadKhatamGroups();
                        const updatedGroup = updatedGroups.find(g => g.id === selectedGroup.id);
                        if (!updatedGroup || updatedGroup.khatams.length === 0) {
                          setSelectedGroup(null);
                          setSelectedKhatam(null);
                        } else {
                          setSelectedGroup(updatedGroup);
                          if (selectedKhatam?.id === khatam.id) {
                            setSelectedKhatam(updatedGroup.khatams[0]);
                          } else {
                            setSelectedKhatam(updatedGroup.khatams.find(k => k.id === selectedKhatam!.id) || updatedGroup.khatams[0]);
                          }
                        }
                      }
                    },
                  ]
                );
              }}
            >
              <Text style={[
                {
                  fontSize: 12,
                  fontWeight: '600',
                  color: selectedKhatam?.id === khatam.id ? '#FFFFFF' : colors.text
                }
              ]}>
                {khatam.name} {calculateKhatamProgress(khatam.assignments)}%
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.primary
              }
            ]}
            onPress={() => handleAddKhatam(selectedGroup)}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </ScrollView>

        {/* Group Header */}
        <View style={[styles.groupHeader, { backgroundColor: colors.card }]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="book" size={20} color={colors.primary} />
            <Text style={[styles.groupTitle, { color: colors.text, marginLeft: 8 }]}>
              {selectedGroup.name} - {selectedKhatam?.name}
            </Text>
          </View>
          {selectedGroup.dedication && (
            <Text style={[styles.groupDedication, { color: colors.secondary }]}>
              Dedicated for: {selectedGroup.dedication}
            </Text>
          )}
          
          {/* Progress Circle */}
          <View style={styles.progressCircleContainer}>
            <View style={[styles.progressCircle, { borderColor: progress === 100 ? colors.primary : colors.secondary }]}>
              <Text style={[styles.progressPercent, { color: colors.text }]}>
                {progress}%
              </Text>
              <Text style={[styles.progressLabel, { color: colors.secondary }]}>
                Complete
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#4CAF50' }]}>
                {selectedKhatam.assignments.filter(a => a.isCompleted).length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: colors.secondary }]}>Done</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: '#FF9800' }]}>
                {selectedKhatam.assignments.filter(a => !a.isCompleted).length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: colors.secondary }]}>In Progress</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: colors.secondary }]}>
                {remainingJuz.length}
              </Text>
              <Text style={[styles.quickStatLabel, { color: colors.secondary }]}>Unassigned</Text>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteGroup(selectedGroup.id)}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="trash" size={14} color="#F44336" />
              <Text style={[styles.deleteButtonText, {marginLeft: 8}]}>Delete Group</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Juz Progress Overview
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.secondary }]}>
            Tap any Juz to assign or update status
          </Text>
          <View style={[styles.gridCard, { backgroundColor: colors.card }]}>
            <JuzProgressGrid 
              assignments={selectedKhatam.assignments}
              onJuzPress={handleJuzPress}
            />
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.legendText, { color: colors.secondary }]}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                <Text style={[styles.legendText, { color: colors.secondary }]}>Assigned</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.legendText, { color: colors.secondary }]}>Unassigned</Text>
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
              assignment={selectedKhatam.assignments.find(a => a.juzNumber === juz.number)}
              onPress={() => handleJuzPress(juz.number)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {selectedGroup ? renderGroupDetail() : renderGroupList()}

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Khatam</Text>
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Group Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g., Ramadan 1447 Khatam"
              placeholderTextColor={colors.secondary}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              placeholder="Add a description..."
              placeholderTextColor={colors.secondary}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Dedication (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={newGroupDedication}
              onChangeText={setNewGroupDedication}
              placeholder="e.g., For the departed soul of..."
              placeholderTextColor={colors.secondary}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Select Target Days *</Text>
            <View style={styles.daysSelector}>
              {[3, 7, 14, 30, 40].map(days => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    { 
                      backgroundColor: newGroupTargetDate === getTargetDate(days) ? colors.primary : colors.card,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => setNewGroupTargetDate(getTargetDate(days))}
                >
                  <Text style={[
                    styles.dayNumberText,
                    { color: newGroupTargetDate === getTargetDate(days) ? '#FFFFFF' : colors.text }
                  ]}>
                    {days}
                  </Text>
                  <Text style={[
                    styles.dayLabelText,
                    { color: newGroupTargetDate === getTargetDate(days) ? '#FFFFFF' : colors.secondary }
                  ]}>
                    days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Join Group Modal */}
      <Modal
        visible={showJoinModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.assignModalOverlay}>
          <View style={[styles.assignModalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.assignModalTitle, { color: colors.text }]}>
              Join Group
            </Text>
            <Text style={[styles.assignModalSubtitle, { color: colors.secondary }]}>
              Enter the 4-digit join code
            </Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="Enter join code"
              placeholderTextColor={colors.secondary}
              keyboardType="numeric"
              maxLength={4}
              autoFocus
            />

            <View style={styles.assignModalButtons}>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => {
                  setShowJoinModal(false);
                  setJoinCode('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.secondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleJoinGroup}
              >
                <Text style={styles.confirmButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Juz Modal */}
      <Modal
        visible={showAssignModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.assignModalOverlay}>
          <View style={[styles.assignModalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.assignModalTitle, { color: colors.text }]}>
              Assign Juz {selectedJuz}
            </Text>
            {selectedJuz && (
              <Text style={[styles.assignModalSubtitle, { color: colors.secondary }]}>
                {getJuzInfo(selectedJuz)?.name} - {getJuzInfo(selectedJuz)?.nameArabic}
              </Text>
            )}
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={participantName}
              onChangeText={setParticipantName}
              placeholder="Participant name"
              placeholderTextColor={colors.secondary}
              autoFocus
            />

            <View style={styles.assignModalButtons}>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => {
                  setShowAssignModal(false);
                  setSelectedJuz(null);
                  setParticipantName('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.secondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.assignModalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
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
          <View style={[styles.duaModalContent, { backgroundColor: colors.card }]}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Ionicons name="trophy" size={48} color={colors.primary} />
              <Ionicons name="book" size={48} color={colors.primary} style={{marginHorizontal: 16}} />
              <Ionicons name="sparkles" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.duaModalTitle, { color: colors.text }]}>
              Khatam Complete!
            </Text>
            <Text style={[styles.duaModalSubtitle, { color: colors.secondary }]}>
              Congratulations! Make dua for completing the Quran:
            </Text>
            
            <ScrollView style={styles.duaScrollView}>
              <Text style={[styles.duaModalArabic, { color: colors.text }]}>
                {KHATAM_DUA.arabic}
              </Text>
              <Text style={[styles.duaModalTranslation, { color: colors.secondary }]}>
                {KHATAM_DUA.translation}
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.duaModalButton, { backgroundColor: colors.primary }]}
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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackButton: {
    position: 'absolute',
    left: 20,
    top: 16,
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
  actionBoxes: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    justifyContent: 'center',
  },
  actionBox: {
    width: '28%',
    maxWidth: 130,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBoxText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  joinCodeText: {
    fontSize: 14,
    fontWeight: '600',
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
    width: '35%',
    maxWidth: 130,
    aspectRatio: 1,
    borderRadius: 999,
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
  daysSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
    minWidth: 60,
  },
  dayNumberText: {
    fontSize: 24,
    fontWeight: '700',
  },
  dayLabelText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
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
    // backgroundColor is applied inline
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
