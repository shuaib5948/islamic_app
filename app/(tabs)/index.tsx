import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { GuidanceContent, MOOD_GUIDANCE } from '@/data/reflection-guidance';
import { REFLECTION_QUESTIONS } from '@/data/reflection-questions';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 56) / 3; // 3 columns with padding

// Daily Hadith collection with Malayalam
const DAILY_HADITHS = [
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    english: 'Actions are judged by intentions.',
    malayalam: 'പ്രവൃത്തികൾ നിയ്യത്തിനെ ആശ്രയിച്ചിരിക്കുന്നു.',
    source: 'Bukhari & Muslim',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Quran and teach it.',
    malayalam: 'നിങ്ങളിൽ ഏറ്റവും ഉത്തമർ ഖുർആൻ പഠിക്കുകയും പഠിപ്പിക്കുകയും ചെയ്യുന്നവരാണ്.',
    source: 'Bukhari',
  },
  {
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    english: 'A Muslim is one from whose tongue and hand others are safe.',
    malayalam: 'മുസ്‌ലിം എന്നാൽ ആരുടെ നാവിൽ നിന്നും കൈയിൽ നിന്നും മറ്റുള്ളവർ സുരക്ഷിതരാണോ അവനാണ്.',
    source: 'Bukhari & Muslim',
  },
  {
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    malayalam: 'അല്ലാഹുവിലും അന്ത്യദിനത്തിലും വിശ്വസിക്കുന്നവൻ നല്ലത് പറയട്ടെ അല്ലെങ്കിൽ മിണ്ടാതിരിക്കട്ടെ.',
    source: 'Bukhari & Muslim',
  },
  {
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english: 'None of you truly believes until he loves for his brother what he loves for himself.',
    malayalam: 'തനിക്ക് ഇഷ്ടപ്പെടുന്നത് സഹോദരന് ഇഷ്ടപ്പെടുന്നത് വരെ നിങ്ങളിൽ ആരും യഥാർത്ഥ വിശ്വാസിയാവില്ല.',
    source: 'Bukhari & Muslim',
  },
  {
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    english: 'Cleanliness is half of faith.',
    malayalam: 'ശുചിത്വം ഈമാനിന്റെ പകുതിയാണ്.',
    source: 'Muslim',
  },
  {
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    english: 'Your smile for your brother is charity.',
    malayalam: 'നിന്റെ സഹോദരനോടുള്ള പുഞ്ചിരി ദാനധർമ്മമാണ്.',
    source: 'Tirmidhi',
  },
  {
    arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    english: 'The world is a prison for the believer and paradise for the disbeliever.',
    malayalam: 'ദുനിയാവ് മുഅ്മിനിന് തടവറയും കാഫിറിന് സ്വർഗവുമാണ്.',
    source: 'Muslim',
  },
  {
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    english: 'Whoever takes a path seeking knowledge, Allah will ease for him a path to Paradise.',
    malayalam: 'അറിവ് തേടി ഒരു പാത സ്വീകരിക്കുന്നവന് അല്ലാഹു സ്വർഗത്തിലേക്കുള്ള വഴി എളുപ്പമാക്കും.',
    source: 'Muslim',
  },
  {
    arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    english: 'A good word is charity.',
    malayalam: 'നല്ല വാക്ക് ദാനധർമ്മമാണ്.',
    source: 'Bukhari & Muslim',
  },
];

// Get daily hadith based on day of year
const getDailyHadith = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_HADITHS[dayOfYear % DAILY_HADITHS.length];
};

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  titleMl: string;
  color: string;
  onPress: () => void;
  isMalayalam: boolean;
  colors: any;
  isLast?: boolean;
}

