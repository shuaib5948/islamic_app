/**
 * Quran Khatam Data and Types
 * Manages group Quran khatam with Juz distribution
 */

export interface JuzInfo {
  number: number;
  name: string;
  nameArabic: string;
  startSurah: string;
  startVerse: number;
  endSurah: string;
  endVerse: number;
  pages: number;
}

export interface JuzAssignment {
  juzNumber: number;
  participantName: string;
  participantId: string;
  isCompleted: boolean;
  completedDate?: string;
  assignedDate: string;
}

export interface KhatamGroup {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  targetDate: string;
  assignments: JuzAssignment[];
  isCompleted: boolean;
  completedDate?: string;
  dedication?: string; // For whom this khatam is dedicated
}

// All 30 Juz of the Quran
export const QURAN_JUZ: JuzInfo[] = [
  { number: 1, name: 'Alif Lam Mim', nameArabic: 'الم', startSurah: 'Al-Fatiha', startVerse: 1, endSurah: 'Al-Baqarah', endVerse: 141, pages: 20 },
  { number: 2, name: 'Sayaqul', nameArabic: 'سَيَقُولُ', startSurah: 'Al-Baqarah', startVerse: 142, endSurah: 'Al-Baqarah', endVerse: 252, pages: 20 },
  { number: 3, name: 'Tilka ar-Rusul', nameArabic: 'تِلْكَ الرُّسُلُ', startSurah: 'Al-Baqarah', startVerse: 253, endSurah: 'Al-Imran', endVerse: 92, pages: 20 },
  { number: 4, name: 'Lan Tanaalu', nameArabic: 'لَنْ تَنَالُوا', startSurah: 'Al-Imran', startVerse: 93, endSurah: 'An-Nisa', endVerse: 23, pages: 20 },
  { number: 5, name: 'Wal Muhsanat', nameArabic: 'وَالْمُحْصَنَاتُ', startSurah: 'An-Nisa', startVerse: 24, endSurah: 'An-Nisa', endVerse: 147, pages: 20 },
  { number: 6, name: 'La Yuhibbu Allah', nameArabic: 'لَا يُحِبُّ اللَّهُ', startSurah: 'An-Nisa', startVerse: 148, endSurah: 'Al-Maidah', endVerse: 81, pages: 20 },
  { number: 7, name: 'Wa Idha Samiu', nameArabic: 'وَإِذَا سَمِعُوا', startSurah: 'Al-Maidah', startVerse: 82, endSurah: 'Al-Anam', endVerse: 110, pages: 20 },
  { number: 8, name: 'Wa Lau Annana', nameArabic: 'وَلَوْ أَنَّنَا', startSurah: 'Al-Anam', startVerse: 111, endSurah: 'Al-Araf', endVerse: 87, pages: 20 },
  { number: 9, name: 'Qal al-Mala', nameArabic: 'قَالَ الْمَلَأُ', startSurah: 'Al-Araf', startVerse: 88, endSurah: 'Al-Anfal', endVerse: 40, pages: 20 },
  { number: 10, name: 'Wa Alamu', nameArabic: 'وَاعْلَمُوا', startSurah: 'Al-Anfal', startVerse: 41, endSurah: 'At-Tawbah', endVerse: 92, pages: 20 },
  { number: 11, name: 'Yatadhirun', nameArabic: 'يَعْتَذِرُونَ', startSurah: 'At-Tawbah', startVerse: 93, endSurah: 'Hud', endVerse: 5, pages: 20 },
  { number: 12, name: 'Wa ma min Dabbah', nameArabic: 'وَمَا مِنْ دَابَّةٍ', startSurah: 'Hud', startVerse: 6, endSurah: 'Yusuf', endVerse: 52, pages: 20 },
  { number: 13, name: 'Wa ma Ubarriu', nameArabic: 'وَمَا أُبَرِّئُ', startSurah: 'Yusuf', startVerse: 53, endSurah: 'Ibrahim', endVerse: 52, pages: 20 },
  { number: 14, name: 'Rubama', nameArabic: 'رُبَمَا', startSurah: 'Al-Hijr', startVerse: 1, endSurah: 'An-Nahl', endVerse: 128, pages: 20 },
  { number: 15, name: 'Subhana Alladhi', nameArabic: 'سُبْحَانَ الَّذِي', startSurah: 'Al-Isra', startVerse: 1, endSurah: 'Al-Kahf', endVerse: 74, pages: 20 },
  { number: 16, name: 'Qala Alam', nameArabic: 'قَالَ أَلَمْ', startSurah: 'Al-Kahf', startVerse: 75, endSurah: 'Ta-Ha', endVerse: 135, pages: 20 },
  { number: 17, name: 'Iqtaraba', nameArabic: 'اقْتَرَبَ', startSurah: 'Al-Anbiya', startVerse: 1, endSurah: 'Al-Hajj', endVerse: 78, pages: 20 },
  { number: 18, name: 'Qad Aflaha', nameArabic: 'قَدْ أَفْلَحَ', startSurah: 'Al-Muminun', startVerse: 1, endSurah: 'Al-Furqan', endVerse: 20, pages: 20 },
  { number: 19, name: 'Wa Qala Alladhina', nameArabic: 'وَقَالَ الَّذِينَ', startSurah: 'Al-Furqan', startVerse: 21, endSurah: 'An-Naml', endVerse: 55, pages: 20 },
  { number: 20, name: 'Amman Khalaqa', nameArabic: 'أَمَّنْ خَلَقَ', startSurah: 'An-Naml', startVerse: 56, endSurah: 'Al-Ankabut', endVerse: 45, pages: 20 },
  { number: 21, name: 'Utlu ma Uhiya', nameArabic: 'اتْلُ مَا أُوحِيَ', startSurah: 'Al-Ankabut', startVerse: 46, endSurah: 'Al-Ahzab', endVerse: 30, pages: 20 },
  { number: 22, name: 'Wa man Yaqnut', nameArabic: 'وَمَنْ يَقْنُتْ', startSurah: 'Al-Ahzab', startVerse: 31, endSurah: 'Ya-Sin', endVerse: 27, pages: 20 },
  { number: 23, name: 'Wa ma Liya', nameArabic: 'وَمَا لِيَ', startSurah: 'Ya-Sin', startVerse: 28, endSurah: 'Az-Zumar', endVerse: 31, pages: 20 },
  { number: 24, name: 'Fa man Azlamu', nameArabic: 'فَمَنْ أَظْلَمُ', startSurah: 'Az-Zumar', startVerse: 32, endSurah: 'Fussilat', endVerse: 46, pages: 20 },
  { number: 25, name: 'Ilayhi Yuraddu', nameArabic: 'إِلَيْهِ يُرَدُّ', startSurah: 'Fussilat', startVerse: 47, endSurah: 'Al-Jathiyah', endVerse: 37, pages: 20 },
  { number: 26, name: 'Ha Mim', nameArabic: 'حم', startSurah: 'Al-Ahqaf', startVerse: 1, endSurah: 'Adh-Dhariyat', endVerse: 30, pages: 20 },
  { number: 27, name: 'Qala Fama Khatbukum', nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', startSurah: 'Adh-Dhariyat', startVerse: 31, endSurah: 'Al-Hadid', endVerse: 29, pages: 20 },
  { number: 28, name: 'Qad Samia Allah', nameArabic: 'قَدْ سَمِعَ اللَّهُ', startSurah: 'Al-Mujadila', startVerse: 1, endSurah: 'At-Tahrim', endVerse: 12, pages: 20 },
  { number: 29, name: 'Tabaraka Alladhi', nameArabic: 'تَبَارَكَ الَّذِي', startSurah: 'Al-Mulk', startVerse: 1, endSurah: 'Al-Mursalat', endVerse: 50, pages: 20 },
  { number: 30, name: 'Amma Yatasaalun', nameArabic: 'عَمَّ يَتَسَاءَلُونَ', startSurah: 'An-Naba', startVerse: 1, endSurah: 'An-Nas', endVerse: 6, pages: 23 },
];

// Get Juz info by number
export const getJuzInfo = (juzNumber: number): JuzInfo | undefined => {
  return QURAN_JUZ.find(juz => juz.number === juzNumber);
};

// Calculate progress percentage
export const calculateKhatamProgress = (assignments: JuzAssignment[]): number => {
  if (assignments.length === 0) return 0;
  const completed = assignments.filter(a => a.isCompleted).length;
  return Math.round((completed / 30) * 100);
};

// Get remaining Juz
export const getRemainingJuz = (assignments: JuzAssignment[]): number[] => {
  const assignedJuz = assignments.map(a => a.juzNumber);
  return QURAN_JUZ.map(j => j.number).filter(n => !assignedJuz.includes(n));
};

// Get unfinished assignments
export const getUnfinishedAssignments = (assignments: JuzAssignment[]): JuzAssignment[] => {
  return assignments.filter(a => !a.isCompleted);
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Default dua for completing Quran
export const KHATAM_DUA = {
  arabic: 'اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ',
  transliteration: 'Allahumma irhamni bil-Quran, waj\'alhu li imaman wa nuran wa hudan wa rahmah. Allahumma dhakkirni minhu ma nasitu, wa allimni minhu ma jahiltu, warzuqni tilawatahu anaa al-layli wa atrafa an-nahar, waj\'alhu li hujjatan ya Rabbal-alamin',
  translation: 'O Allah, have mercy on me through the Quran, and make it for me a leader, a light, a guidance, and a mercy. O Allah, remind me of what I have forgotten from it, teach me what I am ignorant of, grant me its recitation during the hours of the night and the ends of the day, and make it a proof for me, O Lord of the worlds.',
};
