/**
 * Hijri Calendar Events Data
 * Contains important Islamic days, wafat dates, and special duas/dhikr
 */

export interface IslamicEvent {
  id: string;
  month: number; // Hijri month (1-12)
  day: number;
  title: string;
  type: 'religious' | 'wafat' | 'birth' | 'historic';
  description: string;
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
    type: 'religious',
    description: 'The first day of Muharram marks the beginning of the Islamic New Year. It commemorates the Hijra (migration) of Prophet Muhammad ﷺ from Makkah to Madinah in 622 CE. This event marks the beginning of the Islamic calendar and represents a new beginning for Muslims worldwide.',
  },
  {
    id: 'ashura',
    month: 1,
    day: 10,
    title: 'Day of Ashura',
    type: 'religious',
    description: 'Ashura is a day of historical victories and sacrifice. It commemorates Allah saving Musa (AS) and the Children of Israel from Pharaoh, the preservation of Nuh\'s (AS) Ark, and the martyrdom of Husayn (RA) at Karbala. It is a time for reflection, gratitude, and remembrance.',
  },

  // SAFAR
  {
    id: 'start-safar',
    month: 2,
    day: 1,
    title: 'Beginning of Safar',
    type: 'religious',
    description: "Safar is the second month of the Hijri calendar. Historically some Arabs associated this month with superstitions; Islam rejects such beliefs and teaches that Safar carries no inherent misfortune. The Prophet ﷺ taught that there is nothing special or unlucky about Safar. This month is a reminder to avoid baseless superstitions and to place trust in Allah's decree.",
  },
  {
    id: 'wafat-ali-rida',
    month: 2,
    day: 29,
    title: 'Wafat of Imam Ali al-Rida',
    type: 'wafat',
    description: 'Imam Ali ibn Musa al-Rida (RA) was the eighth Imam in Shia Islam and a respected scholar. He was known for his deep knowledge, piety, and noble character. He passed away in 818 CE in Tus, Iran.',
  },

  // RABI AL-AWWAL
  {
    id: 'start-rabi-al-awwal',
    month: 3,
    day: 1,
    title: "Beginning of Rabi' al-Awwal",
    type: 'religious',
    description: "Rabi' al-Awwal is the third month of the Hijri calendar and a month of special remembrance for the life of the Prophet Muhammad ﷺ. It is a time to reflect upon his birth, his character, teachings and to renew commitment to following his Sunnah through charity, supplication and good deeds.",
  },
  {
    id: 'start-rabi-al-thani',
    month: 4,
    day: 1,
    title: "Beginning of Rabi' al-Thani",
    type: 'religious',
    description: "Rabi' al-Thani is the fourth month of the Hijri calendar. It is a continuation of Rabi' al-Awwal and a time to maintain the spiritual momentum — increasing acts of worship, reflection on the Prophet's teachings, and good deeds.",
  },
  {
    id: 'mawlid-nabi',
    month: 3,
    day: 12,
    title: 'Mawlid al-Nabi (Prophet\'s Birthday)',
    type: 'birth',
    description: 'Mawlid al-Nabi celebrates the birth of Prophet Muhammad ﷺ. It is observed with remembrance of his life, abundant salawat, charitable acts, and study of his seerah to emulate his character in daily life.',
  },
  {
    id: 'wafat-prophet',
    month: 3,
    day: 12,
    title: 'Wafat of Prophet Muhammad ﷺ',
    type: 'wafat',
    description: 'Prophet Muhammad ﷺ passed away on 12 Rabi al-Awwal, 11 AH (632 CE) in Madinah. His departure was a great loss for the Muslim Ummah. He left behind the Quran and his Sunnah as guidance for all times.',
  },

  // RAJAB
  {
    id: 'start-rajab',
    month: 7,
    day: 1,
    title: 'Beginning of Rajab',
    type: 'religious',
    description: 'Rajab is one of the four sacred months in Islam. It is recommended to increase worship, fasting and good deeds during this month and to prepare spiritually for the coming months of Sha\'ban and Ramadan.',
  },
  {
    id: 'raghaib',
    month: 7,
    day: 1,
    title: 'First Friday of Rajab (Laylat al-Raghaib)',
    type: 'religious',
    description: 'The first Friday night of Rajab is known as Laylat al-Raghaib. Rajab is one of the four sacred months in Islam. It is recommended to increase worship, fasting, and good deeds during this blessed month.',
  },
  {
    id: 'isra-miraj',
    month: 7,
    day: 27,
    title: 'Isra and Mi\'raj (Night Journey)',
    type: 'religious',
    description: 'Laylat al-Isra wal-Mi\'raj commemorates the miraculous night journey of Prophet Muhammad ﷺ from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem (Isra), and then his ascension through the heavens to meet Allah (Mi\'raj). During this journey, the five daily prayers were prescribed. This event demonstrates the Prophet\'s exalted status and the importance of prayer in Islam. It occurred approximately one year before the Hijra.',
  },
  {
    id: 'start-shaban',
    month: 8,
    day: 1,
    title: 'Beginning of Sha\'ban',
    type: 'religious',
    description: "Sha'ban is the month preceding Ramadan; the Prophet ﷺ often increased voluntary fasting and worship during this month. It is a time to prepare spiritually for Ramadan through additional worship, Quran recitation and good deeds. The 15th night (Laylat al-Bara'at) is observed by many as a night of seeking forgiveness.",
  },
  {
    id: 'shab-e-barat',
    month: 8,
    day: 15,
    title: 'Shab-e-Barat (Night of Forgiveness)',
    type: 'religious',
    description: 'The 15th night of Shaban, known as Shab-e-Barat or Laylat al-Nisf min Shaban, is considered a night of forgiveness and blessings. It is believed that Allah descends to the lowest heaven and forgives those who seek forgiveness. Many Muslims spend this night in prayer and worship.',
  },

  // RAMADAN
  {
    id: 'ramadan-start',
    month: 9,
    day: 1,
    title: 'Beginning of Ramadan',
    type: 'religious',
    description: 'The blessed month of Ramadan begins. Muslims worldwide observe fasting from dawn to sunset, increase in worship, recite Quran, and engage in acts of charity. Ramadan is the month in which the Quran was revealed.',
  },
  {
    id: 'laylatul-qadr',
    month: 9,
    day: 27,
    title: 'Laylat al-Qadr (Night of Power)',
    type: 'religious',
    description: 'Laylat al-Qadr is the most blessed night of the year, better than a thousand months. It marks the night the Quran was first revealed and is a time of intense worship, dua and seeking forgiveness. Many spend the night in prayer, Quran recitation and supplication.',
  },

  // SHAWWAL
  {
    id: 'eid-fitr',
    month: 10,
    day: 1,
    title: 'Eid al-Fitr',
    type: 'religious',
    description: 'Eid al-Fitr marks the end of Ramadan and is a day of celebration, gratitude, and joy. Muslims gather for Eid prayer, give Zakat al-Fitr (charity), wear new clothes, and celebrate with family and friends. Fasting is prohibited on this day.',
  },

  // DHUL QADAH
  {
    id: 'start-hajj-months',
    month: 11,
    day: 1,
    title: 'Beginning of Hajj Season',
    type: 'religious',
    description: 'Dhul Qadah is one of the four sacred months and marks the beginning of the Hajj season. It is a time of preparation for those planning to perform the pilgrimage.',
  },

  {
    id: 'start-jumada-al-awwal',
    month: 5,
    day: 1,
    title: 'Beginning of Jumada al-Awwal',
    type: 'religious',
    description: 'Jumada al-Awwal is the fifth month of the Hijri calendar. It is a suitable time to increase remembrance, charity and reflection upon the teachings of Islam.',
  },
  {
    id: 'start-jumada-al-thani',
    month: 6,
    day: 1,
    title: 'Beginning of Jumada al-Thani',
    type: 'religious',
    description: 'Jumada al-Thani (Jumada al-Akhirah) is the sixth Hijri month. Muslims are encouraged to use this time for consistent worship, charity and personal improvement.',
  },

  // DHUL HIJJAH
  {
    id: 'start-dhul-hijjah',
    month: 12,
    day: 1,
    title: 'Beginning of Dhul-Hijjah',
    type: 'religious',
    description: "Dhul-Hijjah is one of the most sacred months in Islam and the month of Hajj. The first ten days are especially virtuous; the Day of Arafah on the 9th and Eid al-Adha on the 10th are among the greatest days. This month teaches sacrifice, obedience and devotion to Allah.",
  },
  {
    id: 'day-arafah',
    month: 12,
    day: 9,
    title: 'Day of Arafah',
    type: 'religious',
    description: 'The Day of Arafah is the most important day of Hajj and one of the best days of the year. Pilgrims gather at the plain of Arafah for the most essential ritual of Hajj. For those not performing Hajj, fasting on this day expiates sins of the previous and coming year.',
  },
  {
    id: 'eid-adha',
    month: 12,
    day: 10,
    title: 'Eid al-Adha',
    type: 'religious',
    description: 'Eid al-Adha, the Festival of Sacrifice, commemorates Prophet Ibrahim\'s willingness to sacrifice his son in obedience to Allah. It is celebrated with prayer, Qurbani (sacrifice) and sharing with family and the needy.',
  },
  {
    id: 'tashriq-days',
    month: 12,
    day: 11,
    title: 'Days of Tashriq (11-13 Dhul Hijjah)',
    type: 'religious',
    description: 'The Days of Tashriq are the three days following Eid al-Adha (11th, 12th, and 13th of Dhul Hijjah). These are days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.',
  },

  // WAFAT OF NOTABLE FIGURES
  {
    id: 'wafat-abu-bakr',
    month: 8,
    day: 22,
    title: 'Wafat of Abu Bakr al-Siddiq (RA)',
    type: 'wafat',
    description: 'Abu Bakr al-Siddiq (RA) was the closest companion of Prophet Muhammad ﷺ and the first Caliph of Islam. Known for his unwavering faith, he was titled "al-Siddiq" (the Truthful). He passed away in 634 CE after leading the Muslim community for about two years.',
  },
  {
    id: 'wafat-umar',
    month: 1,
    day: 26,
    title: 'Wafat of Umar ibn al-Khattab (RA)',
    type: 'wafat',
    description: 'Umar ibn al-Khattab (RA), the second Caliph of Islam, was known for his justice, strength, and expansion of the Islamic state. He was martyred in 644 CE while leading the Fajr prayer.',
  },
  {
    id: 'wafat-uthman',
    month: 12,
    day: 18,
    title: 'Wafat of Uthman ibn Affan (RA)',
    type: 'wafat',
    description: 'Uthman ibn Affan (RA), the third Caliph of Islam, was known for his generosity and for compiling the Quran into a single book. He was martyred in 656 CE.',
  },
  {
    id: 'wafat-ali',
    month: 9,
    day: 21,
    title: 'Wafat of Ali ibn Abi Talib (RA)',
    type: 'wafat',
    description: 'Ali ibn Abi Talib (RA), the fourth Caliph of Islam and cousin and son-in-law of the Prophet ﷺ, was known for his knowledge, bravery, and eloquence. He was martyred in 661 CE during the Fajr prayer.',
  },
  {
    id: 'wafat-fatima',
    month: 6,
    day: 3,
    title: 'Wafat of Fatimah al-Zahra (RA)',
    type: 'wafat',
    description: 'Fatimah al-Zahra (RA), the beloved daughter of Prophet Muhammad ﷺ, was known for her piety, patience, and devotion. She passed away a few months after her father in 632 CE.',
  },
  {
    id: 'wafat-khadija',
    month: 9,
    day: 10,
    title: 'Wafat of Khadijah bint Khuwaylid (RA)',
    type: 'wafat',
    description: 'Khadijah (RA), the first wife of Prophet Muhammad ﷺ and the first person to embrace Islam, was known for her support, wisdom, and devotion. She passed away in the Year of Sorrow, approximately 619 CE.',
  },
  {
    id: 'wafat-hussain',
    month: 1,
    day: 10,
    title: 'Martyrdom of Imam Hussain (RA)',
    type: 'wafat',
    description: 'Imam Hussain (RA), the grandson of Prophet Muhammad ﷺ, was martyred at Karbala on the Day of Ashura in 680 CE. His sacrifice stands as a symbol of standing up against injustice and oppression. His life teaches the Ummah lessons of sacrifice and steadfastness.',
  },
  {
    id: 'wafat-imam-ghazali',
    month: 5,
    day: 14,
    title: 'Wafat of Imam al-Ghazali',
    type: 'wafat',
    description: 'Imam Abu Hamid al-Ghazali (1058-1111 CE) was one of the greatest Islamic scholars, philosophers, and mystics. His work "Ihya Ulum al-Din" (Revival of Religious Sciences) remains influential to this day.',
  },
  // Added from user input: notable sahaba and scholars
  {
    id: 'wafat-jaafar-ibn-abi-talib',
    month: 5,
    day: 8,
    title: "Martyrdom of Ja'far ibn Abi Talib (RA)",
    type: 'wafat',
    description: "Ja'far ibn Abi Talib (RA), brother of `Ali (RA) and cousin of the Prophet ﷺ, led the Muslim group during the Abyssinian migration. He fought bravely at the Battle of Mu'tah where he lost both arms while holding the standard; the Prophet ﷺ praised his sacrifice and described that Allah granted him wings in Paradise, hence he is known as 'Ja'far at-Tayyar'.",
  },
  {
    id: 'wafat-said-bin-harith',
    month: 5,
    day: 1,
    title: 'Wafat of Sa\'id bin Harith (RA)',
    type: 'wafat',
    description: "Sa'id bin Harith (RA) — a beloved companion associated with the Prophet ﷺ and appointed as commander at the Battle of Mu'tah; he attained martyrdom there while courageously leading the Muslim forces.",
  },
  {
    id: 'wafat-abdullahi-bin-rawahah',
    month: 5,
    day: 5,
    title: 'Wafat of Abdullahi bin Rawahah (RA)',
    type: 'wafat',
    description: "Abdullahi bin Rawahah (RA) — a prominent poet and leader among the Ansar; he served as the third commander at Mu'tah after Sa'id and Ja'far and was martyred while defending Islam.",
  },
  {
    id: 'wafat-abdul-mutallib',
    month: 5,
    day: 10,
    title: 'Wafat of Abdul Mutallib',
    type: 'wafat',
    description: "Abdul Mutallib — the grandfather of the Prophet ﷺ and a leader of Quraysh; he generously raised the young Muhammad ﷺ after the death of his father. Historical records place his death in Jumada al-Awwal.",
  },
  {
    id: 'wafat-sha-abdul-haqq-dehlvi',
    month: 5,
    day: 7,
    title: 'Wafat of Shaikh Abdu\'l-Haqq Dehlvi (RA)',
    type: 'wafat',
    description: "Shaikh Abdu'l-Haqq Muhaddith Dehlvi (RA) — a notable hadith scholar of India who played a major role in spreading hadith knowledge and authored important commentaries in Persian and Arabic. He passed away in Jumada al-Awwal.",
  },
  {
    id: 'wafat-paravann-kp-muhyudheen',
    month: 5,
    day: 19,
    title: 'Wafat of Paravann K.P. Muhyudheen Kutty Musliyar',
    type: 'wafat',
    description: "Paravann K.P. Muhyudheen Kutty Musliyar — a major scholar and organiser in Kerala's Samastha movement; credited with building madrasa syllabi, leading the federation and serving as an influential teacher and writer. He passed away on Jumada al-Awwal 19 (Hijri 1370 / 1951-02-25).",
  },
  {
    id: 'wafat-ummul-baneen',
    month: 6,
    day: 13,
    title: 'Wafat of Ummul Baneen (RA)',
    type: 'wafat',
    description: "Ummul Baneen (RA) — wife of Ali (RA) and mother of the brave Abbas (RA) and his brothers; known for her devotion to the Ahl al-Bayt and her sons' sacrifice. Historical accounts mark her passing in Jumada al-Thani.",
  },
  {
    id: 'wafat-abu-hurairah',
    month: 11,
    day: 5,
    title: 'Wafat of Abu Hurairah (RA)',
    type: 'wafat',
    description: "Abu Hurairah (RA) — the companion who transmitted one of the largest collections of hadith; he devoted his life to learning and teaching the Prophet's traditions and passed away in Dhul-Qadah.",
  },
  {
    id: 'wafat-ibn-qayyim',
    month: 11,
    day: 13,
    title: 'Wafat of Ibn al-Qayyim al-Jawziyya (RA)',
    type: 'wafat',
    description: "Ibn al-Qayyim al-Jawziyya (RA) — renowned Islamic scholar, jurist and author, student of Ibn Taymiyyah; remembered for his works on creed, tafsir and spirituality. He passed away in Dhul-Qadah.",
  },
  {
    id: 'wafat-imam-abu-hanifa',
    month: 8,
    day: 15,
    title: 'Wafat of Imam Abu Hanifa (RA)',
    type: 'wafat',
    description: "Imam Abu Hanifa (RA) — founder of the Hanafi madhhab and one of the foremost jurists of Islam; historical records place his death on Sha'ban 15.",
  },
  {
    id: 'wafat-imam-nawawi',
    month: 7,
    day: 24,
    title: 'Wafat of Imam Nawawi (RA)',
    type: 'wafat',
    description: "Imam Yahya ibn Sharaf al-Nawawi (RA) — author of 'Riyad as-Salihin' and many key hadith works; he passed away on Rajab 24.",
  },
  {
    id: 'wafat-sainul-ulama-cherushseri',
    month: 10,
    day: 13,
    title: "Wafat of Sainul Ulama Cherushseri Sainuddheen Musliyar",
    type: 'wafat',
    description: "Sainul Ulama Cherushseri Sainuddheen Musliyar was a prominent scholar who served as General Secretary of Samastha Kerala Jamiyyathul Ulama for around 20 years. Born in Morayur, Malappuram in Rajab 20, 1356 AH (October 1937) into a scholarly family, he began teaching at Kondotty Juma Masjid at a young age. He joined Samastha's central mushawara in 1980 and was appointed General Secretary in 1996. He served as Pro-Chancellor of Darul Huda Islamic University, served as Qazi for many mahalls, and chaired the federation's fatwa committee. He passed away on Shawwal 13, 1437 AH (18 February 2016) and was buried at the Chemmad Darul Huda campus."
  },
  {
    id: 'wafat-km-bafaqi-thangal',
    month: 12,
    day: 14,
    title: 'Wafat of K. M. Bafaqi Thangal',
    type: 'wafat',
    description: "K. M. Bafaqi Thangal (born Rajab 20, 1324 AH / Feb 1906) was a prominent community and political leader from Koyilandy. He dedicated his life to the religious and social uplift of the community and played a central role in founding educational institutions and Samastha's education board. He passed away on Dhul Hijjah 14, 1392 AH (19 January 1973) during Hajj in Makkah.",
  },
  {
    id: 'wafat-abdul-bari',
    month: 3,
    day: 20,
    title: 'Wafat of Abdul Bari Musliyar',
    type: 'wafat',
    description: "Abdul Bari Musliyar (born Rabi al-Thani 10, 1298 AH / Feb 1881) was a respected scholar from Panayikulam and a leading figure in Samastha; he served as General Secretary from 1951 to 1963. He passed away on Rabi al-Awwal 20, 1385 AH (19 July 1965).",
  },
  {
    id: 'wafat-ek-abubacker',
    month: 4,
    day: 4,
    title: 'Wafat of E.K. Abubacker Musliyar',
    type: 'wafat',
    description: "E.K. Abubacker Musliyar (born Rabi al-Awwal 1333 AH / 1914) served as General Secretary of Samastha for about 40 years (1957–1996). A leading scholar in Quran, Hadith and Fiqh, he passed away on Rabi al-Thani 4, 1417 AH (19 August 1996).",
  },
  {
    id: 'wafat-ok-sainuddheen',
    month: 10,
    day: 27,
    title: 'Wafat of O.K. Sainuddheen Kutti Musliyar',
    type: 'wafat',
    description: "O.K. Sainuddheen Kutti Musliyar (born 1331 AH) was a distinguished teacher and scholar who served in Vazhakad Darul Uloom and Parappanangadi Pallidars; he passed away on Shawwal 27, 1412 AH (May 1992).",
  },
  {
    id: 'wafat-kc-jamaluddin',
    month: 10,
    day: 27,
    title: 'Wafat of K.C. Jamaluddin Musliyar',
    type: 'wafat',
    description: "K.C. Jamaluddin Musliyar, a vice-president of Samastha and senior jurist, passed away on Shawwal 27, 1432 AH (26 September 2011).",
  },
  {
    id: 'wafat-kalambadi-muhammad',
    month: 11,
    day: 16,
    title: 'Wafat of Kalambadi Muhammad Musliyar',
    type: 'wafat',
    description: "Kalambadi Muhammad Musliyar (born 1935) served as Samastha's eighth president and passed away on Dhul Qadah 16, 1433 AH (2 October 2012).",
  },
  {
    id: 'wafat-nellikuth-ismail',
    month: 1,
    day: 24,
    title: 'Wafat of Nellikuth Ismail Musliyar',
    type: 'wafat',
    description: "Nellikuth Ismail Musliyar (born 1940) was a noted scholar and lexicographer; he passed away on Muharram 24, 1431 AH (10 January 2010).",
  },
  {
    id: 'wafat-anakkara-c-koyakkutti',
    month: 7,
    day: 25,
    title: 'Wafat of Anakkara C. Koyakkutti Musliyar',
    type: 'wafat',
    description: "Anakkara C. Koyakkutti Musliyar (born 1934) was Samastha's ninth president and a close student of Sheikhunnah Kanniyath Ahmad; he passed away on Rajab 25, 1437 AH (3 May 2016).",
  },
  {
    id: 'wafat-tkm-bava',
    month: 8,
    day: 7,
    title: 'Wafat of T.K.M. Bava Musliyar',
    type: 'wafat',
    description: "T.K.M. Bava Musliyar (born 1930) was a former Samastha president and education board inspector; he passed away on Shaban 7, 1434 AH (16 June 2013).",
  },
  {
    id: 'wafat-ap-kunjamu',
    month: 4,
    day: 10,
    title: 'Wafat of A.P. Kunjamu Musliyar',
    type: 'wafat',
    description: "A.P. Kunjamu Musliyar (born 1361 AH / 1942) was a respected spiritual leader; he passed away on Rabi al-Thani 10, 1440 AH (18 December 2018).",
  },
  {
    id: 'wafat-sayyid-ahmad-bukhari',
    month: 4,
    day: 18,
    title: 'Wafat of Sayyid Ahmad Jalaluddin al-Bukhari',
    type: 'wafat',
    description: "Sayyid Ahmad Jalaluddin al-Bukhari (historic figure) is remembered as a Sufi saint whose maqam at Kadalundi Bandar receives many visitors; traditional records note his passing on Rabi al-Thani 18.",
  },
  {
    id: 'wafat-varakkal-mullakkoya',
    month: 8,
    day: 17,
    title: 'Wafat of Varakkal Mullakkoya Thangal',
    type: 'wafat',
    description: "Varakkal Mullakkoya Thangal (1840–1932) was a foundational religious leader in Malabar and Samastha's founding president; he passed away on Shaban 17.",
  },
  {
    id: 'wafat-pangil-ahmad-kutty',
    month: 12,
    day: 25,
    title: 'Wafat of Pangil Ahmad Kutty Musliyar',
    type: 'wafat',
    description: "Pangil Ahmad Kutty Musliyar (born 1888) played a major role in structuring Samastha and passed away on Dhul Hijjah 25.",
  },
  {
    id: 'wafat-kanniyath-ahmad',
    month: 4,
    day: 2,
    title: 'Wafat of Kanniyath Ahmad Musliyar',
    type: 'wafat',
    description: "Kanniyath Ahmad Musliyar (1900–1993) was a major scholar and former Samastha president; he passed away on Rabi al-Thani 2.",
  },
  {
    id: 'wafat-chappanangadi-bappu',
    month: 12,
    day: 26,
    title: 'Wafat of Shaikhuna Chappanangadi Bappu Musliyar',
    type: 'wafat',
    description: "Shaikhuna Chappanangadi Bappu Musliyar (1933–2002) was a noted Sufi scholar and member of Samastha's central mushawara; he passed away on Dhul Hijjah 26.",
  },
  {
    id: 'wafat-kk-abubacker-hasrath',
    month: 7,
    day: 16,
    title: 'Wafat of K.K. Abubacker Hasrath',
    type: 'wafat',
    description: "K.K. Abubacker Hasrath was a significant leader in northern Malabar and passed away on Rajab 16.",
  },
  {
    id: 'wafat-ek-hassan',
    month: 10,
    day: 25,
    title: 'Wafat of E.K. Hassan Musliyar',
    type: 'wafat',
    description: "E.K. Hassan Musliyar (1920–1982) was a key organizer and leader in Samastha; he passed away on Shawwal 25.",
  },
  {
    id: 'wafat-panakkad-shihab',
    month: 8,
    day: 10,
    title: 'Wafat of Panakkad Sayyid Muhammadali Shihab Thangal',
    type: 'wafat',
    description: "Panakkad Sayyid Muhammadali Shihab Thangal (1945–2009) was a spiritual and political leader; he passed away on Shaban 10.",
  },
  {
    id: 'wafat-abdul-qadir',
    month: 9,
    day: 11,
    title: 'Wafat of Sheikh Abdul Qadir Jilani',
    type: 'wafat',
    description: 'Sheikh Abdul Qadir Jilani (1077-1166 CE) was a renowned Islamic scholar and Sufi saint from Baghdad. He founded the Qadiriyya Sufi order and was known as "Ghaus al-Azam" (the Supreme Helper).',

  },

  {

    id: 'battle-badr',

    month: 9,

    day: 17,

    title: 'Battle of Badr',

    type: 'historic',

    description: 'The first major battle in Islamic history in which a small Muslim force defeated the Quraysh.',

  },

  {

    id: 'battle-uhud',

    month: 10,

    day: 7,

    title: 'Battle of Uhud',

    type: 'historic',

    description: 'The battle that taught the importance of discipline after initial Muslim success was undone by disobedience.',

  },

  {

    id: 'battle-khandaq',

    month: 0,

    day: 0,

    title: 'Battle of the Trench',

    type: 'historic',

    description: 'Defensive strategy of digging a trench around Medina that successfully repelled a confederate siege.',

  },

  {

    id: 'battle-khaybar',

    month: 0,

    day: 0,

    title: 'Battle of Khaybar',

    type: 'historic',

    description: 'The conquest of the fortified oasis of Khaybar which secured Medina\'s surroundings.',

  },

  {

    id: 'conquest-makkah',

    month: 9,

    day: 20,

    title: 'Conquest of Makkah',

    type: 'historic',

    description: 'The Prophet ? entered Makkah peacefully and granted a general amnesty to many of his former enemies.',

  },

  {

    id: 'battle-hattin',

    month: 4,

    day: 24,

    title: 'Battle of Hattin',

    type: 'historic',

    description: 'Saladin\'s decisive victory over the Crusader armies leading to the recapture of Jerusalem.',

  }

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