const FeatureCard = ({ icon, title, titleMl, color, onPress, isMalayalam, colors, isLast }: FeatureCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          width: CARD_SIZE,
          height: CARD_SIZE,
          marginLeft: isLast ? (width - CARD_SIZE) / 2 - 12 : 4, // Center the last card
          marginRight: isLast ? (width - CARD_SIZE) / 2 - 12 : 4,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={[styles.cardTitle, { color: colors.text }]}>
        {isMalayalam ? titleMl : title}
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';
  const colors = isDark ? Colors.dark : Colors.light;

  const [showReflection, setShowReflection] = useState(false);
  const [reflectionStep, setReflectionStep] = useState<'question' | 'mood' | 'guidance'>('question');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [guidance, setGuidance] = useState<GuidanceContent | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const question = REFLECTION_QUESTIONS[currentQuestionIndex % REFLECTION_QUESTIONS.length];

  // Auto-switch between hadith and reflection every 8 seconds
  // But don't switch if user is actively in reflection steps (mood selection or guidance)
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't auto-switch if user is in mood selection or viewing guidance
      if (showReflection && (reflectionStep === 'mood' || reflectionStep === 'guidance')) {
        return; // Skip this auto-switch cycle
      }

      setShowReflection(prev => {
        const willShowReflection = !prev;
        if (willShowReflection) {
          // Reset reflection state when switching to reflection
          setReflectionStep('question');
          setSelectedMood('');
          setGuidance(null);
          // Move to next question each time reflection appears
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
        return willShowReflection;
      });
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [showReflection, reflectionStep]);

  const handleReflectContinue = () => {
    setReflectionStep('mood');
  };

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setGuidance(MOOD_GUIDANCE[mood]);
    setReflectionStep('guidance');
  };

  const handleComplete = async () => {
    // Show guidance for a moment, then move to next question
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1); // Move to next question
      setReflectionStep('question');
      setSelectedMood('');
      setGuidance(null);
    }, 3000); // Show guidance for 3 seconds before moving to next question
  };

  const moods = [
    { key: 'Happy', icon: 'happy-outline', label: isMalayalam ? 'സന്തുഷ്ടം' : 'Happy' },
    { key: 'Sad', icon: 'sad-outline', label: isMalayalam ? 'ദുഃഖം' : 'Sad' },
    { key: 'Angry', icon: 'flame-outline', label: isMalayalam ? 'കോപം' : 'Angry' },
    { key: 'Worried', icon: 'warning-outline', label: isMalayalam ? 'ചിന്താകുലം' : 'Worried' },
    { key: 'Calm', icon: 'leaf-outline', label: isMalayalam ? 'ശാന്തം' : 'Calm' },
    { key: 'Tired', icon: 'battery-dead-outline', label: isMalayalam ? 'ക്ഷീണം' : 'Tired' },
    { key: 'Lonely', icon: 'person-outline', label: isMalayalam ? 'ഏകാന്തം' : 'Lonely' },
    { key: 'Confused', icon: 'help-circle-outline', label: isMalayalam ? 'ആശയക്കുഴപ്പം' : 'Confused' },
  ];

  const features = [
    {
      icon: 'moon-outline',
      title: 'Hijri Calendar',
      titleMl: 'Hijri Calendar',
      color: colors.primary,
      route: '/calendar' as const,
    },
    {
      icon: 'calendar-outline',
      title: 'Islamic Events',
      titleMl: 'Islamic Events',
      color: colors.primary,
      route: '/events' as const,
    },
    {
      icon: 'repeat-outline',
      title: 'Adhkar',
      titleMl: 'Adhkar',
      color: colors.primary,
      route: '/dhikr' as const,
    },
    {
      icon: 'calculator-outline',
      title: 'DigiThasbih',
      titleMl: 'DigiThasbih',
      color: colors.primary,
      route: '/thasbih' as const,
    },
    {
      icon: 'scale-outline',
      title: 'Farā\'iḍ',
      titleMl: 'Farā\'iḍ',
      color: colors.primary,
      route: '/faraid' as const,
    },
    {
      icon: 'book-outline',
      title: 'Quran Khatam',
      titleMl: 'Quran Khatam',
      color: colors.primary,
      route: '/khatam' as const,
    },
    {
      icon: 'home-outline',
      title: 'Prayer Tracker',
      titleMl: 'Prayer Tracker',
      color: colors.primary,
      route: '/prayer' as const,
    },
  ] as const;

  const dailyHadith = getDailyHadith();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.primary }]}> 
            بسم الله الرحمن الرحيم
          </Text>
          <Text style={[styles.appTitle, { color: colors.text }]}> 
            {isMalayalam ? 'RuhTrack' : 'RuhTrack'}
          </Text>
        </View>

        {/* Daily Hadith/Reflection Card */}
        <View style={[styles.hadithCard, { backgroundColor: colors.hadith }]}>
          {/* Content indicator */}
          <View style={styles.contentIndicator}>
            <View style={[styles.indicatorDot, { backgroundColor: showReflection ? colors.primary : 'transparent' }]} />
            <View style={[styles.indicatorDot, { backgroundColor: !showReflection ? colors.primary : 'transparent' }]} />
          </View>

          {showReflection ? (
            // Reflection Content
            <>
              {reflectionStep === 'question' && (
                <>
                  <View style={styles.hadithHeader}>
                    <Ionicons name="heart-outline" size={18} color={colors.hadithText} style={styles.hadithIcon} />
                    <Text style={[styles.hadithLabel, { color: colors.hadithText }]}>
                      {isMalayalam ? 'ഇന്നത്തെ ചിന്ത' : 'Daily Reflection'}
                    </Text>
                  </View>
                  <Text style={[styles.reflectionQuestion, { color: colors.hadithText }]}>
                    {question}
                  </Text>
                  <TouchableOpacity
                    style={[styles.reflectButton, { backgroundColor: colors.primary }]}
                    onPress={handleReflectContinue}
                  >
                    <Text style={styles.reflectButtonText}>
                      {isMalayalam ? 'ചിന്തിച്ച് തുടരുക' : 'Reflect & Continue'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {reflectionStep === 'mood' && (
                <>
                  <View style={styles.hadithHeader}>
                    <Ionicons name="happy-outline" size={18} color={colors.hadithText} style={styles.hadithIcon} />
                    <Text style={[styles.hadithLabel, { color: colors.hadithText }]}>
                      {isMalayalam ? 'നിങ്ങളുടെ മാനസികാവസ്ഥ എന്താണ്?' : 'How are you feeling?'}
                    </Text>
                  </View>
                  <View style={styles.moodGrid}>
                    {moods.map((mood) => (
                      <TouchableOpacity
                        key={mood.key}
                        style={[styles.moodButton, { backgroundColor: colors.card }]}
                        onPress={() => handleMoodSelect(mood.key)}
                      >
                        <Ionicons name={mood.icon as any} size={20} color={colors.primary} />
                        <Text style={[styles.moodText, { color: colors.text }]}>{mood.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {reflectionStep === 'guidance' && guidance && (
                <>
                  <View style={styles.hadithHeader}>
                    <Ionicons name="book-outline" size={18} color={colors.hadithText} style={styles.hadithIcon} />
                    <Text style={[styles.hadithLabel, { color: colors.hadithText }]}>
                      {isMalayalam ? 'നിങ്ങൾക്കുള്ള മാർഗനിർദ്ദേശം' : 'Guidance for You'}
                    </Text>
                  </View>
                  <ScrollView style={styles.guidanceScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.guidanceSection}>
                      <Text style={[styles.guidanceTitle, { color: colors.primary }]}>
                        {isMalayalam ? 'ഖുർആൻ' : 'Quranic Motivation'}
                      </Text>
                      <Text style={[styles.guidanceArabic, { color: colors.hadithText }]}>
                        {guidance.quran.arabic}
                      </Text>
                      <Text style={[styles.guidanceEnglish, { color: colors.accent }]}>
                        {guidance.quran.english}
                      </Text>
                      <Text style={[styles.guidanceSource, { color: colors.hadithText }]}>
                        — {guidance.quran.reference}
                      </Text>
                    </View>

                    <View style={styles.guidanceSection}>
                      <Text style={[styles.guidanceTitle, { color: colors.primary }]}>
                        {isMalayalam ? 'ധിക്ര്' : 'Dhikr'}
                      </Text>
                      <Text style={[styles.guidanceArabic, { color: colors.hadithText }]}>
                        {guidance.dhikr.arabic}
                      </Text>
                      <Text style={[styles.guidanceEnglish, { color: colors.accent }]}>
                        {guidance.dhikr.english}
                      </Text>
                      <Text style={[styles.guidanceTransliteration, { color: colors.hadithText }]}>
                        {guidance.dhikr.transliteration}
                      </Text>
                    </View>

                    <View style={styles.guidanceSection}>
                      <Text style={[styles.guidanceTitle, { color: colors.primary }]}>
                        {isMalayalam ? 'ഹദീസ്' : 'Hadith'}
                      </Text>
                      <Text style={[styles.guidanceArabic, { color: colors.hadithText }]}>
                        {guidance.hadith.arabic}
                      </Text>
                      <Text style={[styles.guidanceEnglish, { color: colors.accent }]}>
                        {guidance.hadith.english}
                      </Text>
                      <Text style={[styles.guidanceSource, { color: colors.hadithText }]}>
                        — {guidance.hadith.source}
                      </Text>
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.completeButton, { backgroundColor: colors.primary }]}
                    onPress={handleComplete}
                  >
                    <Text style={styles.completeButtonText}>
                      {isMalayalam ? 'പൂർത്തിയാക്കുക' : 'Complete Reflection'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            // Daily Hadith Content
            <>
              <View style={styles.hadithHeader}>
                <Ionicons name="document-text-outline" size={18} color={colors.hadithText} style={styles.hadithIcon} />
                <Text style={[styles.hadithLabel, { color: colors.hadithText }]}>
                  {isMalayalam ? 'ഇന്നത്തെ ഹദീസ്' : 'Daily Hadith'}
                </Text>
              </View>
              <Text style={[styles.hadithArabic, { color: colors.hadithText }]}>
                {dailyHadith.arabic}
              </Text>
              <Text style={[styles.hadithEnglish, { color: colors.accent }]}>
                {isMalayalam ? dailyHadith.malayalam : dailyHadith.english}
              </Text>
              <Text style={[styles.hadithSource, { color: colors.hadithText }]}>
                — {dailyHadith.source}
              </Text>
            </>
          )}
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              titleMl={feature.titleMl}
              color={feature.color}
              onPress={() => router.push(feature.route)}
              isMalayalam={isMalayalam}
              colors={colors}
              isLast={index === features.length - 1}
            />
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 6,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  // Hadith Card Styles
  hadithCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hadithHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hadithIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  hadithLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hadithArabic: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  hadithEnglish: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  hadithSource: {
    fontSize: 11,
    textAlign: 'right',
    fontWeight: '500',
  },
  // Grid Styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  // cardTitleArabic removed
  // Content indicator
  contentIndicator: {
    position: 'absolute',
    top: 12,
    right: 16,
    flexDirection: 'row',
    gap: 4,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  // Reflection Styles
  reflectionQuestion: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  reflectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  reflectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  moodButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moodText: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  guidanceScroll: {
    maxHeight: 200,
  },
  guidanceSection: {
    marginBottom: 12,
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  guidanceArabic: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  guidanceEnglish: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 4,
  },
  guidanceTransliteration: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
    opacity: 0.8,
  },
  guidanceSource: {
    fontSize: 11,
    textAlign: 'right',
    fontWeight: '500',
  },
  completeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 12,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
