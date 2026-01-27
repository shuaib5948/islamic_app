import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GroupSession {
  id: string;
  name: string;
  target: number;
  currentCount: number;
  members: string[];
  dhikrType: string;
  joinCode: string;
  contributions: { [member: string]: number };
  creator: string; // Add creator field to track who created the group
  joinedMembers: string[]; // Track members who joined via join method
}

export default function ThasbihScreen() {
  // Modal for group contributions
  const [showContribModal, setShowContribModal] = useState(false);
  // Milestone modal state
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMsg, setMilestoneMsg] = useState('');
  const [milestoneInspire, setMilestoneInspire] = useState('');
  const milestoneAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';
  const colors = isDark ? Colors.dark : Colors.light;
  const styles = getStyles(colors);

  // State management
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [count, setCount] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);
  // Individual mode target state
  const [individualTarget, setIndividualTarget] = useState(33);
  const [groupName, setGroupName] = useState('');
  const [groupTarget, setGroupTarget] = useState('100');
  const [groupDhikrType, setGroupDhikrType] = useState('Subhanallah');
  const [groupJoinCode, setGroupJoinCode] = useState('');
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupSession | null>(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinNameInput, setJoinNameInput] = useState('');

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const circleScaleAnim = useRef(new Animated.Value(0)).current;
  const circleOpacityAnim = useRef(new Animated.Value(0)).current;

  // Touch circle state
  const [touchPos, setTouchPos] = useState<{x: number, y: number} | null>(null);
  const [contentPosition, setContentPosition] = useState({x: 0, y: 0});
  const contentRef = useRef<View>(null);

  const labels = {
    title: isMalayalam ? 'തസ്ബീഹ്' : 'DigiTasbih',
    subtitle: 'تسبيح',
    individualMode: isMalayalam ? 'വ്യക്തിഗതം' : 'Individual',
    groupMode: isMalayalam ? 'ഗ്രൂപ്പ്' : 'Group',
    currentCount: isMalayalam ? 'നിലവിലെ എണ്ണം' : 'Current Count',
    target: isMalayalam ? 'ലക്ഷ്യം' : 'Target',
    setTarget: isMalayalam ? 'ലക്ഷ്യം സജ്ജമാക്കുക' : 'Set Target',
    reset: isMalayalam ? 'പുനഃസജ്ജമാക്കുക' : 'Reset',
    createGroup: isMalayalam ? 'സൃഷ്ടിക്കുക' : 'Create Group',
    joinGroup: isMalayalam ? 'ചേരുക' : 'Join Group',
    groupName: isMalayalam ? 'ഗ്രൂപ്പ് നാമം' : 'Group Name',
    groupTarget: isMalayalam ? 'ഗ്രൂപ്പ് ലക്ഷ്യം' : 'Group Target',
    create: isMalayalam ? 'സൃഷ്ടിക്കുക' : 'Create',
    join: isMalayalam ? 'ചേരുക' : 'Join',
    cancel: isMalayalam ? 'റദ്ദാക്കുക' : 'Cancel',
    close: isMalayalam ? 'അടയ്ക്കുക' : 'Close',
    congratulations: isMalayalam ? 'അഭിനന്ദനങ്ങൾ!' : 'Congratulations!',
    targetReached: isMalayalam ? 'ലക്ഷ്യം നേടി!' : 'Target Reached!',
    tapToContinue: isMalayalam ? 'തുടരാൻ ടാപ്പ് ചെയ്യുക' : 'Tap to continue',
    noGroups: isMalayalam ? 'ഗ്രൂപ്പുകൾ ലഭ്യമല്ല' : 'No groups available',
    selectMode: isMalayalam ? 'മോഡ് തിരഞ്ഞെടുക്കുക' : 'Select Mode',
  };

  // Update progress animation
  useEffect(() => {
    if (mode === 'individual' && count > 0 && individualTarget > 0 && count % individualTarget === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    // Group mode progress (countdown calculator)
    if (mode === 'group') {
      const progress = selectedGroup?.target > 0 ? 
        Math.min((selectedGroup.target - (selectedGroup?.currentCount || 0)) / selectedGroup.target, 1) : 0;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [count, selectedGroup, mode, progressAnim, individualTarget]);

  // When countdown mode is enabled, set count to target
  useEffect(() => {
    if (mode === 'individual' && isCountdown && individualTarget > 0) {
      setCount(individualTarget);
    }
  }, [isCountdown, individualTarget, mode]);

  // Hide tab bar for thasbih screen
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, [navigation]);

  // Migrate existing groups to add creator and joinedMembers fields for backward compatibility
  useEffect(() => {
    setGroupSessions(prev => prev.map(group => {
      const updatedGroup = { ...group };
      
      // Add creator field if missing
      if (!group.creator) {
        // For existing groups, assume they were created by 'You' if 'You' is the first member
        updatedGroup.creator = group.members[0] === 'You' ? 'You' : 'Unknown';
      }
      
      // Add joinedMembers field if missing
      if (!group.joinedMembers) {
        // For existing groups, joinedMembers are all members except the creator
        updatedGroup.joinedMembers = group.members.filter(member => member !== updatedGroup.creator);
      }
      
      return updatedGroup;
    }));
  }, []);

  // Helper: get current user name for group mode
  const getCurrentUser = () => {
    if (selectedGroup) {
      // If joined, use joinNameInput if present in members, else 'You'
      if (selectedGroup.members.includes('You')) return 'You';
      // Fallback: use first member
      return selectedGroup.members[0];
    }
    return 'You';
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Expanding circle animation
    Animated.parallel([
      Animated.timing(circleScaleAnim, {
        toValue: 20,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacityAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (mode === 'individual') {
      if (isCountdown) {
        const newCount = count - 1;
        setCount(newCount);
        if (newCount === 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowMilestone(true);
          milestoneAnim.setValue(0);
          Animated.timing(milestoneAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(milestoneAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => setShowMilestone(false));
            }, 2200);
          });
          // After reaching 0, revert to count up mode and clear target
          setIsCountdown(false);
          setIndividualTarget(0);
        }
      } else {
        const nextCount = count + 1;
        setCount(nextCount);
        // Milestone values
        const milestones = [33, 66, 100, 150, 200, 250, 300, 350, 400, 450, 500];
        if (milestones.includes(nextCount)) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowMilestone(true);
          milestoneAnim.setValue(0);
          Animated.timing(milestoneAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(milestoneAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => setShowMilestone(false));
            }, 2200);
          });
        }
      }
    } else if (selectedGroup) {
      // Prevent counting if completed
      const isReverse = selectedGroup.target > 0;
      const completed = (isReverse && selectedGroup.currentCount === 0) || (!isReverse && selectedGroup.currentCount === selectedGroup.target);
      if (completed) return;
      const newCount = isReverse ? selectedGroup.currentCount - 1 : selectedGroup.currentCount + 1;
      // Track contributions
      const user = getCurrentUser();
      const newContribs = { ...selectedGroup.contributions };
      newContribs[user] = (newContribs[user] || 0) + 1;
      const updatedGroup = { ...selectedGroup, currentCount: newCount, contributions: newContribs };
      setSelectedGroup(updatedGroup);
      setGroupSessions(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g));

      if (isReverse && newCount === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(labels.congratulations, labels.targetReached);
      } else if (!isReverse && newCount === selectedGroup.target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(labels.congratulations, labels.targetReached);
      }
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (mode === 'individual') {
      setCount(0);
      setIsCountdown(false);
    } else if (selectedGroup) {
      const isReverse = selectedGroup.target > 0;
      const updatedGroup = { ...selectedGroup, currentCount: isReverse ? selectedGroup.target : 0 };
      setSelectedGroup(updatedGroup);
      setGroupSessions(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGroupJoinCode(code);

    // Parse groupTarget as number, fallback to 0 if invalid
    const parsedTarget = parseInt(groupTarget) || 0;

    const newGroup: GroupSession = {
      id: Date.now().toString(),
      name: groupName.trim(),
      target: parsedTarget,
      currentCount: parsedTarget > 0 ? parsedTarget : 0,
      members: ['You'],
      dhikrType: groupDhikrType,
      joinCode: code,
      contributions: { 'You': 0 },
      creator: 'You', // Set creator as 'You' for created groups
      joinedMembers: [], // Creator doesn't join, they create
    };

    setGroupSessions(prev => [...prev, newGroup]);
    setSelectedGroup(newGroup);
    setGroupName('');
    setGroupTarget('100');
    setGroupDhikrType('Subhanallah');
    setShowGroupModal(false);
    setMode('group');
  };

  const handleJoinByCode = () => {
    if (!joinNameInput.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    const group = groupSessions.find(g => g.joinCode === joinCodeInput.trim());
    if (group) {
      // Check if already a member
      if (group.members.includes(joinNameInput.trim())) {
        Alert.alert('Already Member', 'You are already a member of this group.');
        return;
      }
      
      // Add member and initialize their contribution if not present
      const updatedContribs = { ...group.contributions };
      if (!(joinNameInput.trim() in updatedContribs)) {
        updatedContribs[joinNameInput.trim()] = 0;
      }
      const updatedGroup = { 
        ...group, 
        members: [...group.members, joinNameInput.trim()], 
        contributions: updatedContribs,
        joinedMembers: [...(group.joinedMembers || []), joinNameInput.trim()] // Track joined members
      };
      setGroupSessions(prev => prev.map(g => g.id === group.id ? updatedGroup : g));
      setSelectedGroup(updatedGroup);
      setShowJoinModal(false);
      setMode('group');
      setJoinCodeInput('');
      setJoinNameInput('');
    } else {
      Alert.alert('Invalid Code', 'No group found with that join code.');
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Milestone Modal Popup from Bottom - Large Full Width Box with Inspire Content */}
      <Modal visible={showMilestone} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          onPress={() => setShowMilestone(false)}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              alignItems: 'center',
              opacity: milestoneAnim,
              transform: [{ translateY: milestoneAnim.interpolate({ inputRange: [0, 1], outputRange: [180, 0] }) }],
            }}
          >
            <View style={{
              backgroundColor: colors.card,
              width: SCREEN_WIDTH,
              paddingHorizontal: 32,
              paddingVertical: 44,
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              marginBottom: 0,
              minWidth: 320,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.22,
              shadowRadius: 18,
              elevation: 18,
              alignItems: 'center',
            }}>
              <Ionicons name="sparkles" size={48} color={colors.primary} style={{ marginBottom: 12 }} />
              <Text style={{ color: colors.primary, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, letterSpacing: 1 }}>
                Achievement Unlocked!
              </Text>
              <Text style={{ color: colors.text, fontSize: 20, textAlign: 'center', fontWeight: '600', marginBottom: 8 }}>
                You reached your goal!
              </Text>
              <Text style={{ color: colors.accent, fontSize: 18, textAlign: 'center', fontStyle: 'italic', marginTop: 2, marginBottom: 12 }}>
                "Every dhikr brings light to your heart. Keep going!"
              </Text>
              <View style={{ marginTop: 18, alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                  Tap anywhere to continue
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* App Header (like Hijri Calendar) */}
      <View style={[styles.header, { justifyContent: 'space-between', alignItems: 'center' }]}> 
        <TouchableOpacity 
          onPress={() => {
            if (mode === 'group' && selectedGroup) {
              setSelectedGroup(null);
            } else {
              router.push('/');
            }
          }} 
          style={styles.backButton} 
          accessibilityLabel={mode === 'group' && selectedGroup ? "Back to Groups" : "Back to Home"}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.title, styles.appTitle, { color: colors.text }]}>DigiThasbih</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              if (mode === 'individual') {
                setShowTargetModal(true);
              } else if (mode === 'group') {
                if (selectedGroup) {
                  setShowContribModal(true);
                } else {
                  setShowAddModal(true);
                }
              }
            }}
            style={{ padding: 4, marginRight: selectedGroup && selectedGroup.members[0] === 'You' ? 8 : 0 }}
            accessibilityLabel={
              mode === 'individual'
                ? 'Set DigiThasbih Target'
                : selectedGroup
                  ? 'Group Progress'
                  : 'Add Group'
            }
          >
            {mode === 'individual' ? (
              <Ionicons name="locate" size={24} color={colors.text} />
            ) : selectedGroup ? (
              <Ionicons name="stats-chart" size={24} color={colors.text} />
            ) : (
              <Ionicons name="add" size={24} color={colors.text} />
            )}
          </TouchableOpacity>
          {selectedGroup && selectedGroup.creator === 'You' && (
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() => {
                Alert.alert(
                  'Delete Group',
                  'Are you sure you want to delete this group?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => {
                      setGroupSessions(prev => prev.filter(g => g.id !== selectedGroup.id));
                      setSelectedGroup(null);
                    }},
                  ]
                );
              }}
              accessibilityLabel="Delete Group"
            >
              <Ionicons name="trash" size={20} color="#E53935" />
            </TouchableOpacity>
          )}
        </View>
            {/* Group Contributions Modal */}
            <Modal visible={showContribModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}> 
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Group Contributions</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.text }]}>
                    {isMalayalam ? 'ഗ്രൂപ്പ് അംഗങ്ങളുടെ സംഭാവനകൾ കാണുക' : 'View member contributions to the group'}
                  </Text>
                  {selectedGroup && Array.isArray(selectedGroup.members) && selectedGroup.members.length > 0 && (
                    <>
                      {(selectedGroup.members || []).map((member, idx) => (
                        <View key={member + idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                          <Ionicons name="person" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                          <Text style={{ color: colors.text, fontSize: 16, flex: 1 }}>{member}</Text>
                          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>{(selectedGroup.contributions && selectedGroup.contributions[member]) ?? 0}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.primary,
                      paddingVertical: 16,
                      borderRadius: 12,
                      marginTop: 16,
                      alignSelf: 'center',
                      width: '90%',
                      alignItems: 'center',
                    }}
                    onPress={() => setShowContribModal(false)}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                      {isMalayalam ? 'അടയ്ക്കുക' : 'Close'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
      </View>

      {/* Mode Selection */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            mode === 'individual' && styles.tabActive,
            { backgroundColor: mode === 'individual' ? colors.primary : colors.card },
          ]}
          onPress={() => setMode('individual')}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={18} color={mode === 'individual' ? '#FFFFFF' : colors.text} style={{ marginRight: 6 }} />
          <Text style={[
            styles.tabText,
            { color: mode === 'individual' ? '#FFFFFF' : colors.text },
          ]}>
            {labels.individualMode}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            mode === 'group' && styles.tabActive,
            { backgroundColor: mode === 'group' ? colors.primary : colors.card },
          ]}
          onPress={() => setMode('group')}
          activeOpacity={0.8}
        >
          <Ionicons name="people" size={18} color={mode === 'group' ? '#FFFFFF' : colors.text} style={{ marginRight: 6 }} />
          <Text style={[
            styles.tabText,
            { color: mode === 'group' ? '#FFFFFF' : colors.text },
          ]}>
            {labels.groupMode}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Main Content - No ScrollView, fixed layout for both modes */}
      {mode === 'individual' ? (
        <Animated.View 
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}
          ref={contentRef}
          onLayout={() => {
            if (contentRef.current) {
              contentRef.current.measureInWindow((x, y) => {
                setContentPosition({ x, y });
              });
            }
          }}
        >
          <TouchableWithoutFeedback
            onPress={(event) => {
              const { pageX, pageY } = event.nativeEvent;
              setTouchPos({ x: pageX, y: pageY });
              circleScaleAnim.setValue(0);
              circleOpacityAnim.setValue(0.8);
              Animated.parallel([
                Animated.timing(circleScaleAnim, {
                  toValue: 25, // larger scale for better coverage
                  duration: 300, // faster animation for quick counting
                  useNativeDriver: true,
                }),
                Animated.timing(circleOpacityAnim, {
                  toValue: 0,
                  duration: 300, // faster fade
                  useNativeDriver: true,
                }),
              ]).start();
              handleIncrement();
            }}
          >
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </TouchableWithoutFeedback>
          <View style={[styles.largeCircleWrapper, { marginTop: -20 }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={(event) => {
                const { pageX, pageY } = event.nativeEvent;
                setTouchPos({ x: pageX, y: pageY });
                circleScaleAnim.setValue(0);
                circleOpacityAnim.setValue(0.8);
                Animated.parallel([
                  Animated.timing(circleScaleAnim, {
                    toValue: 25,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(circleOpacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
                handleIncrement();
              }}
              onLongPress={handleReset}
              style={{ borderRadius: 180 }}
            >
              <View
                style={[styles.gradientCircle, { backgroundColor: 'transparent', borderWidth: 8, borderColor: colors.primary }]}
              >
                <View style={[styles.circleGlow, isDark && { borderColor: colors.primary }]}/>
                <Text style={[styles.largeCircleCount, { color: colors.primary, textShadowColor: '#0008', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8 }]}> 
                  {count}
                </Text>
                <Text style={{ fontSize: 13, color: colors.text, marginTop: 2, textAlign: 'center' }}>hold for reset</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        selectedGroup ? (
          <Animated.View 
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingTop: 20, paddingBottom: 20 }}
            onLayout={(event) => {
              const { x, y } = event.nativeEvent.layout;
              setContentPosition({ x, y });
            }}
          >
            <TouchableWithoutFeedback
              onPress={(event) => {
                const { pageX, pageY } = event.nativeEvent;
                setTouchPos({ x: pageX, y: pageY });
                circleScaleAnim.setValue(0);
                circleOpacityAnim.setValue(0.8);
                Animated.parallel([
                  Animated.timing(circleScaleAnim, {
                    toValue: 25,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(circleOpacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
                handleIncrement();
              }}
            >
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableWithoutFeedback>
            {/* Group Name above box */}
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{selectedGroup.name}</Text>
            {/* Group detail box: only main box, no inner boxes */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'stretch',
              alignSelf: 'center',
              width: 320,
              backgroundColor: colors.card,
              borderRadius: 18,
              paddingVertical: 0,
              paddingHorizontal: 0,
              borderWidth: 1,
              borderColor: colors.accent,
              marginBottom: 20,
              overflow: 'hidden',
            }}>
              {/* Left: Person count, centered */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 64 }}>
                <Ionicons name="person" size={22} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.primary, fontSize: 19, fontWeight: '700' }}>{selectedGroup.members.length}</Text>
              </View>
              {/* Separator line */}
              <View style={{ width: 2, height: '100%', backgroundColor: colors.accent }} />
              {/* Right: Code, centered */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 64 }}>
                <Ionicons name="key" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.primary, fontSize: 19, fontWeight: '700', letterSpacing: 1 }}>{selectedGroup.joinCode}</Text>
              </View>
            </View>
            {/* Large Animated Circle Counter */}
            <View style={[styles.largeCircleWrapper, { marginTop: 20, marginBottom: 20 }]}> 
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={(event) => {
                  const { pageX, pageY } = event.nativeEvent;
                  setTouchPos({ x: pageX, y: pageY });
                  circleScaleAnim.setValue(0);
                  circleOpacityAnim.setValue(0.8);
                  Animated.parallel([
                    Animated.timing(circleScaleAnim, {
                      toValue: 25,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.timing(circleOpacityAnim, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  handleIncrement();
                }}
                style={{ borderRadius: 180 }}
              >
                <View
                  style={[styles.gradientCircle, { backgroundColor: 'transparent', borderWidth: 8, borderColor: colors.primary }]}
                >
                  <View style={[styles.circleGlow, isDark && { borderColor: colors.primary }]}/>
                  {selectedGroup.target > 0 && selectedGroup.currentCount === 0 ? (
                    <Text style={[styles.largeCircleCount, { fontSize: 36, color: colors.primary, textShadowColor: '#0008', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8 }]}>Completed!</Text>
                  ) : (
                    <Text style={[styles.largeCircleCount, { color: colors.primary, textShadowColor: '#0008', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8 }]}>{selectedGroup.currentCount}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {/* Target and Progress */}
            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
              <Text style={[styles.largeCircleTarget, { color: colors.text, fontSize: 18 }]}>/ {selectedGroup.target}</Text>
              <View style={[styles.progressContainer, { backgroundColor: colors.accent, marginTop: 4, width: 180, marginBottom: 0 }]}> 
                <Animated.View
                  style={[styles.progressBar, { backgroundColor: colors.primary, width: progressWidth }]}
                />
              </View>
            </View>
            {/* Dhikr type at the bottom in group mode */}
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: colors.primary,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                paddingVertical: 44,
                paddingHorizontal: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.18,
                shadowRadius: 18,
                elevation: 18,
                borderWidth: 0,
                alignItems: 'center',
                marginTop: 20,
              }}
              onLongPress={() => {
                Alert.alert(
                  'Exit Group',
                  'Are you sure you want to exit this group?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', onPress: () => setSelectedGroup(null) },
                  ]
                );
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>{selectedGroup.dhikrType}</Text>
              <Text style={{ fontSize: 13, color: colors.text, textAlign: 'center', marginTop: 6 }}>hold for exit</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* Group Selection */
          groupSessions.length > 0 ? (
            <ScrollView style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 20, paddingTop: 10 }}>
                <Text style={[styles.appTitle, { color: colors.text, textAlign: 'center', marginBottom: 20 }]}>
                  {isMalayalam ? 'നിങ്ങളുടെ തസ്ബീഹ് ഗ്രൂപ്പുകൾ' : 'Your DigiThasbih Groups'}
                </Text>

                {/* Created Groups Section */}
                {(() => {
                  const createdGroups = groupSessions.filter(group => 
                    group.creator === 'You' && !(group.joinedMembers || []).includes('You')
                  );
                  if (createdGroups.length === 0) return null;

                  return (
                    <View style={{ marginBottom: 30 }}>
                      <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
                        {isMalayalam ? 'സൃഷ്ടിച്ച ഗ്രൂപ്പുകൾ' : 'Created Groups'}
                      </Text>
                      {createdGroups.map((group) => {
                        // Calculate progress for countdown mode (groups always count down from target to 0)
                        const progressPercent = group.target > 0 ? 
                          Math.min(Math.round(((group.target - group.currentCount) / group.target) * 100), 100) : 0;
                        
                        const isCompleted = group.target > 0 && group.currentCount === 0;
                        
                        return (
                          <TouchableOpacity
                            key={group.id}
                            style={[styles.groupListItem, { 
                              backgroundColor: colors.card, 
                              marginBottom: 12,
                              borderLeftWidth: 4,
                              borderLeftColor: isCompleted ? colors.primary : colors.secondary
                            }]}
                            onPress={() => setSelectedGroup(group)}
                          >
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={[styles.groupListName, { color: colors.text, flex: 1 }]}>
                                  {group.name}
                                </Text>
                                {isCompleted && (
                                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                )}
                              </View>
                              
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <Ionicons name="people" size={14} color={colors.accent} style={{ marginRight: 4 }} />
                                <Text style={[styles.groupListInfo, { color: colors.accent, fontSize: 13 }]}>
                                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                                </Text>
                              </View>
                              
                              <Text style={[styles.groupListInfo, { color: colors.accent, fontSize: 13, fontStyle: 'italic' }]}>
                                {group.dhikrType}
                              </Text>
                              
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                                  Remaining: {group.currentCount}
                                </Text>
                              </View>
                            </View>
                            
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}>
                              <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderWidth: 3,
                                borderColor: isCompleted ? colors.primary : colors.secondary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 4
                              }}>
                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}>
                                  {progressPercent}%
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })()}

                {/* Joined Groups Section */}
                {(() => {
                  const joinedGroups = groupSessions.filter(group => 
                    (group.joinedMembers || []).includes('You')
                  );
                  if (joinedGroups.length === 0) return null;

                  return (
                    <View style={{ marginBottom: 30 }}>
                      <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
                        {isMalayalam ? 'ചേർന്ന ഗ്രൂപ്പുകൾ' : 'Joined Groups'}
                      </Text>
                      {joinedGroups.map((group) => {
                        // Calculate progress for countdown mode (groups always count down from target to 0)
                        const progressPercent = group.target > 0 ? 
                          Math.min(Math.round(((group.target - group.currentCount) / group.target) * 100), 100) : 0;
                        
                        const isCompleted = group.target > 0 && group.currentCount === 0;
                        
                        return (
                          <TouchableOpacity
                            key={group.id}
                            style={[styles.groupListItem, { 
                              backgroundColor: colors.card, 
                              marginBottom: 12,
                              borderLeftWidth: 4,
                              borderLeftColor: isCompleted ? colors.primary : colors.secondary
                            }]}
                            onPress={() => setSelectedGroup(group)}
                          >
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={[styles.groupListName, { color: colors.text, flex: 1 }]}>
                                  {group.name}
                                </Text>
                                {isCompleted && (
                                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                )}
                              </View>
                              
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <Ionicons name="people" size={14} color={colors.accent} style={{ marginRight: 4 }} />
                                <Text style={[styles.groupListInfo, { color: colors.accent, fontSize: 13 }]}>
                                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                                </Text>
                              </View>
                              
                              <Text style={[styles.groupListInfo, { color: colors.accent, fontSize: 13, fontStyle: 'italic' }]}>
                                {group.dhikrType}
                              </Text>
                              
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                                  Progress: {group.currentCount}/{group.target}
                                </Text>
                              </View>
                            </View>
                            
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}>
                              <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderWidth: 3,
                                borderColor: isCompleted ? colors.primary : colors.secondary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 4
                              }}>
                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}>
                                  {progressPercent}%
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })()}
              </View>
              <View style={{ height: 100 }} />
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
                <TouchableOpacity
                  style={[
                    styles.groupActionButton,
                    {
                      backgroundColor: colors.primary,
                      width: 140,
                      height: 140,
                      borderRadius: 32,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.13,
                      shadowRadius: 10,
                      elevation: 6,
                    },
                  ]}
                  onPress={() => setShowGroupModal(true)}
                  activeOpacity={0.85}
                >
                <Ionicons name="add" size={48} color="#FFFFFF" />
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18, textAlign: 'center', marginTop: 6 }}>{labels.createGroup}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.groupActionButton,
                  {
                    backgroundColor: colors.primary,
                    width: 140,
                    height: 140,
                    borderRadius: 32,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.13,
                    shadowRadius: 10,
                    elevation: 6,
                  },
                ]}
                onPress={() => setShowJoinModal(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="people" size={48} color="#FFFFFF" />
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18, textAlign: 'center', marginTop: 6 }}>{labels.joinGroup}</Text>
              </TouchableOpacity>
            </View>
          </View>
          )
        )
      )}

      {/* Target Modal */}
      <Modal visible={showTargetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {labels.setTarget}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={labels.target}
              placeholderTextColor={colors.text}
              keyboardType="numeric"
              value={individualTarget.toString()}
              onChangeText={text => setIndividualTarget(parseInt(text) || 0)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.card }]}
                onPress={() => setShowTargetModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  {labels.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setShowTargetModal(false);
                  if (individualTarget > 0) {
                    setIsCountdown(true);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>{labels.setTarget}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Group Modal */}
      <Modal visible={showGroupModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {labels.createGroup}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={labels.groupName}
              placeholderTextColor={colors.text}
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={labels.groupTarget + ' (Total Count)'}
              placeholderTextColor={colors.text}
              keyboardType="numeric"
              value={groupTarget}
              onChangeText={setGroupTarget}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Type of Dhikr (e.g. Subhanallah)"
              placeholderTextColor={colors.text}
              value={groupDhikrType}
              onChangeText={setGroupDhikrType}
            />
            {/* Join code is not shown during group creation */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.card }]}
                onPress={() => setShowGroupModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  {labels.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateGroup}
              >
                <Text style={styles.modalButtonText}>{labels.create}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Join Group Modal */}
      <Modal visible={showJoinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {labels.joinGroup}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {isMalayalam ? 'ഗ്രൂപ്പിൽ ചേരാൻ കോഡ് നൽകുക' : 'Enter the code to join a group'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={isMalayalam ? 'നിങ്ങളുടെ പേര്' : 'Your Name'}
              placeholderTextColor={colors.text}
              value={joinNameInput}
              onChangeText={setJoinNameInput}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={isMalayalam ? 'ചേരൽ കോഡ് നൽകുക' : 'Enter Join Code'}
              placeholderTextColor={colors.text}
              value={joinCodeInput}
              onChangeText={setJoinCodeInput}
              autoCapitalize="characters"
              maxLength={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.card }]}
                onPress={() => {
                  setShowJoinModal(false);
                  setJoinCodeInput('');
                  setJoinNameInput('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  {labels.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleJoinByCode}
              >
                <Text style={styles.modalButtonText}>{labels.join}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Group Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isMalayalam ? 'ഗ്രൂപ്പ് ചേർക്കുക' : 'Add Group'}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {isMalayalam ? 'ഒരു പുതിയ ഗ്രൂപ്പ് സൃഷ്ടിക്കുക അല്ലെങ്കിൽ നിലവിലുള്ള ഗ്രൂപ്പിൽ ചേരുക' : 'Create a new group or join an existing one'}
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 20, justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => {
                  setShowAddModal(false);
                  setShowGroupModal(true);
                }}
              >
                <Ionicons name="add-circle" size={32} color="#FFFFFF" style={{ marginBottom: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                  {isMalayalam ? 'സൃഷ്ടിക്കുക' : 'Create'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: colors.secondary,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => {
                  setShowAddModal(false);
                  setShowJoinModal(true);
                }}
              >
                <Ionicons name="enter" size={32} color="#FFFFFF" style={{ marginBottom: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                  {isMalayalam ? 'ചേരുക' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={{
                marginTop: 20,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.accent,
              }}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                {labels.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Group History Modal */}
      <Modal visible={showHistoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Group History
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {isMalayalam ? 'നിങ്ങളുടെ സൃഷ്ടിച്ചയും ചേർന്നയും ഗ്രൂപ്പുകൾ' : 'Your created and joined groups'}
            </Text>
            <ScrollView style={styles.groupList}>
              {groupSessions.length > 0 ? (
                <>
                  {/* Created Groups */}
                  {groupSessions.filter(g => g.members[0] === 'You').length > 0 && (
                    <>
                      <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                        {isMalayalam ? 'സൃഷ്ടിച്ച ഗ്രൂപ്പുകൾ' : 'Created Groups'}
                      </Text>
                      {groupSessions.filter(g => g.members[0] === 'You').map((group) => (
                        <View key={group.id} style={{ position: 'relative' }}>
                          <TouchableOpacity
                            style={[styles.groupListItem, { backgroundColor: colors.card }]}
                            onPress={() => {
                              setSelectedGroup(group);
                              setShowHistoryModal(false);
                            }}
                          >
                            <View>
                              <Text style={[styles.groupListName, { color: colors.text }]}> 
                                {group.name}
                              </Text>
                              <Text style={[styles.groupListInfo, { color: colors.accent, flexDirection: 'row', alignItems: 'center' }]}> 
                                <Ionicons name="person" size={15} color={colors.accent} style={{ marginRight: 2, marginBottom: -2 }} />
                                {group.members.length}
                                <Text>  </Text>
                                <Ionicons name="flag-outline" size={15} color={colors.accent} style={{ marginRight: 2, marginBottom: -2 }} />
                                {group.target}
                                <Text>  </Text>
                                {group.dhikrType}
                              </Text>
                            </View>
                            {/* No arrow icon, only delete icon for admin */}
                          </TouchableOpacity>
                          <View style={{ position: 'absolute', right: 8, top: 0, bottom: 0, justifyContent: 'center', zIndex: 2 }}>
                            <TouchableOpacity
                              style={{ padding: 4 }}
                              onPress={() => {
                                // Confirm delete
                                Alert.alert(
                                  'Delete Group',
                                  'Are you sure you want to delete this group?',
                                  [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: () => {
                                      setGroupSessions(prev => prev.filter(g => g.id !== group.id));
                                      if (selectedGroup && selectedGroup.id === group.id) setSelectedGroup(null);
                                    }},
                                  ]
                                );
                              }}
                              accessibilityLabel="Delete Group"
                            >
                              <Ionicons name="trash" size={20} color="#E53935" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                  {/* Joined Groups */}
                  {groupSessions.filter(g => g.members[0] !== 'You').length > 0 && (
                    <>
                      <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                        {isMalayalam ? 'ചേർന്ന ഗ്രൂപ്പുകൾ' : 'Joined Groups'}
                      </Text>
                      {groupSessions.filter(g => g.members[0] !== 'You').map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          style={[styles.groupListItem, { backgroundColor: colors.card }]}
                          onPress={() => {
                            setSelectedGroup(group);
                            setShowHistoryModal(false);
                          }}
                        >
                          <View>
                            <Text style={[styles.groupListName, { color: colors.text }]}>
                              {group.name}
                            </Text>
                            <Text style={[styles.groupListInfo, { color: colors.accent }]}>
                              {group.members.length} members • Target: {group.target} • {group.dhikrType}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <Text style={[styles.noGroupsText, { color: colors.accent }]}>
                  {isMalayalam ? 'ഗ്രൂപ്പ് ചരിത്രം ലഭ്യമല്ല' : 'No group history'}
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 12,
                marginTop: 16,
                alignSelf: 'center',
                width: '90%',
                alignItems: 'center',
              }}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                {isMalayalam ? 'അടയ്ക്കുക' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Expanding Circle Effect */}
      {touchPos && (
        <Animated.View
          style={{
            position: 'absolute',
            left: touchPos.x - 50,
            top: touchPos.y - 50,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: isDark ? 'white' : 'rgba(0,0,0,0.1)',
            opacity: circleOpacityAnim,
            transform: [{ scale: circleScaleAnim }],
            zIndex: -1, // behind the content
          }}
        />
      )}

    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    borderColor: '#2E7D32',
    elevation: 3,
    shadowOpacity: 0.12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  content: {
    alignItems: 'center',
  },
  circleContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    width: '100%',
  },
  largeCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginTop: 100,
  },
  gradientCircle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#43cea2',
    // shadowOffset: { width: 0, height: 12 },
    // shadowOpacity: 0.25,
    // shadowRadius: 32,
    // elevation: 18,
    borderWidth: 0,
    position: 'relative',
  },
  circleGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 170,
    borderWidth: 8,
    borderColor: '#fff6',
    opacity: 0.5,
    zIndex: 0,
  },
  largeCircleCount: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  largeCircleTarget: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.7,
  },
  circleActionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  countLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  countNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 18,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 32,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  counterButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  groupCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupSelection: {
    width: '100%',
    gap: 16,
  },
  groupActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: colors.card,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  groupList: {
    maxHeight: 300,
    marginBottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
  groupListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 64,
    width: '100%',
    alignSelf: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  groupListName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'left',
    width: 180,
  },
  groupListInfo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
    width: 180,
  },
  noGroupsText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
});