/**
 * Malayalam translations for Islamic Events
 */

export const HIJRI_MONTHS_ML = [
  { number: 1, name: 'മുഹർറം', nameEn: 'Muharram', arabic: 'محرم' },
  { number: 2, name: 'സഫർ', nameEn: 'Safar', arabic: 'صفر' },
  { number: 3, name: 'റബീഉൽ അവ്വൽ', nameEn: 'Rabi al-Awwal', arabic: 'ربيع الأول' },
  { number: 4, name: 'റബീഉൽ ആഖിർ', nameEn: 'Rabi al-Thani', arabic: 'ربيع الثاني' },
  { number: 5, name: 'ജമാദുൽ അവ്വൽ', nameEn: 'Jumada al-Awwal', arabic: 'جمادى الأولى' },
  { number: 6, name: 'ജമാദുൽ ആഖിർ', nameEn: 'Jumada al-Thani', arabic: 'جمادى الآخرة' },
  { number: 7, name: 'റജബ്', nameEn: 'Rajab', arabic: 'رجب' },
  { number: 8, name: 'ശഅ്ബാൻ', nameEn: 'Shaban', arabic: 'شعبان' },
  { number: 9, name: 'റമദാൻ', nameEn: 'Ramadan', arabic: 'رمضان' },
  { number: 10, name: 'ശവ്വാൽ', nameEn: 'Shawwal', arabic: 'شوال' },
  { number: 11, name: 'ദുൽഖഅദ', nameEn: 'Dhul Qadah', arabic: 'ذو القعدة' },
  { number: 12, name: 'ദുൽഹിജ്ജ', nameEn: 'Dhul Hijjah', arabic: 'ذو الحجة' },
];

export interface IslamicEventML {
  id: string;
  month: number;
  day: number;
  title: string;
  titleMl: string;
  titleArabic: string;
  type: 'religious' | 'wafat' | 'birth' | 'historic';
  description: string;
  descriptionMl: string;
  importance: 'high' | 'medium' | 'low';
  dhikr?: string[];
  dua?: string[];
  aurad?: string[];
  specialPractices?: string[];
  specialPracticesMl?: string[];
  references?: string[];
}

