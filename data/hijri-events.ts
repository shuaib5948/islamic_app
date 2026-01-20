/**
 * Hijri Calendar Events Data
 * Contains important Islamic days, wafat dates, and special duas/dhikr
 */

export interface IslamicEvent {
  id: string;
  month: number; // Hijri month (1-12)
  day: number;
  title: string;
  titleArabic: string;
  type: 'religious' | 'wafat' | 'birth' | 'historic';
  description: string;
  importance: 'high' | 'medium' | 'low';
  dhikr?: string[];
  dua?: string[];
  aurad?: string[];
  specialPractices?: string[];
  references?: string[];
}

export const HIJRI_MONTHS = [
  { number: 1, name: 'Muharram', arabic: 'محرم' },
  { number: 2, name: 'Safar', arabic: 'صفر' },
  { number: 3, name: 'Rabi al-Awwal', arabic: 'ربيع الأول' },
  { number: 4, name: 'Rabi al-Thani', arabic: 'ربيع الثاني' },
  { number: 5, name: 'Jumada al-Awwal', arabic: 'جمادى الأولى' },
  { number: 6, name: 'Jumada al-Thani', arabic: 'جمادى الآخرة' },
  { number: 7, name: 'Rajab', arabic: 'رجب' },
  { number: 8, name: 'Shaban', arabic: 'شعبان' },
  { number: 9, name: 'Ramadan', arabic: 'رمضان' },
  { number: 10, name: 'Shawwal', arabic: 'شوال' },
  { number: 11, name: 'Dhul Qadah', arabic: 'ذو القعدة' },
  { number: 12, name: 'Dhul Hijjah', arabic: 'ذو الحجة' },
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  // MUHARRAM
  {
    id: 'new-year',
    month: 1,
    day: 1,
    title: 'Islamic New Year',
    titleArabic: 'رأس السنة الهجرية',
    type: 'religious',
    description: 'The first day of Muharram marks the beginning of the Islamic New Year. It commemorates the Hijra (migration) of Prophet Muhammad ﷺ from Makkah to Madinah in 622 CE. This event marks the beginning of the Islamic calendar and represents a new beginning for Muslims worldwide.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ أَدْخِلْهُ عَلَيْنَا بِالأَمْنِ وَالإِيمَانِ وَالسَّلامَةِ وَالإِسْلامِ وَرِضْوَانٍ مِنَ الرَّحْمَنِ وَجِوَارٍ مِنَ الشَّيْطَانِ',
      'Allahumma adkhilhu alayna bil-amni wal-iman was-salamati wal-islam wa ridwanin minar-Rahman wa jiwarin minash-Shaytan',
    ],
    specialPractices: ['Fasting', 'Reflection on the Hijra', 'Making good intentions for the new year'],
  },
  {
    id: 'ashura',
    month: 1,
    day: 10,
    title: 'Day of Ashura',
    titleArabic: 'يوم عاشوراء',
    type: 'religious',
    description: 'Ashura is one of the most significant days in the Islamic calendar. It marks the day when Allah saved Prophet Musa (Moses) and the Children of Israel from Pharaoh. Prophet Muhammad ﷺ recommended fasting on this day. For Shia Muslims, it also commemorates the martyrdom of Imam Hussain (RA) at Karbala.',
    importance: 'high',
    dhikr: [
      'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير',
      'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir',
    ],
    dua: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      'Allahumma innaka Afuwwun tuhibbul-afwa fafu anni',
    ],
    specialPractices: ['Fasting on 9th and 10th Muharram', 'Extra prayers', 'Charity', 'Remembrance of sacrifice'],
  },

  // SAFAR
  {
    id: 'wafat-ali-rida',
    month: 2,
    day: 29,
    title: 'Wafat of Imam Ali al-Rida',
    titleArabic: 'وفاة الإمام علي الرضا',
    type: 'wafat',
    description: 'Imam Ali ibn Musa al-Rida (RA) was the eighth Imam in Shia Islam and a respected scholar. He was known for his deep knowledge, piety, and noble character. He passed away in 818 CE in Tus, Iran.',
    importance: 'medium',
  },

  // RABI AL-AWWAL
  {
    id: 'mawlid-nabi',
    month: 3,
    day: 12,
    title: 'Mawlid al-Nabi (Prophet\'s Birthday)',
    titleArabic: 'المولد النبوي الشريف',
    type: 'birth',
    description: 'Mawlid al-Nabi celebrates the birth of Prophet Muhammad ﷺ, the final messenger of Allah. Born in Makkah in 570 CE (Year of the Elephant), the Prophet brought the message of Islam to humanity. This day is celebrated with gatherings, recitation of his biography (Sirah), sending salawat, and acts of charity.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
      'Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid',
    ],
    dua: [
      'اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
      'Allahumma barik ala Muhammadin wa ala ali Muhammad, kama barakta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid',
    ],
    aurad: [
      'صَلَّى اللهُ عَلَيْهِ وَسَلَّم - Sallallahu alayhi wa sallam (1000 times)',
    ],
    specialPractices: ['Reciting Salawat abundantly', 'Reading Sirah', 'Charity', 'Gatherings of remembrance'],
  },
  {
    id: 'wafat-prophet',
    month: 3,
    day: 12,
    title: 'Wafat of Prophet Muhammad ﷺ',
    titleArabic: 'وفاة النبي محمد ﷺ',
    type: 'wafat',
    description: 'Prophet Muhammad ﷺ passed away on 12 Rabi al-Awwal, 11 AH (632 CE) in Madinah. His departure was a great loss for the Muslim Ummah. He left behind the Quran and his Sunnah as guidance for all times.',
    importance: 'high',
    dhikr: [
      'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
      'Inna lillahi wa inna ilayhi rajiun',
    ],
    specialPractices: ['Reciting Salawat', 'Reading about his life', 'Following his Sunnah'],
  },

  // RAJAB
  {
    id: 'raghaib',
    month: 7,
    day: 1,
    title: 'First Friday of Rajab (Laylat al-Raghaib)',
    titleArabic: 'ليلة الرغائب',
    type: 'religious',
    description: 'The first Friday night of Rajab is known as Laylat al-Raghaib. Rajab is one of the four sacred months in Islam. It is recommended to increase worship, fasting, and good deeds during this blessed month.',
    importance: 'medium',
    dhikr: [
      'رَجَبٌ شَهْرُ اللهِ، وَشَعْبَانُ شَهْرِي، وَرَمَضَانُ شَهْرُ أُمَّتِي',
      'Rajab is Allah\'s month, Shaban is my month, and Ramadan is the month of my Ummah',
    ],
    specialPractices: ['Fasting', 'Night prayers', 'Seeking forgiveness'],
  },
  {
    id: 'isra-miraj',
    month: 7,
    day: 27,
    title: 'Isra and Mi\'raj (Night Journey)',
    titleArabic: 'الإسراء والمعراج',
    type: 'religious',
    description: 'Laylat al-Isra wal-Mi\'raj commemorates the miraculous night journey of Prophet Muhammad ﷺ from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem (Isra), and then his ascension through the heavens to meet Allah (Mi\'raj). During this journey, the five daily prayers were prescribed. This event demonstrates the Prophet\'s exalted status and the importance of prayer in Islam. It occurred approximately one year before the Hijra.',
    importance: 'high',
    dhikr: [
      'سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى',
      'Subhanal-ladhi asra bi abdihi laylan minal-masjidil-harami ilal-masjidil-aqsa',
      'Glory be to Him who took His servant by night from the Sacred Mosque to the Farthest Mosque',
    ],
    dua: [
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ',
      'Allahumma inni asalukal-jannata wa ma qarraba ilayha min qawlin aw amal',
    ],
    aurad: [
      'Surah Al-Isra (Chapter 17) - especially the first verse',
      'Salat al-Tasbeeh',
    ],
    specialPractices: [
      'Night prayers (Tahajjud)',
      'Reciting Surah Al-Isra',
      'Reflecting on the gift of Salah',
      'Fasting (recommended)',
      'Seeking forgiveness',
    ],
  },

  // SHABAN
  {
    id: 'shab-e-barat',
    month: 8,
    day: 15,
    title: 'Shab-e-Barat (Night of Forgiveness)',
    titleArabic: 'ليلة النصف من شعبان',
    type: 'religious',
    description: 'The 15th night of Shaban, known as Shab-e-Barat or Laylat al-Nisf min Shaban, is considered a night of forgiveness and blessings. It is believed that Allah descends to the lowest heaven and forgives those who seek forgiveness. Many Muslims spend this night in prayer and worship.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      'Allahumma innaka Afuwwun Karimun tuhibbul-afwa fafu anni',
      'O Allah, You are Most Forgiving, Most Generous, You love to forgive, so forgive me',
    ],
    dua: [
      'اللَّهُمَّ إِنْ كُنْتَ كَتَبْتَنِي عِنْدَكَ فِي أُمِّ الْكِتَابِ شَقِيًّا أَوْ مَحْرُومًا أَوْ مَطْرُودًا أَوْ مُقَتَّرًا عَلَيَّ فِي الرِّزْقِ فَامْحُ اللَّهُمَّ بِفَضْلِكَ شَقَاوَتِي وَحِرْمَانِي وَطَرْدِي وَإِقْتَارَ رِزْقِي',
    ],
    specialPractices: ['Night prayers', 'Fasting on 15th Shaban', 'Visiting graves', 'Seeking forgiveness'],
  },

  // RAMADAN
  {
    id: 'ramadan-start',
    month: 9,
    day: 1,
    title: 'Beginning of Ramadan',
    titleArabic: 'بداية شهر رمضان',
    type: 'religious',
    description: 'The blessed month of Ramadan begins. Muslims worldwide observe fasting from dawn to sunset, increase in worship, recite Quran, and engage in acts of charity. Ramadan is the month in which the Quran was revealed.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ',
      'Allahumma ahillahu alayna bil-yumni wal-iman was-salamati wal-islam, Rabbi wa Rabbuk Allah',
    ],
    dua: [
      'اللَّهُمَّ بَلِّغْنَا رَمَضَان',
      'Allahumma ballighna Ramadan - O Allah, let us reach Ramadan',
    ],
    specialPractices: ['Fasting', 'Tarawih prayers', 'Quran recitation', 'Charity', 'I\'tikaf'],
  },
  {
    id: 'laylatul-qadr',
    month: 9,
    day: 27,
    title: 'Laylat al-Qadr (Night of Power)',
    titleArabic: 'ليلة القدر',
    type: 'religious',
    description: 'Laylat al-Qadr is the most blessed night of the year, better than a thousand months. It is the night when the Quran was first revealed to Prophet Muhammad ﷺ. Angels descend on this night, and it is a time of immense blessings and forgiveness. It occurs in the last ten nights of Ramadan, most likely on odd nights (21st, 23rd, 25th, 27th, or 29th).',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      'Allahumma innaka Afuwwun tuhibbul-afwa fafu anni',
      'O Allah, You are Most Forgiving, and You love forgiveness, so forgive me',
    ],
    aurad: [
      'Surah Al-Qadr (Chapter 97)',
      'Last 10 Surahs of Quran',
    ],
    specialPractices: ['Night prayers', 'Quran recitation', 'Dua', 'I\'tikaf', 'Seeking forgiveness'],
  },

  // SHAWWAL
  {
    id: 'eid-fitr',
    month: 10,
    day: 1,
    title: 'Eid al-Fitr',
    titleArabic: 'عيد الفطر',
    type: 'religious',
    description: 'Eid al-Fitr marks the end of Ramadan and is a day of celebration, gratitude, and joy. Muslims gather for Eid prayer, give Zakat al-Fitr (charity), wear new clothes, and celebrate with family and friends. Fasting is prohibited on this day.',
    importance: 'high',
    dhikr: [
      'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
      'Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar, Allahu Akbar, Wa lillahil-hamd',
    ],
    dua: [
      'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
      'Taqabbal Allahu minna wa minkum - May Allah accept from us and from you',
    ],
    specialPractices: ['Eid prayer', 'Zakat al-Fitr', 'Visiting relatives', 'Giving gifts'],
  },

  // DHUL QADAH
  {
    id: 'start-hajj-months',
    month: 11,
    day: 1,
    title: 'Beginning of Hajj Season',
    titleArabic: 'بداية أشهر الحج',
    type: 'religious',
    description: 'Dhul Qadah is one of the four sacred months and marks the beginning of the Hajj season. It is a time of preparation for those planning to perform the pilgrimage.',
    importance: 'medium',
    specialPractices: ['Preparation for Hajj', 'Increased worship'],
  },

  // DHUL HIJJAH
  {
    id: 'day-arafah',
    month: 12,
    day: 9,
    title: 'Day of Arafah',
    titleArabic: 'يوم عرفة',
    type: 'religious',
    description: 'The Day of Arafah is the most important day of Hajj and one of the best days of the year. Pilgrims gather at the plain of Arafah for the most essential ritual of Hajj. For those not performing Hajj, fasting on this day expiates sins of the previous and coming year.',
    importance: 'high',
    dhikr: [
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir',
    ],
    dua: [
      'خَيْرُ الدُّعَاءِ دُعَاءُ يَوْمِ عَرَفَةَ',
      'The best dua is the dua of the Day of Arafah',
    ],
    specialPractices: ['Fasting (for non-pilgrims)', 'Abundant dua', 'Dhikr', 'Seeking forgiveness'],
  },
  {
    id: 'eid-adha',
    month: 12,
    day: 10,
    title: 'Eid al-Adha',
    titleArabic: 'عيد الأضحى',
    type: 'religious',
    description: 'Eid al-Adha, the Festival of Sacrifice, commemorates Prophet Ibrahim\'s willingness to sacrifice his son Ismail in obedience to Allah. Muslims perform Eid prayer, sacrifice an animal (Qurbani), and share the meat with family, friends, and the poor.',
    importance: 'high',
    dhikr: [
      'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
      'Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar, Allahu Akbar, Wa lillahil-hamd',
    ],
    specialPractices: ['Eid prayer', 'Qurbani (sacrifice)', 'Takbeer', 'Visiting family'],
  },
  {
    id: 'tashriq-days',
    month: 12,
    day: 11,
    title: 'Days of Tashriq (11-13 Dhul Hijjah)',
    titleArabic: 'أيام التشريق',
    type: 'religious',
    description: 'The Days of Tashriq are the three days following Eid al-Adha (11th, 12th, and 13th of Dhul Hijjah). These are days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.',
    importance: 'medium',
    dhikr: [
      'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    ],
    specialPractices: ['Takbeer after prayers', 'Celebration', 'Remembrance of Allah'],
  },

  // WAFAT OF NOTABLE FIGURES
  {
    id: 'wafat-abu-bakr',
    month: 8,
    day: 22,
    title: 'Wafat of Abu Bakr al-Siddiq (RA)',
    titleArabic: 'وفاة أبو بكر الصديق',
    type: 'wafat',
    description: 'Abu Bakr al-Siddiq (RA) was the closest companion of Prophet Muhammad ﷺ and the first Caliph of Islam. Known for his unwavering faith, he was titled "al-Siddiq" (the Truthful). He passed away in 634 CE after leading the Muslim community for about two years.',
    importance: 'high',
  },
  {
    id: 'wafat-umar',
    month: 1,
    day: 26,
    title: 'Wafat of Umar ibn al-Khattab (RA)',
    titleArabic: 'وفاة عمر بن الخطاب',
    type: 'wafat',
    description: 'Umar ibn al-Khattab (RA), the second Caliph of Islam, was known for his justice, strength, and expansion of the Islamic state. He was martyred in 644 CE while leading the Fajr prayer.',
    importance: 'high',
  },
  {
    id: 'wafat-uthman',
    month: 12,
    day: 18,
    title: 'Wafat of Uthman ibn Affan (RA)',
    titleArabic: 'وفاة عثمان بن عفان',
    type: 'wafat',
    description: 'Uthman ibn Affan (RA), the third Caliph of Islam, was known for his generosity and for compiling the Quran into a single book. He was martyred in 656 CE.',
    importance: 'high',
  },
  {
    id: 'wafat-ali',
    month: 9,
    day: 21,
    title: 'Wafat of Ali ibn Abi Talib (RA)',
    titleArabic: 'وفاة علي بن أبي طالب',
    type: 'wafat',
    description: 'Ali ibn Abi Talib (RA), the fourth Caliph of Islam and cousin and son-in-law of the Prophet ﷺ, was known for his knowledge, bravery, and eloquence. He was martyred in 661 CE during the Fajr prayer.',
    importance: 'high',
  },
  {
    id: 'wafat-fatima',
    month: 6,
    day: 3,
    title: 'Wafat of Fatimah al-Zahra (RA)',
    titleArabic: 'وفاة فاطمة الزهراء',
    type: 'wafat',
    description: 'Fatimah al-Zahra (RA), the beloved daughter of Prophet Muhammad ﷺ, was known for her piety, patience, and devotion. She passed away a few months after her father in 632 CE.',
    importance: 'high',
  },
  {
    id: 'wafat-khadija',
    month: 9,
    day: 10,
    title: 'Wafat of Khadijah bint Khuwaylid (RA)',
    titleArabic: 'وفاة خديجة بنت خويلد',
    type: 'wafat',
    description: 'Khadijah (RA), the first wife of Prophet Muhammad ﷺ and the first person to embrace Islam, was known for her support, wisdom, and devotion. She passed away in the Year of Sorrow, approximately 619 CE.',
    importance: 'high',
  },
  {
    id: 'wafat-hussain',
    month: 1,
    day: 10,
    title: 'Martyrdom of Imam Hussain (RA)',
    titleArabic: 'شهادة الإمام الحسين',
    type: 'wafat',
    description: 'Imam Hussain (RA), the grandson of Prophet Muhammad ﷺ, was martyred at Karbala on the Day of Ashura in 680 CE. His sacrifice stands as a symbol of standing up against injustice and oppression.',
    importance: 'high',
  },
  {
    id: 'wafat-imam-ghazali',
    month: 5,
    day: 14,
    title: 'Wafat of Imam al-Ghazali',
    titleArabic: 'وفاة الإمام الغزالي',
    type: 'wafat',
    description: 'Imam Abu Hamid al-Ghazali (1058-1111 CE) was one of the greatest Islamic scholars, philosophers, and mystics. His work "Ihya Ulum al-Din" (Revival of Religious Sciences) remains influential to this day.',
    importance: 'medium',
  },
  {
    id: 'wafat-sainul-ulama-cherushseri',
    month: 10,
    day: 13,
    title: "Wafat of Sainul Ulama Cherushseri Sainuddheen Musliyar",
    titleArabic: 'وفاة سَينُول العلماء تشيروشيري سَينُدّين مُسلّيَار',
    type: 'wafat',
    description: "Sainul Ulama Cherushseri Sainuddheen Musliyar was a prominent scholar who served as General Secretary of Samastha Kerala Jamiyyathul Ulama for around 20 years. Born in Morayur, Malappuram in Rajab 20, 1356 AH (October 1937) into a scholarly family, he began teaching at Kondotty Juma Masjid at a young age. He joined Samastha's central mushawara in 1980 and was appointed General Secretary in 1996. He served as Pro-Chancellor of Darul Huda Islamic University, served as Qazi for many mahalls, and chaired the federation's fatwa committee. He passed away on Shawwal 13, 1437 AH (18 February 2016) and was buried at the Chemmad Darul Huda campus.",
    importance: 'high',
    dhikr: ['إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ'],
    specialPractices: ['Prayers and remembrance sessions', 'Visiting the grave and making dua'],
    references: ['Chemmad Darul Huda', 'Samasta Kerala Jamiyyathul Ulama']
  },
  {
    id: 'wafat-km-bafaqi-thangal',
    month: 12,
    day: 14,
    title: 'Wafat of K. M. Bafaqi Thangal',
    titleArabic: '',
    type: 'wafat',
    description: "K. M. Bafaqi Thangal (born Rajab 20, 1324 AH / Feb 1906) was a prominent community and political leader from Koyilandy. He dedicated his life to the religious and social uplift of the community and played a central role in founding educational institutions and Samastha's education board. He passed away on Dhul Hijjah 14, 1392 AH (19 January 1973) during Hajj in Makkah.",
    importance: 'high',
  },
  {
    id: 'wafat-abdul-bari',
    month: 3,
    day: 20,
    title: 'Wafat of Abdul Bari Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Abdul Bari Musliyar (born Rabi al-Thani 10, 1298 AH / Feb 1881) was a respected scholar from Panayikulam and a leading figure in Samastha; he served as General Secretary from 1951 to 1963. He passed away on Rabi al-Awwal 20, 1385 AH (19 July 1965).",
    importance: 'high',
  },
  {
    id: 'wafat-ek-abubacker',
    month: 4,
    day: 4,
    title: 'Wafat of E.K. Abubacker Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "E.K. Abubacker Musliyar (born Rabi al-Awwal 1333 AH / 1914) served as General Secretary of Samastha for about 40 years (1957–1996). A leading scholar in Quran, Hadith and Fiqh, he passed away on Rabi al-Thani 4, 1417 AH (19 August 1996).",
    importance: 'high',
  },
  {
    id: 'wafat-ok-sainuddheen',
    month: 10,
    day: 27,
    title: 'Wafat of O.K. Sainuddheen Kutti Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "O.K. Sainuddheen Kutti Musliyar (born 1331 AH) was a distinguished teacher and scholar who served in Vazhakad Darul Uloom and Parappanangadi Pallidars; he passed away on Shawwal 27, 1412 AH (May 1992).",
    importance: 'high',
  },
  {
    id: 'wafat-kc-jamaluddin',
    month: 10,
    day: 27,
    title: 'Wafat of K.C. Jamaluddin Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "K.C. Jamaluddin Musliyar, a vice-president of Samastha and senior jurist, passed away on Shawwal 27, 1432 AH (26 September 2011).",
    importance: 'medium',
  },
  {
    id: 'wafat-kalambadi-muhammad',
    month: 11,
    day: 16,
    title: 'Wafat of Kalambadi Muhammad Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Kalambadi Muhammad Musliyar (born 1935) served as Samastha's eighth president and passed away on Dhul Qadah 16, 1433 AH (2 October 2012).",
    importance: 'medium',
  },
  {
    id: 'wafat-nellikuth-ismail',
    month: 1,
    day: 24,
    title: 'Wafat of Nellikuth Ismail Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Nellikuth Ismail Musliyar (born 1940) was a noted scholar and lexicographer; he passed away on Muharram 24, 1431 AH (10 January 2010).",
    importance: 'medium',
  },
  {
    id: 'wafat-anakkara-c-koyakkutti',
    month: 7,
    day: 25,
    title: 'Wafat of Anakkara C. Koyakkutti Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Anakkara C. Koyakkutti Musliyar (born 1934) was Samastha's ninth president and a close student of Sheikhunnah Kanniyath Ahmad; he passed away on Rajab 25, 1437 AH (3 May 2016).",
    importance: 'medium',
  },
  {
    id: 'wafat-tkm-bava',
    month: 8,
    day: 7,
    title: 'Wafat of T.K.M. Bava Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "T.K.M. Bava Musliyar (born 1930) was a former Samastha president and education board inspector; he passed away on Shaban 7, 1434 AH (16 June 2013).",
    importance: 'medium',
  },
  {
    id: 'wafat-ap-kunjamu',
    month: 4,
    day: 10,
    title: 'Wafat of A.P. Kunjamu Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "A.P. Kunjamu Musliyar (born 1361 AH / 1942) was a respected spiritual leader; he passed away on Rabi al-Thani 10, 1440 AH (18 December 2018).",
    importance: 'medium',
  },
  {
    id: 'wafat-sayyid-ahmad-bukhari',
    month: 4,
    day: 18,
    title: 'Wafat of Sayyid Ahmad Jalaluddin al-Bukhari',
    titleArabic: '',
    type: 'wafat',
    description: "Sayyid Ahmad Jalaluddin al-Bukhari (historic figure) is remembered as a Sufi saint whose maqam at Kadalundi Bandar receives many visitors; traditional records note his passing on Rabi al-Thani 18.",
    importance: 'medium',
  },
  {
    id: 'wafat-varakkal-mullakkoya',
    month: 8,
    day: 17,
    title: 'Wafat of Varakkal Mullakkoya Thangal',
    titleArabic: '',
    type: 'wafat',
    description: "Varakkal Mullakkoya Thangal (1840–1932) was a foundational religious leader in Malabar and Samastha's founding president; he passed away on Shaban 17.",
    importance: 'high',
  },
  {
    id: 'wafat-pangil-ahmad-kutty',
    month: 12,
    day: 25,
    title: 'Wafat of Pangil Ahmad Kutty Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Pangil Ahmad Kutty Musliyar (born 1888) played a major role in structuring Samastha and passed away on Dhul Hijjah 25.",
    importance: 'medium',
  },
  {
    id: 'wafat-kanniyath-ahmad',
    month: 4,
    day: 2,
    title: 'Wafat of Kanniyath Ahmad Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Kanniyath Ahmad Musliyar (1900–1993) was a major scholar and former Samastha president; he passed away on Rabi al-Thani 2.",
    importance: 'high',
  },
  {
    id: 'wafat-chappanangadi-bappu',
    month: 12,
    day: 26,
    title: 'Wafat of Shaikhuna Chappanangadi Bappu Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "Shaikhuna Chappanangadi Bappu Musliyar (1933–2002) was a noted Sufi scholar and member of Samastha's central mushawara; he passed away on Dhul Hijjah 26.",
    importance: 'medium',
  },
  {
    id: 'wafat-kk-abubacker-hasrath',
    month: 7,
    day: 16,
    title: 'Wafat of K.K. Abubacker Hasrath',
    titleArabic: '',
    type: 'wafat',
    description: "K.K. Abubacker Hasrath was a significant leader in northern Malabar and passed away on Rajab 16.",
    importance: 'medium',
  },
  {
    id: 'wafat-ek-hassan',
    month: 10,
    day: 25,
    title: 'Wafat of E.K. Hassan Musliyar',
    titleArabic: '',
    type: 'wafat',
    description: "E.K. Hassan Musliyar (1920–1982) was a key organizer and leader in Samastha; he passed away on Shawwal 25.",
    importance: 'medium',
  },
  {
    id: 'wafat-panakkad-shihab',
    month: 8,
    day: 10,
    title: 'Wafat of Panakkad Sayyid Muhammadali Shihab Thangal',
    titleArabic: '',
    type: 'wafat',
    description: "Panakkad Sayyid Muhammadali Shihab Thangal (1945–2009) was a spiritual and political leader; he passed away on Shaban 10.",
    importance: 'high',
  },
  {
    id: 'wafat-abdul-qadir',
    month: 9,
    day: 11,
    title: 'Wafat of Sheikh Abdul Qadir Jilani',
    titleArabic: 'وفاة الشيخ عبد القادر الجيلاني',
    type: 'wafat',
    description: 'Sheikh Abdul Qadir Jilani (1077-1166 CE) was a renowned Islamic scholar and Sufi saint from Baghdad. He founded the Qadiriyya Sufi order and was known as "Ghaus al-Azam" (the Supreme Helper).',
    importance: 'medium',
  },
];

// Helper function to get events for a specific date
export const getEventsForDate = (month: number, day: number): IslamicEvent[] => {
  return ISLAMIC_EVENTS.filter(event => event.month === month && event.day === day);
};

// Helper function to get events for a specific month
export const getEventsForMonth = (month: number): IslamicEvent[] => {
  return ISLAMIC_EVENTS.filter(event => event.month === month);
};

// Helper function to get upcoming events
export const getUpcomingEvents = (currentMonth: number, currentDay: number, count: number = 5): IslamicEvent[] => {
  const allEvents = [...ISLAMIC_EVENTS].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  const currentIndex = allEvents.findIndex(
    event => event.month > currentMonth || (event.month === currentMonth && event.day >= currentDay)
  );

  if (currentIndex === -1) {
    return allEvents.slice(0, count);
  }

  const upcoming = allEvents.slice(currentIndex, currentIndex + count);
  if (upcoming.length < count) {
    upcoming.push(...allEvents.slice(0, count - upcoming.length));
  }

  return upcoming;
};
