export interface GuidanceContent {
  quran: {
    arabic: string;
    english: string;
    reference: string;
  };
  dhikr: {
    arabic: string;
    english: string;
    transliteration: string;
  };
  hadith: {
    arabic: string;
    english: string;
    source: string;
  };
}

export const MOOD_GUIDANCE: Record<string, GuidanceContent> = {
  Happy: {
    quran: {
      arabic: "وَإِذَا أَنْعَمْتُ عَلَى الْإِنْسَانِ أَعْرَضَ وَنَأَىٰ بِجَانِبِهِ",
      english: "But when I bestow favor upon man, he turns away and distances himself.",
      reference: "Surah Al-Isra (17:83)"
    },
    dhikr: {
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
      english: "All praise is due to Allah by whose favor good deeds are completed.",
      transliteration: "Alhamdu lillahi billati bi ni'matihi tatimmus salihat"
    },
    hadith: {
      arabic: "مَنْ أَصْبَحَ مِنْكُمْ آمِنًا فِي سِرْبِهِ مُعَافًى فِي جَسَدِهِ عِنْدَهُ قُوتُ يَوْمِهِ فَكَأَنَّمَا حِيزَتْ لَهُ الدُّنْيَا",
      english: "Whoever among you wakes up secure in his property, healthy in his body, and has his food for the day, it is as if the whole world has been granted to him.",
      source: "Tirmidhi"
    }
  },
  Sad: {
    quran: {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english: "For indeed, with hardship comes ease.",
      reference: "Surah Ash-Sharh (94:5-6)"
    },
    dhikr: {
      arabic: "حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ",
      english: "Allah is sufficient for me, and He is the best Disposer of affairs.",
      transliteration: "Hasbiyallah wa ni'mal wakeel"
    },
    hadith: {
      arabic: "لَا يَمَسُّ الْمُؤْمِنَ شَيْءٌ مِنْ وَجَعٍ وَلَا غَمٍّ وَلَا سَقَمٍ وَلَا حُزْنٍ إِلَّا كَفَّرَ اللَّهُ بِهِ مِنْ سَيِّئَاتِهِ",
      english: "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.",
      source: "Bukhari & Muslim"
    }
  },
  Angry: {
    quran: {
      arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
      english: "And those who restrain anger and pardon the people.",
      reference: "Surah Al-Imran (3:134)"
    },
    dhikr: {
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      english: "I seek refuge in Allah from the accursed Satan.",
      transliteration: "A'udhu billahi minash shaytanir rajeem"
    },
    hadith: {
      arabic: "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
      english: "Do not get angry, and Paradise will be yours.",
      source: "Tirmidhi"
    }
  },
  Worried: {
    quran: {
      arabic: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      english: "And whoever relies upon Allah - then He is sufficient for him.",
      reference: "Surah At-Talaq (65:3)"
    },
    dhikr: {
      arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
      english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      transliteration: "La ilaha illa anta subhanaka inni kuntu minaz zalimin"
    },
    hadith: {
      arabic: "لَوْ كَانَ الْهَمُّ دَوَاءً لَدَاوَى الْهَمَّ كُلَّهُ",
      english: "If worry were a cure, it would cure all worry.",
      source: "Ibn Majah"
    }
  },
  Calm: {
    quran: {
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      english: "Unquestionably, by the remembrance of Allah hearts are assured.",
      reference: "Surah Ar-Ra'd (13:28)"
    },
    dhikr: {
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      english: "Glory be to Allah and praise be to Him.",
      transliteration: "Subhanallah wa bihamdihi"
    },
    hadith: {
      arabic: "طُوبَى لِمَنْ وَجَدَ فِي صَحِيفَتِهِ أَكْثَرَ مِنَ التَّسْبِيحِ وَالتَّحْمِيدِ وَالتَّهْلِيلِ",
      english: "Blessed is he who finds in his record abundant glorification, praise, and declaration of Allah's oneness.",
      source: "Ahmad"
    }
  },
  Tired: {
    quran: {
      arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
      english: "And seek help through patience and prayer.",
      reference: "Surah Al-Baqarah (2:153)"
    },
    dhikr: {
      arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      english: "There is no power and no strength except with Allah.",
      transliteration: "La hawla wa la quwwata illa billah"
    },
    hadith: {
      arabic: "الصَّلَاةُ عِمَادُ الدِّينِ",
      english: "Prayer is the pillar of religion.",
      source: "Bayhaqi"
    }
  },
  Lonely: {
    quran: {
      arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ",
      english: "And He is with you wherever you are.",
      reference: "Surah Al-Hadid (57:4)"
    },
    dhikr: {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      english: "O Allah, I ask You for pardon and well-being in this world and the Hereafter.",
      transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyah fid dunya wal akhirah"
    },
    hadith: {
      arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
      english: "The strong believer is better and more beloved to Allah than the weak believer.",
      source: "Muslim"
    }
  },
  Confused: {
    quran: {
      arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      english: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
      reference: "Surah Al-Baqarah (2:186)"
    },
    dhikr: {
      arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      english: "O Turner of hearts, make my heart firm upon Your religion.",
      transliteration: "Ya muqallibal qulubi thabbit qalbi 'ala deenik"
    },
    hadith: {
      arabic: "اسْتَخِيرِ اللَّهَ فِي أَمْرِكَ",
      english: "Seek Allah's guidance in your affairs.",
      source: "Tirmidhi"
    }
  }
};