import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { loadThasbihData, saveThasbihData, ThasbihData } from '@/utils/thasbih-storage';

export default function ThasbihScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneCount, setMilestoneCount] = useState(0);
  const [slideAnim] = useState(new Animated.Value(300)); // Start below screen

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedData = await loadThasbihData();
      setCount(loadedData.count);
    } catch (error) {
      console.error('Error loading thasbih data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCount = async (newCount: number) => {
    try {
      const data: ThasbihData = {
        count: newCount,
        lastUpdated: new Date().toISOString(),
        selectedDhikr: 'سبحان الله',
      };
      await saveThasbihData(data);
    } catch (error) {
      console.error('Error saving thasbih data:', error);
    }
  };

  const incrementCount = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await saveCount(newCount);
    
    // Check for milestones
    const milestones = [33, 66, 99, 100, 200, 300, 500, 1000];
    if (milestones.includes(newCount)) {
      setMilestoneCount(newCount);
      setShowMilestone(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetCount = () => {
    Alert.alert(
      isMalayalam ? 'റീസെറ്റ് ചെയ്യുക' : 'Reset Counter',
      isMalayalam ? 'കൗണ്ടർ റീസെറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ?' : 'Are you sure you want to reset the counter?',
      [
        { text: isMalayalam ? 'ക്യാൻസൽ' : 'Cancel', style: 'cancel' },
        {
          text: isMalayalam ? 'റീസെറ്റ്' : 'Reset',
          style: 'destructive',
          onPress: async () => {
            setCount(0);
            await saveCount(0);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const hideMilestone = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowMilestone(false));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {isMalayalam ? 'ലോഡിംഗ്...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Progress calculation (towards 100)
  const progress = Math.min((count % 100) / 100, 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Simple Counter */}
      <View style={styles.centerContainer}>
        <View style={styles.progressRingContainer}>
          {/* Glowing progress ring */}
          <View style={[styles.progressRing, { shadowOpacity: progress * 0.8 }]} />
          <TouchableOpacity
            style={[styles.counterCircle, { backgroundColor: '#004D40' }]}
            onPress={incrementCount}
            onLongPress={resetCount}
            activeOpacity={0.8}
          >
            <View style={styles.counterContent}>
              <Text style={[styles.countNumber, { color: '#FFD700' }]}>
                {count.toLocaleString()}
              </Text>
              <Text style={[styles.countLabel, { color: '#FAFAFA' }]}>
                {isMalayalam ? 'എണ്ണം' : 'Count'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Milestone Card */}
      {showMilestone && (
        <Animated.View style={[styles.milestoneCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.milestoneContent}>
            <View style={styles.milestoneHeader}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.milestoneTitle}>
                {isMalayalam ? 'മൈൽസ്റ്റോൺ!' : 'Milestone!'}
              </Text>
            </View>
            <Text style={styles.milestoneCount}>
              {milestoneCount.toLocaleString()}
            </Text>
            <Text style={styles.milestoneText}>
              {isMalayalam ? 'എണ്ണങ്ങൾ പൂർത്തിയായി!' : 'Counts Completed!'}
            </Text>
            <TouchableOpacity style={styles.milestoneButton} onPress={hideMilestone}>
              <Text style={styles.milestoneButtonText}>
                {isMalayalam ? 'തുടരുക' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 10,
  },
  counterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  counterContent: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  countLabel: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  milestoneCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#004D40',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  milestoneContent: {
    alignItems: 'center',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  milestoneCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 20,
  },
  milestoneButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  milestoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004D40',
  },
});