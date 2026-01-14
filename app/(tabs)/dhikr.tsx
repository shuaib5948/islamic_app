import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

interface DhikrItem {
  id: string;
  category: string;
  title: string;
  titleArabic: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count?: number;
  virtue?: string;
}

const DAILY_ADHKAR: DhikrItem[] = [
  {
    id: '1',
    category: 'Morning',
    title: 'Ayatul Kursi',
    titleArabic: 'آية الكرسي',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allahu la ilaha illa huwa, Al-Hayyul-Qayyum...',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
    count: 1,
    virtue: 'Protection from Satan until evening/morning',
  },
  {
    id: '2',
    category: 'Morning & Evening',
    title: 'Sayyid al-Istighfar',
    titleArabic: 'سيد الاستغفار',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wadika mastata\'tu...',
    translation: 'O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant...',
    count: 1,
    virtue: 'Whoever says it during the day with firm faith and dies that day before evening, will be among the people of Paradise',
  },
  {
    id: '3',
    category: 'Morning & Evening',
    title: 'Tasbih, Tahmid, Takbir',
    titleArabic: 'التسبيح والتحميد والتكبير',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    translation: 'Glory be to Allah and praise be to Him',
    count: 100,
    virtue: 'Sins forgiven even if like the foam of the sea',
  },
  {
    id: '4',
    category: 'Morning & Evening',
    title: 'La ilaha illAllah',
    titleArabic: 'لا إله إلا الله',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir',
    translation: 'None has the right to be worshipped except Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things.',
    count: 100,
    virtue: 'Equivalent to freeing 10 slaves, 100 good deeds recorded, 100 sins erased, protection from Satan',
  },
  {
    id: '5',
    category: 'After Salah',
    title: 'Istighfar',
    titleArabic: 'الاستغفار',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    count: 3,
  },
  {
    id: '6',
    category: 'After Salah',
    title: 'Tasbeeh after Salah',
    titleArabic: 'التسبيح بعد الصلاة',
    arabic: 'سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (34)',
    transliteration: 'SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34)',
    translation: 'Glory be to Allah (33), Praise be to Allah (33), Allah is the Greatest (34)',
    count: 100,
  },
  {
    id: '7',
    category: 'Friday',
    title: 'Salawat on Friday',
    titleArabic: 'الصلاة على النبي يوم الجمعة',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid',
    translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
    virtue: 'Abundant rewards on Friday, the best day',
  },
  {
    id: '8',
    category: 'Protection',
    title: 'Surah Al-Ikhlas, Al-Falaq, An-Nas',
    titleArabic: 'المعوذات',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Qul huwa Allahu ahad... Qul audhu bi rabbil falaq... Qul audhu bi rabbin nas',
    translation: 'The three Quls - Surah Al-Ikhlas, Al-Falaq, and An-Nas',
    count: 3,
    virtue: 'Suffices you in all matters (morning and evening)',
  },
];

export default function DhikrScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const categories = [...new Set(DAILY_ADHKAR.map(item => item.category))];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            📿 Daily Adhkar
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            الأذكار اليومية
          </Text>
        </View>

        {/* Introduction */}
        <View style={[styles.introCard, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
          <Text style={[styles.introTitle, { color: isDark ? '#FFFFFF' : '#1B5E20' }]}>
            ✨ The Importance of Dhikr
          </Text>
          <Text style={[styles.introText, { color: isDark ? 'rgba(255,255,255,0.9)' : '#2E7D32' }]}>
            "Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)
          </Text>
          <Text style={[styles.introTextArabic, { color: isDark ? 'rgba(255,255,255,0.9)' : '#1B5E20' }]}>
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </Text>
        </View>

        {/* Dhikr by Category */}
        {categories.map(category => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              {category === 'Morning' ? '🌅 ' : 
               category === 'Morning & Evening' ? '🌅🌙 ' :
               category === 'After Salah' ? '🕌 ' :
               category === 'Friday' ? '📅 ' :
               category === 'Protection' ? '🛡️ ' : ''}
              {category}
            </Text>
            
            {DAILY_ADHKAR.filter(item => item.category === category).map(dhikr => (
              <View 
                key={dhikr.id} 
                style={[styles.dhikrCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
              >
                <View style={styles.dhikrHeader}>
                  <Text style={[styles.dhikrTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    {dhikr.title}
                  </Text>
                  {dhikr.count && (
                    <View style={[styles.countBadge, { backgroundColor: isDark ? '#2E7D32' : '#E8F5E9' }]}>
                      <Text style={[styles.countText, { color: isDark ? '#FFFFFF' : '#2E7D32' }]}>
                        ×{dhikr.count}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.dhikrTitleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                  {dhikr.titleArabic}
                </Text>
                
                <View style={[styles.arabicContainer, { backgroundColor: isDark ? '#263238' : '#FAFAFA' }]}>
                  <Text style={[styles.arabicText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    {dhikr.arabic}
                  </Text>
                </View>
                
                <Text style={[styles.transliteration, { color: isDark ? '#B0BEC5' : '#616161' }]}>
                  {dhikr.transliteration}
                </Text>
                
                <Text style={[styles.translation, { color: isDark ? '#9E9E9E' : '#757575' }]}>
                  {dhikr.translation}
                </Text>
                
                {dhikr.virtue && (
                  <View style={[styles.virtueContainer, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
                    <Text style={[styles.virtueLabel, { color: isDark ? '#81C784' : '#2E7D32' }]}>
                      ✨ Virtue:
                    </Text>
                    <Text style={[styles.virtueText, { color: isDark ? 'rgba(255,255,255,0.9)' : '#1B5E20' }]}>
                      {dhikr.virtue}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 100 }} />
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'right',
    marginTop: 4,
  },
  introCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  introTextArabic: {
    fontSize: 20,
    textAlign: 'right',
    marginTop: 12,
    lineHeight: 32,
  },
  categorySection: {
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  dhikrCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dhikrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dhikrTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dhikrTitleArabic: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 12,
  },
  arabicContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'right',
  },
  transliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translation: {
    fontSize: 14,
    lineHeight: 20,
  },
  virtueContainer: {
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
  },
  virtueLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  virtueText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
