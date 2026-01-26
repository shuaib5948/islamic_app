import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
      title: 'Thasbih Counter',
      titleMl: 'Thasbih Counter',
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

        {/* Daily Hadith Card */}
        <View style={[styles.hadithCard, { backgroundColor: colors.hadith }]}> 
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
});
