/**
 * Farā'iḍ (Islamic Inheritance Law) Type Definitions
 */

// Gender type
export type Gender = 'male' | 'female';

// Heir categories based on Islamic inheritance law
export type HeirType =
  // Primary heirs (Aṣḥāb al-Furūḍ - Quranic heirs)
  | 'husband'
  | 'wife'
  | 'father'
  | 'mother'
  | 'daughter'
  | 'son'
  | 'grandfather' // Paternal
  | 'grandmother' // Paternal or Maternal
  | 'full_brother'
  | 'full_sister'
  | 'paternal_brother'
  | 'paternal_sister'
  | 'maternal_brother'
  | 'maternal_sister'
  | 'son_of_son' // Grandson through son
  | 'daughter_of_son'; // Granddaughter through son

// Heir information
export interface Heir {
  id: string;
  type: HeirType;
  label: string;
  labelArabic: string;
  labelMalayalam?: string;
  count: number;
  gender: Gender;
  // For spouse calculation
  isBlocked?: boolean;
  blockedBy?: HeirType[];
}

// Calculated share for an heir
export interface HeirShare {
  heir: Heir;
  share: Fraction;
  shareDescription: string;
  shareDescriptionArabic: string;
  amount: number;
  percentage: number;
  rule: string;
  ruleArabic: string;
  ruleMalayalam: string;
  isPerPerson?: boolean;
}

// Fraction representation for precise calculations
export interface Fraction {
  numerator: number;
  denominator: number;
}

// Estate information
export interface Estate {
  totalValue: number;
  currency: string;
  debts: number;
  wasiyyah: number; // Bequest (max 1/3 of estate after debts)
  funeralExpenses: number;
}

// Blocked heir information (Saaqith - ساقط)
export interface BlockedHeir {
  heir: Heir;
  blockedBy: string;
  blockedByArabic: string;
  blockedByMalayalam: string;
  reason: string;
  reasonArabic: string;
  reasonMalayalam: string;
}

// Calculation result
export interface InheritanceResult {
  estate: Estate;
  netEstate: number;
  heirs: HeirShare[];
  blockedHeirs: BlockedHeir[];
  totalDistributed: number;
  remainder: number;
  aslAlMasala: number;
  awl: boolean;
  radd: boolean;
  notes: string[];
  notesArabic: string[];
}

// Heir configuration for the form
export interface HeirConfig {
  type: HeirType;
  label: string;
  labelArabic: string;
  labelMalayalam: string;
  gender: Gender;
  maxCount: number;
  category: 'spouse' | 'parent' | 'child' | 'grandparent' | 'sibling' | 'grandchild';
}

// All available heirs configuration
export const HEIR_CONFIGS: HeirConfig[] = [
  // Spouses
  { type: 'husband', label: 'Husband', labelArabic: 'زوج', labelMalayalam: 'ഭർത്താവ്', gender: 'male', maxCount: 1, category: 'spouse' },
  { type: 'wife', label: 'Wife', labelArabic: 'زوجة', labelMalayalam: 'ഭാര്യ', gender: 'female', maxCount: 4, category: 'spouse' },
  
  // Parents
  { type: 'father', label: 'Father', labelArabic: 'أب', labelMalayalam: 'പിതാവ്', gender: 'male', maxCount: 1, category: 'parent' },
  { type: 'mother', label: 'Mother', labelArabic: 'أم', labelMalayalam: 'ഉമ്മ', gender: 'female', maxCount: 1, category: 'parent' },
  
  // Children
  { type: 'son', label: 'Son', labelArabic: 'ابن', labelMalayalam: 'മകൻ', gender: 'male', maxCount: 20, category: 'child' },
  { type: 'daughter', label: 'Daughter', labelArabic: 'بنت', labelMalayalam: 'മകൾ', gender: 'female', maxCount: 20, category: 'child' },
  
  // Grandchildren (through son)
  { type: 'son_of_son', label: 'Grandson (son\'s son)', labelArabic: 'ابن الابن', labelMalayalam: 'പേരമകൻ (മകന്റെ മകൻ)', gender: 'male', maxCount: 20, category: 'grandchild' },
  { type: 'daughter_of_son', label: 'Granddaughter (son\'s daughter)', labelArabic: 'بنت الابن', labelMalayalam: 'പേരമകൾ (മകന്റെ മകൾ)', gender: 'female', maxCount: 20, category: 'grandchild' },
  
  // Grandparents
  { type: 'grandfather', label: 'Grandfather (paternal)', labelArabic: 'جد', labelMalayalam: 'മുത്തച്ഛൻ (പിതൃവഴി)', gender: 'male', maxCount: 1, category: 'grandparent' },
  { type: 'grandmother', label: 'Grandmother', labelArabic: 'جدة', labelMalayalam: 'മുത്തശ്ശി', gender: 'female', maxCount: 2, category: 'grandparent' },
  
  // Full siblings
  { type: 'full_brother', label: 'Full Brother', labelArabic: 'أخ شقيق', labelMalayalam: 'സഹോദരൻ (ഒരേ മാതാപിതാക്കൾ)', gender: 'male', maxCount: 20, category: 'sibling' },
  { type: 'full_sister', label: 'Full Sister', labelArabic: 'أخت شقيقة', labelMalayalam: 'സഹോദരി (ഒരേ മാതാപിതാക്കൾ)', gender: 'female', maxCount: 20, category: 'sibling' },
  
  // Paternal siblings
  { type: 'paternal_brother', label: 'Paternal Half-Brother', labelArabic: 'أخ لأب', labelMalayalam: 'പിതൃവഴി സഹോദരൻ', gender: 'male', maxCount: 20, category: 'sibling' },
  { type: 'paternal_sister', label: 'Paternal Half-Sister', labelArabic: 'أخت لأب', labelMalayalam: 'പിതൃവഴി സഹോദരി', gender: 'female', maxCount: 20, category: 'sibling' },
  
  // Maternal siblings
  { type: 'maternal_brother', label: 'Maternal Half-Brother', labelArabic: 'أخ لأم', labelMalayalam: 'മാതൃവഴി സഹോദരൻ', gender: 'male', maxCount: 20, category: 'sibling' },
  { type: 'maternal_sister', label: 'Maternal Half-Sister', labelArabic: 'أخت لأم', labelMalayalam: 'മാതൃവഴി സഹോദരി', gender: 'female', maxCount: 20, category: 'sibling' },
];

// Deceased information
export interface DeceasedInfo {
  gender: Gender;
}
