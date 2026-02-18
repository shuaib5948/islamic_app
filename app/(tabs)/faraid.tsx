import { Colors } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DeceasedInfo, Estate, Gender, Heir, HEIR_CONFIGS, HeirConfig, InheritanceResult } from '@/types/inheritance';
import { calculateInheritance } from '@/utils/faraid-calculator';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'gender' | 'heirs' | 'estate' | 'results';

interface HeirCount {
  [key: string]: number;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
];

export default function FaraidScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
      headerTitleStyle: {
        fontSize: 18,
      },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  // UI labels with Malayalam translations
  const labels = {
    selectHeirs: isMalayalam ? 'അവകാശികളെ തിരഞ്ഞെടുക്കുക' : 'Select Heirs',
    tapToAdd: isMalayalam ? 'ചേർക്കാൻ/നീക്കം ചെയ്യാൻ ടാപ്പ് ചെയ്യുക' : 'Tap to add/remove heirs',
    estateDetails: isMalayalam ? 'എസ്റ്റേറ്റ് വിവരങ്ങൾ' : 'Estate Details',
    totalEstate: isMalayalam ? 'ആകെ സ്വത്ത്' : 'Total Estate Value',
    deductions: isMalayalam ? 'കുറവുകൾ' : 'Deductions',
    outstandingDebts: isMalayalam ? 'കടങ്ങൾ' : 'Outstanding Debts',
    funeralExpenses: isMalayalam ? 'മയ്യിത്ത് ചെലവ്' : 'Funeral Expenses',
    wasiyyah: isMalayalam ? 'വസിയ്യത്ത് (ഇഷ്ടദാനം)' : 'Wasiyyah (Bequest)',
    summary: isMalayalam ? 'സംഗ്രഹം' : 'Summary',
    lessDebts: isMalayalam ? 'കടം കുറവ്:' : 'Less Debts:',
    lessFuneral: isMalayalam ? 'മയ്യിത്ത് കുറവ്:' : 'Less Funeral:',
    netEstate: isMalayalam ? 'മൊത്തം സ്വത്ത്:' : 'Net Estate:',
    estateSummary: isMalayalam ? 'എസ്റ്റേറ്റ് സംഗ്രഹം' : 'Estate Summary',
    debts: isMalayalam ? 'കടങ്ങൾ:' : 'Debts:',
    distribution: isMalayalam ? 'അനന്തരാവകാശ വിതരണം' : 'Inheritance Distribution',
    totalDistributed: isMalayalam ? 'ആകെ വിതരണം' : 'Total Distributed',
    blockedHeirs: isMalayalam ? 'തടയപ്പെട്ട അവകാശികൾ' : 'Blocked Heirs',
    blockedBy: isMalayalam ? 'തടഞ്ഞത്:' : 'Blocked by:',
    each: isMalayalam ? 'ഓരോരുത്തർക്കും' : 'each',
    back: isMalayalam ? '← പിന്നോട്ട്' : '← Back',
    continue: isMalayalam ? 'തുടരുക →' : 'Continue →',
    calculate: isMalayalam ? 'കണക്കാക്കുക' : 'Calculate',
    share: isMalayalam ? 'പങ്കിടുക' : 'Share',
    newCalculation: isMalayalam ? 'പുതിയ കണക്കുകൂട്ടൽ' : 'New Calculation',
    disclaimer: isMalayalam 
      ? 'ഈ കണക്കുകൂട്ടൽ വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്ക് മാത്രമാണ്. ഔദ്യോഗിക അനന്തരാവകാശ വിധികൾക്ക് ഒരു യോഗ്യനായ ഇസ്ലാമിക പണ്ഡിതനെ (മുഫ്തി) സമീപിക്കുക.'
      : 'This calculation is for educational purposes only. Please consult a qualified Islamic scholar (Mufti) for official inheritance rulings.',
    selected: isMalayalam ? 'തിരഞ്ഞെടുത്തു' : 'selected',
    heirsSelected: isMalayalam ? 'അവകാശികൾ തിരഞ്ഞെടുത്തു' : 'heirs selected',
  };

  const [step, setStep] = useState<Step>('gender');
  const [deceasedGender, setDeceasedGender] = useState<Gender | null>(null);
  const [heirCounts, setHeirCounts] = useState<HeirCount>({});
  const [totalValue, setTotalValue] = useState('');
  const [debts, setDebts] = useState('');
  const [wasiyyah, setWasiyyah] = useState('');
  const [funeralExpenses, setFuneralExpenses] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [result, setResult] = useState<InheritanceResult | null>(null);

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  // Filter heirs based on deceased gender
  const availableHeirs = useMemo(() => {
    if (!deceasedGender) return [];
    return HEIR_CONFIGS.filter(heir => {
      if (deceasedGender === 'male' && heir.type === 'husband') return false;
      if (deceasedGender === 'female' && heir.type === 'wife') return false;
      return true;
    });
  }, [deceasedGender]);

  // Group heirs by category
  const groupedHeirs = useMemo(() => {
    const groups: { [key: string]: HeirConfig[] } = {};
    for (const heir of availableHeirs) {
      if (!groups[heir.category]) {
        groups[heir.category] = [];
      }
      groups[heir.category].push(heir);
    }
    return groups;
  }, [availableHeirs]);

  const categoryLabels: { [key: string]: { en: string; ar: string; ml: string } } = {
    spouse: { en: 'Spouse', ar: 'الزوج/الزوجة', ml: 'ഭാര്യ/ഭർത്താവ്' },
    parent: { en: 'Parents', ar: 'الوالدان', ml: 'മാതാപിതാക്കൾ' },
    child: { en: 'Children', ar: 'الأولاد', ml: 'മക്കൾ' },
    grandchild: { en: 'Grandchildren', ar: 'أولاد الابن', ml: 'പേരക്കുട്ടികൾ' },
    grandparent: { en: 'Grandparents', ar: 'الأجداد', ml: 'ഉപ്പപ്പ ഉമ്മമ്മ' },
    sibling: { en: 'Siblings', ar: 'الإخوة', ml: 'സഹോദരങ്ങൾ' },
  };

  const updateCount = (heirType: string, delta: number, maxCount: number) => {
    setHeirCounts(prev => {
      const current = prev[heirType] || 0;
      const newCount = Math.max(0, Math.min(maxCount, current + delta));
      return { ...prev, [heirType]: newCount };
    });
  };

  const totalSelected = Object.values(heirCounts).reduce((sum, count) => sum + count, 0);

  const parseNumber = (value: string): number => {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const formatNumber = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  const handleCalculate = () => {
    const total = parseNumber(totalValue);
    if (total <= 0) {
      Alert.alert('Error', 'Please enter a valid estate value');
      return;
    }

    const selectedHeirs: Heir[] = Object.entries(heirCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count], index) => {
        const config = HEIR_CONFIGS.find(c => c.type === type);
        if (!config) return null;
        return {
          id: `${type}-${index}`,
          type: config.type,
          label: config.label,
          labelArabic: config.labelArabic,
          labelMalayalam: config.labelMalayalam,
          count,
          gender: config.gender,
        } as Heir;
      })
      .filter(Boolean) as Heir[];

    const deceased: DeceasedInfo = { gender: deceasedGender! };
    const estate: Estate = {
      totalValue: total,
      currency,
      debts: parseNumber(debts),
      wasiyyah: parseNumber(wasiyyah),
      funeralExpenses: parseNumber(funeralExpenses),
    };

    const calculationResult = calculateInheritance(deceased, selectedHeirs, estate);
    setResult(calculationResult);
    setStep('results');
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleShare = async () => {
    if (!result) return;
    
    let shareText = `Farā'iḍ Inheritance Distribution\n`;
    shareText += `================================\n\n`;
    shareText += `Total Estate: ${formatCurrency(result.estate.totalValue)}\n`;
    shareText += `Net Estate: ${formatCurrency(result.netEstate)}\n\n`;
    shareText += `Distribution:\n`;
    
    for (const share of result.heirs) {
      shareText += `• ${share.heir.label}: ${share.shareDescription} = ${formatCurrency(share.amount)}\n`;
    }
    
    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const resetCalculator = () => {
    setStep('gender');
    setDeceasedGender(null);
    setHeirCounts({});
    setTotalValue('');
    setDebts('');
    setWasiyyah('');
    setFuneralExpenses('');
    setResult(null);
  };

  // Render Gender Selection
  const renderGenderSelection = () => (
    <View style={styles.centerContent}>
      <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 18 : 22 }]}>
        {isMalayalam ? 'മയ്യിത്തിന്റെ ലിംഗം തിരഞ്ഞെടുക്കുക' : 'What is the gender of the Mayyith?'}
      </Text>
      <Text style={[styles.stepSubtitle, { color: isDark ? '#B0BEC5' : '#757575', fontSize: isMalayalam ? 14 : 16 }]}>
        ما هو جنس المتوفى؟
      </Text>

      <View style={styles.genderOptions}>
        <TouchableOpacity
          style={[styles.genderCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
          onPress={() => { setDeceasedGender('male'); setStep('heirs'); }}
        >
          <Ionicons name="man" size={48} color={Colors[isDark ? 'dark' : 'light'].primary} />
          <Text style={[styles.genderLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 16 : 18 }]}>
            {isMalayalam ? 'പുരുഷൻ' : 'Male'}
          </Text>
          <Text style={[styles.genderLabelArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>ذكر</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
          onPress={() => { setDeceasedGender('female'); setStep('heirs'); }}
        >
          <Ionicons name="woman" size={48} color={Colors[isDark ? 'dark' : 'light'].primary} />
          <Text style={[styles.genderLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 16 : 18 }]}>
            {isMalayalam ? 'സ്ത്രീ' : 'Female'}
          </Text>
          <Text style={[styles.genderLabelArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>أنثى</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Heir Selection
  const renderHeirSelection = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoBar, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]}>
        <Text style={[styles.infoText, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
          {isMalayalam 
            ? `മയ്യിത്ത്: ${deceasedGender === 'male' ? 'പുരുഷൻ' : 'സ്ത്രീ'} | തിരഞ്ഞെടുത്തത്: ${totalSelected} അവകാശി${totalSelected !== 1 ? 'കൾ' : ''}`
            : `Deceased: ${deceasedGender === 'male' ? 'Male' : 'Female'} | Selected: ${totalSelected} heir${totalSelected !== 1 ? 's' : ''}`
          }
        </Text>
      </View>

      {Object.entries(groupedHeirs).map(([category, heirs]) => (
        <View key={category} style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.categoryHeader}>
            <Text style={[styles.categoryTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 14 : 16 }]}>
              {isMalayalam ? categoryLabels[category]?.ml : categoryLabels[category]?.en || category}
            </Text>
            <Text style={[styles.categoryTitleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
              {categoryLabels[category]?.ar || ''}
            </Text>
          </View>
          
          {heirs.map(heir => (
            <View key={heir.type} style={styles.heirRow}>
              <View style={styles.heirInfo}>
                <Text style={[styles.heirLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 13 : 15 }]}>
                  {isMalayalam && heir.labelMalayalam ? heir.labelMalayalam : heir.label}
                </Text>
                <Text style={[styles.heirLabelArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                  {heir.labelArabic}
                </Text>
              </View>
              
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]}
                  onPress={() => updateCount(heir.type, -1, heir.maxCount)}
                  disabled={(heirCounts[heir.type] || 0) === 0}
                >
                  <Text style={[styles.counterButtonText, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.countText, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>
                  {heirCounts[heir.type] || 0}
                </Text>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]}
                  onPress={() => updateCount(heir.type, 1, heir.maxCount)}
                  disabled={(heirCounts[heir.type] || 0) >= heir.maxCount}
                >
                  <Text style={[styles.counterButtonText, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Render Estate Input
  const renderEstateInput = () => (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>
            {labels.totalEstate}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            قيمة التركة
          </Text>

          <TouchableOpacity
            style={[styles.currencyButton, { borderColor: isDark ? Colors.dark.primary : Colors.light.primary }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <Text style={[styles.currencyButtonText, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>
              {currency} ({currencySymbol})
            </Text>
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <Text style={[styles.inputPrefix, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>{currencySymbol}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={totalValue}
              onChangeText={(text) => setTotalValue(formatNumber(text))}
              keyboardType="decimal-pad"
              placeholder={labels.totalEstate}
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />
          </View>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 16 : 18 }]}>
            {labels.deductions}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            الخصومات
          </Text>

          <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 12 : 14 }]}>{labels.outstandingDebts}</Text>
          <View style={styles.inputRow}>
            <Text style={[styles.inputPrefix, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{currencySymbol}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={debts}
              onChangeText={(text) => setDebts(formatNumber(text))}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />
          </View>

          <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 12 : 14 }]}>{labels.funeralExpenses}</Text>
          <View style={styles.inputRow}>
            <Text style={[styles.inputPrefix, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{currencySymbol}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={funeralExpenses}
              onChangeText={(text) => setFuneralExpenses(formatNumber(text))}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />
          </View>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 16 : 18 }]}>
            {labels.wasiyyah}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            الوصية - حد أقصى ⅓
          </Text>

          <View style={styles.inputRow}>
            <Text style={[styles.inputPrefix, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{currencySymbol}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              value={wasiyyah}
              onChangeText={(text) => setWasiyyah(formatNumber(text))}
              keyboardType="decimal-pad"
              placeholder="0 (max 1/3 of estate)"
              placeholderTextColor={isDark ? '#757575' : '#BDBDBD'}
            />
          </View>
        </View>

        {/* Summary */}
        <View style={[styles.categoryCard, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]}>
          <Text style={[styles.summaryTitle, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>{labels.summary}</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDark ? '#E8F5E9' : '#FFFFFF' }]}>{labels.totalEstate}:</Text>
            <Text style={[styles.summaryValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>{currencySymbol}{parseNumber(totalValue).toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDark ? '#E8F5E9' : '#FFFFFF' }]}>{labels.lessDebts}</Text>
            <Text style={[styles.deductionValue, { color: '#C62828' }]}>-{currencySymbol}{parseNumber(debts).toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDark ? '#E8F5E9' : '#FFFFFF' }]}>{labels.lessFuneral}</Text>
            <Text style={[styles.deductionValue, { color: '#C62828' }]}>-{currencySymbol}{parseNumber(funeralExpenses).toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: isDark ? Colors.dark.accent : Colors.light.accent, paddingTop: 8, marginTop: 8 }]}>
            <Text style={[styles.netLabel, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>{labels.netEstate}</Text>
            <Text style={[styles.netValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
              {currencySymbol}{Math.max(0, parseNumber(totalValue) - parseNumber(debts) - parseNumber(funeralExpenses) - Math.min(parseNumber(wasiyyah), (parseNumber(totalValue) - parseNumber(debts) - parseNumber(funeralExpenses)) / 3)).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Render Results
  const renderResults = () => {
    if (!result) return null;

    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Estate Summary */}
        <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 16 : 18 }]}>{labels.estateSummary}</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: isDark ? '#B0BEC5' : '#757575', fontSize: isMalayalam ? 12 : 14 }]}>{labels.totalEstate}:</Text>
            <Text style={[styles.summaryValue, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>{formatCurrency(result.estate.totalValue)}</Text>
          </View>
          {result.estate.debts > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#B0BEC5' : '#757575', fontSize: isMalayalam ? 12 : 14 }]}>{labels.debts}</Text>
              <Text style={styles.deductionValue}>-{formatCurrency(result.estate.debts)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#E0E0E0', paddingTop: 8, marginTop: 8 }]}>
            <Text style={[styles.netLabel, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 14 : 16 }]}>{labels.netEstate}</Text>
            <Text style={[styles.netValue, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>{formatCurrency(result.netEstate)}</Text>
          </View>
        </View>

        {/* Status Badges */}
        {(result.awl || result.radd) && (
          <View style={styles.badgeContainer}>
            {result.awl && (
              <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.badgeText}>{isMalayalam ? 'ഔൽ പ്രയോഗിച്ചു (العول)' : "'Awl Applied (العول)"}</Text>
              </View>
            )}
            {result.radd && (
              <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.badgeText}>{isMalayalam ? 'റദ്ദ് പ്രയോഗിച്ചു (الرد)' : 'Radd Applied (الرد)'}</Text>
              </View>
            )}
          </View>
        )}

        {/* Distribution */}
        <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.primary : Colors.light.primary, fontSize: isMalayalam ? 16 : 18 }]}>{labels.distribution}</Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>توزيع الميراث</Text>

          {result.heirs.map((share, index) => (
            <View key={index} style={[styles.distributionRow, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
              <View style={styles.heirInfo}>
                <Text style={[styles.heirLabel, { color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: isMalayalam ? 13 : 15 }]}>
                  {isMalayalam && share.heir.labelMalayalam ? share.heir.labelMalayalam : share.heir.label} {share.heir.count > 1 && `(×${share.heir.count})`}
                </Text>
                <Text style={[styles.heirLabelArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                  {share.heir.labelArabic}
                </Text>
              </View>
              <View style={styles.shareInfo}>
                <Text style={[styles.shareText, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}>
                  {share.shareDescription}
                </Text>
                <Text style={[styles.amountText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {formatCurrency(share.amount)}
                </Text>
                {share.heir.count > 1 && (
                  <Text style={[styles.perPersonText, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                    ({formatCurrency(share.amount / share.heir.count)} {labels.each})
                  </Text>
                )}
              </View>
            </View>
          ))}

          <View style={[styles.totalRow, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]}>
            <Text style={[styles.totalLabel, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>{labels.totalDistributed}</Text>
            <Text style={[styles.totalValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>{formatCurrency(result.totalDistributed)}</Text>
          </View>
        </View>

        {/* Blocked Heirs */}
        {result.blockedHeirs.length > 0 && (
          <View style={[styles.categoryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: '#C62828' }]}>{labels.blockedHeirs} (المحجوبون)</Text>
            {result.blockedHeirs.map((blocked, index) => (
              <View key={index} style={styles.blockedRow}>
                <Text style={[styles.blockedName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {isMalayalam && blocked.heir.labelMalayalam ? blocked.heir.labelMalayalam : blocked.heir.label} ({blocked.heir.labelArabic})
                </Text>
                <Text style={[styles.blockedReason, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                  {labels.blockedBy} {blocked.blockedBy}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.categoryCard, { backgroundColor: '#FFF8E1' }]}>
          <Text style={styles.disclaimerText}>
            {labels.disclaimer}
          </Text>
          <Text style={styles.disclaimerArabic}>
            هذه الحسابات للأغراض التعليمية فقط. يرجى استشارة عالم شرعي مؤهل للفتاوى الرسمية.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  // Render footer buttons
  const renderFooter = () => {
    if (step === 'gender') return null;

    return (
      <View style={[styles.footer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        {step === 'heirs' && (
          <>
            <TouchableOpacity style={[styles.backBtn, { borderColor: Colors[isDark ? 'dark' : 'light'].primary }]} onPress={() => setStep('gender')}>
              <Text style={[styles.backBtnText, { color: Colors[isDark ? 'dark' : 'light'].primary }]}>{labels.back}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: totalSelected > 0 ? Colors[isDark ? 'dark' : 'light'].primary : Colors[isDark ? 'dark' : 'light'].accent }]}
              onPress={() => setStep('estate')}
              disabled={totalSelected === 0}
            >
              <Text style={styles.nextBtnText}>{labels.continue}</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 'estate' && (
          <>
            <TouchableOpacity style={[styles.backBtn, { borderColor: Colors[isDark ? 'dark' : 'light'].primary }]} onPress={() => setStep('heirs')}>
              <Text style={[styles.backBtnText, { color: Colors[isDark ? 'dark' : 'light'].primary }]}>{labels.back}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: parseNumber(totalValue) > 0 ? Colors[isDark ? 'dark' : 'light'].primary : Colors[isDark ? 'dark' : 'light'].accent }]}
              onPress={handleCalculate}
              disabled={parseNumber(totalValue) <= 0}
            >
              <Text style={styles.nextBtnText}>{labels.calculate}</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 'results' && (
          <>
            <TouchableOpacity style={[styles.backBtn, { borderColor: Colors[isDark ? 'dark' : 'light'].primary }]} onPress={handleShare}>
              <Text style={[styles.backBtnText, { color: Colors[isDark ? 'dark' : 'light'].primary }]}>{labels.share}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: Colors[isDark ? 'dark' : 'light'].primary }]} onPress={resetCalculator}>
              <Text style={styles.nextBtnText}>{labels.newCalculation}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={[styles.headerBackIcon, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors[isDark ? 'dark' : 'light'].primary, fontSize: isMalayalam ? 20 : 24, textAlign: 'center', flex: 1, textAlignVertical: 'center' }]}>{isMalayalam ? 'ഫറാഇദ് കാൽക്കുലേറ്റർ' : "Farā'iḍ Calculator"}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        {['gender', 'heirs', 'estate', 'results'].map((s, index) => (
          <View key={s} style={styles.progressItem}>
            <View style={[
              styles.progressDot,
              { backgroundColor: step === s ? Colors[isDark ? 'dark' : 'light'].primary : (index < ['gender', 'heirs', 'estate', 'results'].indexOf(step) ? Colors[isDark ? 'dark' : 'light'].primary : Colors[isDark ? 'dark' : 'light'].accent) }
            ]} />
            {index < 3 && <View style={[styles.progressLine, { backgroundColor: index < ['gender', 'heirs', 'estate', 'results'].indexOf(step) ? Colors[isDark ? 'dark' : 'light'].primary : Colors[isDark ? 'dark' : 'light'].accent }]} />}
          </View>
        ))}
      </View>

      {/* Content */}
      {step === 'gender' && renderGenderSelection()}
      {step === 'heirs' && renderHeirSelection()}
      {step === 'estate' && renderEstateInput()}
      {step === 'results' && renderResults()}

      {/* Footer */}
      {renderFooter()}

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Select Currency</Text>
            {CURRENCIES.map(curr => (
              <TouchableOpacity
                key={curr.code}
                style={[styles.currencyOption, currency === curr.code && { backgroundColor: Colors[isDark ? 'dark' : 'light'].primary }]}
                onPress={() => { setCurrency(curr.code); setShowCurrencyModal(false); }}
              >
                <Text style={[styles.currencyOptionText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {curr.symbol} - {curr.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowCurrencyModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, minHeight: 56 },
  headerBackButton: { padding: 4, justifyContent: 'center', alignItems: 'center' },
  headerRightPlaceholder: { width: 32 },
  headerBackIcon: { fontSize: 24, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 2 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  progressDot: { width: 12, height: 12, borderRadius: 6 },
  progressLine: { width: 40, height: 2 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  stepTitle: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  stepSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  genderOptions: { flexDirection: 'row', gap: 20 },
  genderCard: { width: '38%', maxWidth: 160, aspectRatio: 0.875, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  genderIcon: { fontSize: 48, marginBottom: 8 },
  genderLabel: { fontSize: 18, fontWeight: '600' },
  genderLabelArabic: { fontSize: 14, marginTop: 4 },
  scrollView: { flex: 1 },
  infoBar: { flexDirection: 'row', padding: 12, margin: 16, marginBottom: 0, borderRadius: 12 },
  infoText: { fontSize: 14, fontWeight: '500' },
  categoryCard: { margin: 16, marginBottom: 0, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.light.accent, paddingBottom: 8 },
  categoryTitle: { fontSize: 16, fontWeight: '700' },
  categoryTitleArabic: { fontSize: 14 },
  heirRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.light.accent },
  heirInfo: { flex: 1 },
  heirLabel: { fontSize: 15, fontWeight: '500' },
  heirLabelArabic: { fontSize: 12, marginTop: 2 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { fontSize: 20, fontWeight: '600' },
  countText: { width: 32, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, marginBottom: 16 },
  currencyButton: { borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 16 },
  currencyButtonText: { fontSize: 16, fontWeight: '600' },
  inputLabel: { fontSize: 14, marginBottom: 4, marginTop: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputPrefix: { fontSize: 18, fontWeight: '600', marginRight: 8 },
  input: { flex: 1, height: 48, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  summaryTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  deductionValue: { fontSize: 14, color: '#C62828' },
  netLabel: { fontSize: 16, fontWeight: '700' },
  netValue: { fontSize: 16, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  backBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontSize: 16, fontWeight: '600' },
  nextBtn: { flex: 2, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  badgeContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16, marginHorizontal: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600', color: Colors.light.text },
  distributionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1 },
  shareInfo: { alignItems: 'flex-end' },
  shareText: { fontSize: 14, fontWeight: '600' },
  amountText: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  perPersonText: { fontSize: 11, marginTop: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 16, fontWeight: '700' },
  blockedRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.light.accent },
  blockedName: { fontSize: 14, fontWeight: '600' },
  blockedReason: { fontSize: 12, marginTop: 2 },
  disclaimerText: { fontSize: 12, color: Colors.light.text, lineHeight: 18 },
  disclaimerArabic: { fontSize: 12, color: Colors.light.text, marginTop: 8, lineHeight: 20 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  currencyOption: { padding: 16, borderRadius: 8, marginBottom: 8 },
  currencyOptionText: { fontSize: 16 },
  modalClose: { padding: 16, alignItems: 'center', marginTop: 8 },
  modalCloseText: { fontSize: 16, color: '#C62828', fontWeight: '600' },
});