export const ISLAMIC_EVENTS_ML: IslamicEventML[] = [
  // MUHARRAM
  {
    id: 'new-year',
    month: 1,
    day: 1,
    title: 'Islamic New Year',
    titleMl: 'ഇസ്ലാമിക പുതുവർഷം',
    titleArabic: 'رأس السنة الهجرية',
    type: 'religious',
    description: 'The first day of Muharram marks the beginning of the Islamic New Year.',
    descriptionMl: 'മുഹർറം മാസത്തിന്റെ ആദ്യ ദിവസം ഇസ്ലാമിക പുതുവർഷത്തിന്റെ ആരംഭം അടയാളപ്പെടുത്തുന്നു. ഇത് നബി മുഹമ്മദ് ﷺ മക്കയിൽ നിന്ന് മദീനയിലേക്കുള്ള ഹിജ്‌റയെ (പലായനം) അനുസ്മരിക്കുന്നു.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ أَدْخِلْهُ عَلَيْنَا بِالأَمْنِ وَالإِيمَانِ وَالسَّلامَةِ وَالإِسْلامِ',
    ],
    specialPractices: ['Fasting', 'Reflection on the Hijra', 'Making good intentions for the new year'],
    specialPracticesMl: ['നോമ്പ്', 'ഹിജ്റയെക്കുറിച്ചുള്ള ചിന്തനം', 'പുതുവർഷത്തേക്കുള്ള നല്ല നിയ്യത്തുകൾ'],
  },
  {
    id: 'ashura',
    month: 1,
    day: 10,
    title: 'Day of Ashura',
    titleMl: 'ആശൂറാ ദിനം',
    titleArabic: 'يوم عاشوراء',
    type: 'religious',
    description: 'Ashura marks the day when Allah saved Prophet Musa and the Children of Israel from Pharaoh.',
    descriptionMl: 'അല്ലാഹു മൂസാ നബിയെയും ഇസ്രായേൽ മക്കളെയും ഫറോവയിൽ നിന്ന് രക്ഷിച്ച ദിവസമാണ് ആശൂറാ. നബി ﷺ ഈ ദിവസം നോമ്പ് അനുഷ്ഠിക്കാൻ ശുപാർശ ചെയ്തു.',
    importance: 'high',
    dhikr: [
      'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير',
    ],
    dua: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    ],
    specialPractices: ['Fasting on 9th and 10th Muharram', 'Extra prayers', 'Charity'],
    specialPracticesMl: ['മുഹർറം 9, 10 തീയതികളിൽ നോമ്പ്', 'അധിക നമസ്കാരങ്ങൾ', 'ദാനധർമ്മം'],
  },
  // RABI AL-AWWAL
  {
    id: 'mawlid-nabi',
    month: 3,
    day: 12,
    title: 'Mawlid al-Nabi (Prophet\'s Birthday)',
    titleMl: 'മൗലിദ് അന്നബി (നബിദിനം)',
    titleArabic: 'المولد النبوي الشريف',
    type: 'birth',
    description: 'Mawlid al-Nabi celebrates the birth of Prophet Muhammad ﷺ.',
    descriptionMl: 'മൗലിദ് അന്നബി നബി മുഹമ്മദ് ﷺ യുടെ ജനനം ആഘോഷിക്കുന്നു. 570 CE-യിൽ മക്കയിൽ ജനിച്ച നബി ﷺ മനുഷ്യരാശിക്ക് ഇസ്ലാമിന്റെ സന്ദേശം എത്തിച്ചു.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    ],
    specialPractices: ['Reciting Salawat abundantly', 'Reading Sirah', 'Charity', 'Gatherings of remembrance'],
    specialPracticesMl: ['സ്വലാത്ത് ധാരാളമായി ചൊല്ലുക', 'സീറ വായിക്കുക', 'ദാനധർമ്മം', 'സ്മരണാ സദസ്സുകൾ'],
  },
  {
    id: 'wafat-prophet',
    month: 3,
    day: 12,
    title: 'Wafat of Prophet Muhammad ﷺ',
    titleMl: 'നബി മുഹമ്മദ് ﷺ യുടെ വഫാത്ത്',
    titleArabic: 'وفاة النبي محمد ﷺ',
    type: 'wafat',
    description: 'Prophet Muhammad ﷺ passed away on 12 Rabi al-Awwal, 11 AH (632 CE) in Madinah.',
    descriptionMl: 'നബി മുഹമ്മദ് ﷺ 11 AH റബീഉൽ അവ്വൽ 12-ന് (632 CE) മദീനയിൽ വഫാത്തായി. ഖുർആനും സുന്നത്തും മാർഗദർശനമായി അദ്ദേഹം വിട്ടുപോയി.',
    importance: 'high',
    dhikr: [
      'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    ],
    specialPractices: ['Reciting Salawat', 'Reading about his life', 'Following his Sunnah'],
    specialPracticesMl: ['സ്വലാത്ത് ചൊല്ലുക', 'അദ്ദേഹത്തിന്റെ ജീവിതം വായിക്കുക', 'സുന്നത്ത് പിന്തുടരുക'],
  },
  // RAJAB
  {
    id: 'isra-miraj',
    month: 7,
    day: 27,
    title: 'Isra and Mi\'raj (Night Journey)',
    titleMl: 'ഇസ്‌റാ മിഅ്‌റാജ് (രാത്രി യാത്ര)',
    titleArabic: 'الإسراء والمعراج',
    type: 'religious',
    description: 'Commemorates the miraculous night journey of Prophet Muhammad ﷺ from Makkah to Jerusalem and ascension to heavens.',
    descriptionMl: 'നബി മുഹമ്മദ് ﷺ യുടെ മക്കയിൽ നിന്ന് ജെറുസലേമിലേക്കുള്ള (ഇസ്‌റാ) അത്ഭുത രാത്രി യാത്രയും ആകാശങ്ങളിലേക്കുള്ള കയറ്റവും (മിഅ്‌റാജ്) അനുസ്മരിക്കുന്നു. ഈ യാത്രയിലാണ് അഞ്ച് നേരത്തെ നമസ്കാരം നിർബന്ധമാക്കിയത്.',
    importance: 'high',
    dhikr: [
      'سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى',
    ],
    specialPractices: ['Night prayers (Tahajjud)', 'Reciting Surah Al-Isra', 'Reflecting on the gift of Salah', 'Fasting'],
    specialPracticesMl: ['രാത്രി നമസ്കാരം (തഹജ്ജുദ്)', 'സൂറത്തുൽ ഇസ്‌റാ പാരായണം', 'നമസ്കാരത്തിന്റെ അനുഗ്രഹത്തെക്കുറിച്ചുള്ള ചിന്തനം', 'നോമ്പ്'],
  },
  // SHABAN
  {
    id: 'shab-e-barat',
    month: 8,
    day: 15,
    title: 'Shab-e-Barat (Night of Forgiveness)',
    titleMl: 'ശബ്-ഇ-ബറാഅത്ത് (പൊറുക്കലിന്റെ രാത്രി)',
    titleArabic: 'ليلة النصف من شعبان',
    type: 'religious',
    description: 'The 15th night of Shaban is considered a night of forgiveness and blessings.',
    descriptionMl: 'ശഅ്ബാൻ 15-ന്റെ രാത്രി പാപമോചനത്തിന്റെയും അനുഗ്രഹങ്ങളുടെയും രാത്രിയായി കണക്കാക്കപ്പെടുന്നു. അല്ലാഹു ഏറ്റവും താഴ്ന്ന ആകാശത്തേക്ക് ഇറങ്ങിവരുമെന്നും പാപമോചനം തേടുന്നവർക്ക് മാപ്പ് നൽകുമെന്നും വിശ്വസിക്കപ്പെടുന്നു.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    ],
    specialPractices: ['Night prayers', 'Fasting on 15th Shaban', 'Visiting graves', 'Seeking forgiveness'],
    specialPracticesMl: ['രാത്രി നമസ്കാരങ്ങൾ', 'ശഅ്ബാൻ 15-ന് നോമ്പ്', 'ഖബർ സിയാറത്ത്', 'പാപമോചനം തേടൽ'],
  },
  // RAMADAN
  {
    id: 'ramadan-start',
    month: 9,
    day: 1,
    title: 'Beginning of Ramadan',
    titleMl: 'റമദാൻ ആരംഭം',
    titleArabic: 'بداية شهر رمضان',
    type: 'religious',
    description: 'The blessed month of Ramadan begins. Muslims worldwide observe fasting from dawn to sunset.',
    descriptionMl: 'അനുഗ്രഹീതമായ റമദാൻ മാസം ആരംഭിക്കുന്നു. ലോകമെമ്പാടുമുള്ള മുസ്ലിംകൾ പ്രഭാതം മുതൽ സൂര്യാസ്തമയം വരെ നോമ്പ് അനുഷ്ഠിക്കുന്നു.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ',
    ],
    specialPractices: ['Fasting', 'Tarawih prayers', 'Quran recitation', 'Charity', 'I\'tikaf'],
    specialPracticesMl: ['നോമ്പ്', 'തറാവീഹ് നമസ്കാരം', 'ഖുർആൻ പാരായണം', 'ദാനധർമ്മം', 'ഇഅ്തികാഫ്'],
  },
  {
    id: 'laylatul-qadr',
    month: 9,
    day: 27,
    title: 'Laylat al-Qadr (Night of Power)',
    titleMl: 'ലൈലത്തുൽ ഖദ്ർ (നിർണ്ണയ രാത്രി)',
    titleArabic: 'ليلة القدر',
    type: 'religious',
    description: 'Laylat al-Qadr is the most blessed night of the year, better than a thousand months.',
    descriptionMl: 'ലൈലത്തുൽ ഖദ്ർ വർഷത്തിലെ ഏറ്റവും അനുഗ്രഹീതമായ രാത്രിയാണ്, ആയിരം മാസങ്ങളേക്കാൾ ഉത്തമം. ഖുർആൻ ആദ്യമായി അവതരിച്ച രാത്രിയാണിത്.',
    importance: 'high',
    dhikr: [
      'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    ],
    specialPractices: ['Night prayers', 'Quran recitation', 'Dua', 'I\'tikaf', 'Seeking forgiveness'],
    specialPracticesMl: ['രാത്രി നമസ്കാരങ്ങൾ', 'ഖുർആൻ പാരായണം', 'ദുആ', 'ഇഅ്തികാഫ്', 'പാപമോചനം തേടൽ'],
  },
  // SHAWWAL
  {
    id: 'eid-fitr',
    month: 10,
    day: 1,
    title: 'Eid al-Fitr',
    titleMl: 'ഈദുൽ ഫിത്ർ (ചെറിയ പെരുന്നാൾ)',
    titleArabic: 'عيد الفطر',
    type: 'religious',
    description: 'Eid al-Fitr marks the end of Ramadan and is a day of celebration, gratitude, and joy.',
    descriptionMl: 'ഈദുൽ ഫിത്ർ റമദാന്റെ അവസാനം അടയാളപ്പെടുത്തുന്നു, ആഘോഷത്തിന്റെയും നന്ദിയുടെയും സന്തോഷത്തിന്റെയും ദിവസമാണ്.',
    importance: 'high',
    dhikr: [
      'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    ],
    dua: [
      'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
    ],
    specialPractices: ['Eid prayer', 'Zakat al-Fitr', 'Visiting relatives', 'Giving gifts'],
    specialPracticesMl: ['ഈദ് നമസ്കാരം', 'ഫിത്ർ സകാത്ത്', 'ബന്ധുക്കളെ സന്ദർശിക്കൽ', 'സമ്മാനങ്ങൾ നൽകൽ'],
  },
  // DHUL HIJJAH
  {
    id: 'day-arafah',
    month: 12,
    day: 9,
    title: 'Day of Arafah',
    titleMl: 'അറഫാ ദിനം',
    titleArabic: 'يوم عرفة',
    type: 'religious',
    description: 'The Day of Arafah is the most important day of Hajj and one of the best days of the year.',
    descriptionMl: 'അറഫാ ദിനം ഹജ്ജിന്റെ ഏറ്റവും പ്രധാനപ്പെട്ട ദിവസവും വർഷത്തിലെ ഏറ്റവും മികച്ച ദിവസങ്ങളിലൊന്നുമാണ്. ഈ ദിവസം നോമ്പ് അനുഷ്ഠിക്കുന്നത് കഴിഞ്ഞ വർഷത്തെയും വരാനിരിക്കുന്ന വർഷത്തെയും പാപങ്ങൾ പൊറുക്കും.',
    importance: 'high',
    dhikr: [
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    ],
    specialPractices: ['Fasting (for non-pilgrims)', 'Abundant dua', 'Dhikr', 'Seeking forgiveness'],
    specialPracticesMl: ['നോമ്പ് (ഹാജിമാർ അല്ലാത്തവർക്ക്)', 'ധാരാളം ദുആ', 'ദിക്ർ', 'പാപമോചനം തേടൽ'],
  },
  {
    id: 'eid-adha',
    month: 12,
    day: 10,
    title: 'Eid al-Adha',
    titleMl: 'ഈദുൽ അദ്ഹാ (ബലിപെരുന്നാൾ)',
    titleArabic: 'عيد الأضحى',
    type: 'religious',
    description: 'Eid al-Adha, the Festival of Sacrifice, commemorates Prophet Ibrahim\'s willingness to sacrifice his son.',
    descriptionMl: 'ഈദുൽ അദ്ഹാ, ബലിയുടെ ആഘോഷം, ഇബ്രാഹീം നബി തന്റെ മകൻ ഇസ്മാഈലിനെ ബലിയർപ്പിക്കാനുള്ള സന്നദ്ധതയെ അനുസ്മരിക്കുന്നു.',
    importance: 'high',
    dhikr: [
      'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    ],
    specialPractices: ['Eid prayer', 'Qurbani (sacrifice)', 'Takbeer', 'Visiting family'],
    specialPracticesMl: ['ഈദ് നമസ്കാരം', 'ഖുർബാനി (ബലി)', 'തക്ബീർ', 'കുടുംബത്തെ സന്ദർശിക്കൽ'],
  },
  // WAFAT OF NOTABLE FIGURES
  {
    id: 'wafat-abu-bakr',
    month: 8,
    day: 22,
    title: 'Wafat of Abu Bakr al-Siddiq (RA)',
    titleMl: 'അബൂബക്കർ സിദ്ദീഖ് (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة أبو بكر الصديق',
    type: 'wafat',
    description: 'Abu Bakr al-Siddiq (RA) was the closest companion of Prophet Muhammad ﷺ and the first Caliph.',
    descriptionMl: 'അബൂബക്കർ സിദ്ദീഖ് (റ) നബി മുഹമ്മദ് ﷺ യുടെ ഏറ്റവും അടുത്ത സഹചാരിയും ഇസ്ലാമിന്റെ ഒന്നാം ഖലീഫയുമായിരുന്നു.',
    importance: 'high',
  },
  {
    id: 'wafat-umar',
    month: 1,
    day: 26,
    title: 'Wafat of Umar ibn al-Khattab (RA)',
    titleMl: 'ഉമർ ഇബ്നുൽ ഖത്താബ് (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة عمر بن الخطاب',
    type: 'wafat',
    description: 'Umar ibn al-Khattab (RA), the second Caliph of Islam, was known for his justice and strength.',
    descriptionMl: 'ഉമർ ഇബ്നുൽ ഖത്താബ് (റ), ഇസ്ലാമിന്റെ രണ്ടാം ഖലീഫ, നീതിക്കും ശക്തിക്കും പ്രസിദ്ധനായിരുന്നു.',
    importance: 'high',
  },
  {
    id: 'wafat-uthman',
    month: 12,
    day: 18,
    title: 'Wafat of Uthman ibn Affan (RA)',
    titleMl: 'ഉസ്മാൻ ഇബ്നു അഫ്ഫാൻ (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة عثمان بن عفان',
    type: 'wafat',
    description: 'Uthman ibn Affan (RA), the third Caliph, was known for compiling the Quran into a single book.',
    descriptionMl: 'ഉസ്മാൻ ഇബ്നു അഫ്ഫാൻ (റ), മൂന്നാം ഖലീഫ, ഖുർആൻ ഒരു ഗ്രന്ഥമായി ക്രോഡീകരിച്ചതിന് പ്രസിദ്ധനാണ്.',
    importance: 'high',
  },
  {
    id: 'wafat-ali',
    month: 9,
    day: 21,
    title: 'Wafat of Ali ibn Abi Talib (RA)',
    titleMl: 'അലി ഇബ്നു അബീ താലിബ് (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة علي بن أبي طالب',
    type: 'wafat',
    description: 'Ali ibn Abi Talib (RA), the fourth Caliph, was known for his knowledge, bravery, and eloquence.',
    descriptionMl: 'അലി ഇബ്നു അബീ താലിബ് (റ), നാലാം ഖലീഫ, അറിവിനും ധൈര്യത്തിനും വാചാലതയ്ക്കും പ്രസിദ്ധനായിരുന്നു.',
    importance: 'high',
  },
  {
    id: 'wafat-fatima',
    month: 6,
    day: 3,
    title: 'Wafat of Fatimah al-Zahra (RA)',
    titleMl: 'ഫാത്തിമ അൽ-സഹ്‌റ (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة فاطمة الزهراء',
    type: 'wafat',
    description: 'Fatimah al-Zahra (RA), the beloved daughter of Prophet Muhammad ﷺ.',
    descriptionMl: 'ഫാത്തിമ അൽ-സഹ്‌റ (റ), നബി മുഹമ്മദ് ﷺ യുടെ പ്രിയപ്പെട്ട മകൾ.',
    importance: 'high',
  },
  {
    id: 'wafat-khadija',
    month: 9,
    day: 10,
    title: 'Wafat of Khadijah bint Khuwaylid (RA)',
    titleMl: 'ഖദീജ ബിൻത് ഖുവൈലിദ് (റ) യുടെ വഫാത്ത്',
    titleArabic: 'وفاة خديجة بنت خويلد',
    type: 'wafat',
    description: 'Khadijah (RA), the first wife of Prophet Muhammad ﷺ and the first person to embrace Islam.',
    descriptionMl: 'ഖദീജ (റ), നബി മുഹമ്മദ് ﷺ യുടെ ആദ്യ ഭാര്യയും ഇസ്ലാം സ്വീകരിച്ച ആദ്യ വ്യക്തിയും.',
    importance: 'high',
  },
  {
    id: 'wafat-hussain',
    month: 1,
    day: 10,
    title: 'Martyrdom of Imam Hussain (RA)',
    titleMl: 'ഇമാം ഹുസൈൻ (റ) യുടെ ശഹാദത്ത്',
    titleArabic: 'شهادة الإمام الحسين',
    type: 'wafat',
    description: 'Imam Hussain (RA), the grandson of Prophet Muhammad ﷺ, was martyred at Karbala.',
    descriptionMl: 'ഇമാം ഹുസൈൻ (റ), നബി മുഹമ്മദ് ﷺ യുടെ പേരമകൻ, കർബലയിൽ ശഹീദായി.',
    importance: 'high',
  },
];

// Helper function to get events for a specific date
export const getEventsForDateML = (month: number, day: number): IslamicEventML[] => {
  return ISLAMIC_EVENTS_ML.filter(event => event.month === month && event.day === day);
};

// Helper function to get events for a specific month
export const getEventsForMonthML = (month: number): IslamicEventML[] => {
  return ISLAMIC_EVENTS_ML.filter(event => event.month === month);
};
