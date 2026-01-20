/**
 * Farā'iḍ (Islamic Inheritance Law) Calculator
 * Based on the Hanafi school of thought with support for other madhabs
 */

import {
    BlockedHeir,
    DeceasedInfo,
    Estate,
    Fraction,
    Heir,
    HeirShare,
    HeirType,
    InheritanceResult,
} from '@/types/inheritance';

// Utility functions for fraction arithmetic
export const fractionUtils = {
  create: (numerator: number, denominator: number): Fraction => {
    const gcd = fractionUtils.gcd(Math.abs(numerator), Math.abs(denominator));
    return {
      numerator: numerator / gcd,
      denominator: denominator / gcd,
    };
  },

  gcd: (a: number, b: number): number => {
    return b === 0 ? a : fractionUtils.gcd(b, a % b);
  },

  lcm: (a: number, b: number): number => {
    return (a * b) / fractionUtils.gcd(a, b);
  },

  add: (f1: Fraction, f2: Fraction): Fraction => {
    const lcm = fractionUtils.lcm(f1.denominator, f2.denominator);
    const num1 = f1.numerator * (lcm / f1.denominator);
    const num2 = f2.numerator * (lcm / f2.denominator);
    return fractionUtils.create(num1 + num2, lcm);
  },

  multiply: (f1: Fraction, f2: Fraction): Fraction => {
    return fractionUtils.create(f1.numerator * f2.numerator, f1.denominator * f2.denominator);
  },

  divideByNumber: (f: Fraction, n: number): Fraction => {
    return fractionUtils.create(f.numerator, f.denominator * n);
  },

  toDecimal: (f: Fraction): number => {
    return f.numerator / f.denominator;
  },

  toString: (f: Fraction): string => {
    if (f.numerator === 0) return '0';
    if (f.denominator === 1) return f.numerator.toString();
    return `${f.numerator}/${f.denominator}`;
  },

  zero: (): Fraction => ({ numerator: 0, denominator: 1 }),
};

/**
 * Main inheritance calculator class
 */
export class FaraidCalculator {
  private deceased: DeceasedInfo;
  private heirs: Heir[];
  private estate: Estate;
  private notes: string[] = [];
  private notesArabic: string[] = [];

  constructor(deceased: DeceasedInfo, heirs: Heir[], estate: Estate) {
    this.deceased = deceased;
    this.heirs = heirs.filter(h => h.count > 0);
    this.estate = estate;
  }

  private calculateNetEstate(): number {
    const afterDebts = this.estate.totalValue - this.estate.debts - this.estate.funeralExpenses;
    const maxWasiyyah = afterDebts / 3;
    const actualWasiyyah = Math.min(this.estate.wasiyyah, maxWasiyyah);
    
    if (this.estate.wasiyyah > maxWasiyyah) {
      this.notes.push(`Bequest reduced from ${this.estate.wasiyyah} to ${maxWasiyyah.toFixed(2)} (max 1/3 of estate)`);
      this.notesArabic.push(`تم تخفيض الوصية من ${this.estate.wasiyyah} إلى ${maxWasiyyah.toFixed(2)} (الحد الأقصى ثلث التركة)`);
    }

    return afterDebts - actualWasiyyah;
  }

  private getBlockingInfo(heirType: HeirType): { blocked: boolean; blockedBy: string; blockedByArabic: string; blockedByMalayalam: string; reason: string; reasonArabic: string; reasonMalayalam: string } | null {
    const hasHeir = (type: HeirType) => this.heirs.some(h => h.type === type && h.count > 0);
    
    switch (heirType) {
      case 'grandfather':
        if (hasHeir('father')) {
          return {
            blocked: true,
            blockedBy: 'Father',
            blockedByArabic: 'الأب',
            blockedByMalayalam: 'Father',
            reason: 'Grandfather is blocked by father (closer in lineage)',
            reasonArabic: 'الجد محجوب بالأب لأنه أقرب درجة',
            reasonMalayalam: 'Grandfather is blocked by father'
          };
        }
        return null;
      
      case 'grandmother':
        if (hasHeir('mother')) {
          return {
            blocked: true,
            blockedBy: 'Mother',
            blockedByArabic: 'الأم',
            blockedByMalayalam: 'Mother',
            reason: 'Grandmother is blocked by mother (closer in lineage)',
            reasonArabic: 'الجدة محجوبة بالأم لأنها أقرب درجة',
            reasonMalayalam: 'Grandmother is blocked by mother'
          };
        }
        return null;
      
      case 'son_of_son':
        if (hasHeir('son')) {
          return {
            blocked: true,
            blockedBy: 'Son',
            blockedByArabic: 'الابن',
            blockedByMalayalam: 'Son',
            reason: 'Grandson is blocked by son (closer in lineage)',
            reasonArabic: 'ابن الابن محجوب بالابن لأنه أقرب درجة',
            reasonMalayalam: 'Grandson is blocked by son'
          };
        }
        return null;
        
      case 'daughter_of_son':
        if (hasHeir('son')) {
          return {
            blocked: true,
            blockedBy: 'Son',
            blockedByArabic: 'الابن',
            blockedByMalayalam: 'Son',
            reason: 'Granddaughter is blocked by son (closer in lineage)',
            reasonArabic: 'بنت الابن محجوبة بالابن لأنه أقرب درجة',
            reasonMalayalam: 'Granddaughter is blocked by son'
          };
        }
        return null;
      
      case 'full_brother':
        if (hasHeir('father')) {
          return { blocked: true, blockedBy: 'Father', blockedByArabic: 'الأب', blockedByMalayalam: 'Father', reason: 'Full brother is blocked by father', reasonArabic: 'الأخ الشقيق محجوب بالأب', reasonMalayalam: 'Full brother is blocked by father' };
        }
        if (hasHeir('son')) {
          return { blocked: true, blockedBy: 'Son', blockedByArabic: 'الابن', blockedByMalayalam: 'Son', reason: 'Full brother is blocked by son', reasonArabic: 'الأخ الشقيق محجوب بالابن', reasonMalayalam: 'Full brother is blocked by son' };
        }
        if (hasHeir('son_of_son')) {
          return { blocked: true, blockedBy: 'Grandson', blockedByArabic: 'ابن الابن', blockedByMalayalam: 'Grandson', reason: 'Full brother is blocked by grandson', reasonArabic: 'الأخ الشقيق محجوب بابن الابن', reasonMalayalam: 'Full brother is blocked by grandson' };
        }
        return null;
        
      case 'full_sister':
        if (hasHeir('father')) {
          return { blocked: true, blockedBy: 'Father', blockedByArabic: 'الأب', blockedByMalayalam: 'Father', reason: 'Full sister is blocked by father', reasonArabic: 'الأخت الشقيقة محجوبة بالأب', reasonMalayalam: 'Full sister is blocked by father' };
        }
        if (hasHeir('son')) {
          return { blocked: true, blockedBy: 'Son', blockedByArabic: 'الابن', blockedByMalayalam: 'Son', reason: 'Full sister is blocked by son', reasonArabic: 'الأخت الشقيقة محجوبة بالابن', reasonMalayalam: 'Full sister is blocked by son' };
        }
        if (hasHeir('son_of_son')) {
          return { blocked: true, blockedBy: 'Grandson', blockedByArabic: 'ابن الابن', blockedByMalayalam: 'Grandson', reason: 'Full sister is blocked by grandson', reasonArabic: 'الأخت الشقيقة محجوبة بابن الابن', reasonMalayalam: 'Full sister is blocked by grandson' };
        }
        return null;
      
      case 'paternal_brother':
        if (hasHeir('father')) {
          return { blocked: true, blockedBy: 'Father', blockedByArabic: 'الأب', blockedByMalayalam: 'Father', reason: 'Paternal half-brother is blocked by father', reasonArabic: 'الأخ لأب محجوب بالأب', reasonMalayalam: 'Paternal half-brother is blocked' };
        }
        if (hasHeir('son') || hasHeir('son_of_son') || hasHeir('full_brother')) {
          return { blocked: true, blockedBy: 'Closer heir', blockedByArabic: 'وارث أقرب', blockedByMalayalam: 'Closer heir', reason: 'Paternal half-brother is blocked', reasonArabic: 'الأخ لأب محجوب', reasonMalayalam: 'Blocked by closer heir' };
        }
        return null;
        
      case 'paternal_sister':
        if (hasHeir('father') || hasHeir('son') || hasHeir('son_of_son') || hasHeir('full_brother')) {
          return { blocked: true, blockedBy: 'Closer heir', blockedByArabic: 'وارث أقرب', blockedByMalayalam: 'Closer heir', reason: 'Paternal half-sister is blocked', reasonArabic: 'الأخت لأب محجوبة', reasonMalayalam: 'Blocked by closer heir' };
        }
        return null;
      
      case 'maternal_brother':
      case 'maternal_sister':
        if (hasHeir('father') || hasHeir('grandfather') || hasHeir('son') || hasHeir('daughter') || hasHeir('son_of_son') || hasHeir('daughter_of_son')) {
          return { blocked: true, blockedBy: 'Closer heir', blockedByArabic: 'وارث أقرب', blockedByMalayalam: 'Closer heir', reason: 'Maternal sibling is blocked', reasonArabic: 'الأخ/الأخت لأم محجوب(ة)', reasonMalayalam: 'Blocked by closer heir' };
        }
        return null;
      
      default:
        return null;
    }
  }

  private isBlocked(heirType: HeirType): boolean {
    return this.getBlockingInfo(heirType) !== null;
  }

  private getHeirShare(heir: Heir): { share: Fraction; rule: string; ruleArabic: string; ruleMalayalam: string } {
    const hasHeir = (type: HeirType) => this.heirs.some(h => h.type === type && h.count > 0);
    const hasMaleDescendant = hasHeir('son') || hasHeir('son_of_son');
    const hasFemaleDescendant = hasHeir('daughter') || hasHeir('daughter_of_son');
    const hasDescendant = hasMaleDescendant || hasFemaleDescendant;

    switch (heir.type) {
      case 'husband':
        if (hasDescendant) {
          return { share: fractionUtils.create(1, 4), rule: 'Husband gets 1/4 when deceased has children', ruleArabic: 'للزوج الربع مع وجود الفرع الوارث', ruleMalayalam: '1/4 with children' };
        }
        return { share: fractionUtils.create(1, 2), rule: 'Husband gets 1/2 when deceased has no children', ruleArabic: 'للزوج النصف عند عدم وجود الفرع الوارث', ruleMalayalam: '1/2 without children' };

      case 'wife':
        if (hasDescendant) {
          return { share: fractionUtils.create(1, 8), rule: 'Wife/wives get 1/8 when deceased has children', ruleArabic: 'للزوجة أو الزوجات الثمن مع وجود الفرع الوارث', ruleMalayalam: '1/8 with children' };
        }
        return { share: fractionUtils.create(1, 4), rule: 'Wife/wives get 1/4 when deceased has no children', ruleArabic: 'للزوجة أو الزوجات الربع عند عدم وجود الفرع الوارث', ruleMalayalam: '1/4 without children' };

      case 'father':
        if (hasMaleDescendant) {
          return { share: fractionUtils.create(1, 6), rule: 'Father gets 1/6 when deceased has male children', ruleArabic: 'للأب السدس فرضاً مع وجود الابن', ruleMalayalam: '1/6 with sons' };
        }
        if (hasFemaleDescendant) {
          return { share: fractionUtils.create(1, 6), rule: 'Father gets 1/6 + residue when deceased has only daughters', ruleArabic: 'للأب السدس + الباقي مع وجود البنات', ruleMalayalam: '1/6 + residue with daughters' };
        }
        return { share: fractionUtils.create(0, 1), rule: 'Father gets residue (asaba) when no children', ruleArabic: 'للأب الباقي تعصيباً', ruleMalayalam: 'Residue without children' };

      case 'mother':
        const hasMultipleSiblings = (
          (this.heirs.find(h => h.type === 'full_brother')?.count || 0) +
          (this.heirs.find(h => h.type === 'full_sister')?.count || 0) +
          (this.heirs.find(h => h.type === 'paternal_brother')?.count || 0) +
          (this.heirs.find(h => h.type === 'paternal_sister')?.count || 0) +
          (this.heirs.find(h => h.type === 'maternal_brother')?.count || 0) +
          (this.heirs.find(h => h.type === 'maternal_sister')?.count || 0)
        ) >= 2;

        if (hasDescendant || hasMultipleSiblings) {
          return { share: fractionUtils.create(1, 6), rule: 'Mother gets 1/6 when deceased has children or 2+ siblings', ruleArabic: 'للأم السدس مع وجود الفرع الوارث أو جمع من الإخوة', ruleMalayalam: '1/6' };
        }
        return { share: fractionUtils.create(1, 3), rule: 'Mother gets 1/3 when no children and less than 2 siblings', ruleArabic: 'للأم الثلث', ruleMalayalam: '1/3' };

      case 'son':
        return { share: fractionUtils.create(0, 1), rule: 'Sons are residuary heirs (asaba)', ruleArabic: 'الابن عصبة بالنفس', ruleMalayalam: 'Residuary heir' };

      case 'daughter':
        if (hasHeir('son')) {
          return { share: fractionUtils.create(0, 1), rule: 'Daughter becomes residuary with son', ruleArabic: 'البنت عصبة بالغير مع الابن', ruleMalayalam: 'Residuary with son' };
        }
        if (heir.count === 1) {
          return { share: fractionUtils.create(1, 2), rule: 'Single daughter gets 1/2', ruleArabic: 'للبنت الواحدة النصف', ruleMalayalam: '1/2' };
        }
        return { share: fractionUtils.create(2, 3), rule: 'Two or more daughters share 2/3', ruleArabic: 'للبنتين فأكثر الثلثان', ruleMalayalam: '2/3' };

      case 'son_of_son':
        return { share: fractionUtils.create(0, 1), rule: 'Grandson is residuary heir', ruleArabic: 'ابن الابن عصبة بالنفس', ruleMalayalam: 'Residuary heir' };

      case 'daughter_of_son':
        if (hasHeir('son_of_son')) {
          return { share: fractionUtils.create(0, 1), rule: 'Granddaughter becomes residuary with grandson', ruleArabic: 'بنت الابن عصبة بالغير', ruleMalayalam: 'Residuary with grandson' };
        }
        const daughtersCount = this.heirs.find(h => h.type === 'daughter')?.count || 0;
        if (daughtersCount >= 2) {
          return { share: fractionUtils.create(0, 1), rule: 'Granddaughter blocked by 2+ daughters', ruleArabic: 'بنت الابن محجوبة', ruleMalayalam: 'Blocked' };
        }
        if (daughtersCount === 1) {
          return { share: fractionUtils.create(1, 6), rule: 'Granddaughter gets 1/6 with one daughter', ruleArabic: 'لبنت الابن السدس تكملة للثلثين', ruleMalayalam: '1/6' };
        }
        if (heir.count === 1) {
          return { share: fractionUtils.create(1, 2), rule: 'Single granddaughter gets 1/2', ruleArabic: 'لبنت الابن الواحدة النصف', ruleMalayalam: '1/2' };
        }
        return { share: fractionUtils.create(2, 3), rule: 'Two or more granddaughters share 2/3', ruleArabic: 'لبنتي الابن فأكثر الثلثان', ruleMalayalam: '2/3' };

      case 'grandfather':
        if (hasMaleDescendant) {
          return { share: fractionUtils.create(1, 6), rule: 'Grandfather gets 1/6 with male descendants', ruleArabic: 'للجد السدس', ruleMalayalam: '1/6' };
        }
        if (hasFemaleDescendant) {
          return { share: fractionUtils.create(1, 6), rule: 'Grandfather gets 1/6 + residue with female descendants', ruleArabic: 'للجد السدس + الباقي', ruleMalayalam: '1/6 + residue' };
        }
        return { share: fractionUtils.create(0, 1), rule: 'Grandfather is residuary when no descendants', ruleArabic: 'الجد عصبة', ruleMalayalam: 'Residuary' };

      case 'grandmother':
        return { share: fractionUtils.create(1, 6), rule: 'Grandmother(s) share 1/6', ruleArabic: 'للجدة أو الجدات السدس', ruleMalayalam: '1/6' };

      case 'full_brother':
        return { share: fractionUtils.create(0, 1), rule: 'Full brother is residuary heir', ruleArabic: 'الأخ الشقيق عصبة بالنفس', ruleMalayalam: 'Residuary' };

      case 'full_sister':
        if (hasHeir('full_brother')) {
          return { share: fractionUtils.create(0, 1), rule: 'Full sister becomes residuary with full brother', ruleArabic: 'الأخت الشقيقة عصبة بالغير', ruleMalayalam: 'Residuary with brother' };
        }
        if (heir.count === 1) {
          return { share: fractionUtils.create(1, 2), rule: 'Single full sister gets 1/2', ruleArabic: 'للأخت الشقيقة الواحدة النصف', ruleMalayalam: '1/2' };
        }
        return { share: fractionUtils.create(2, 3), rule: 'Two or more full sisters share 2/3', ruleArabic: 'للأختين الشقيقتين فأكثر الثلثان', ruleMalayalam: '2/3' };

      case 'paternal_brother':
        return { share: fractionUtils.create(0, 1), rule: 'Paternal half-brother is residuary heir', ruleArabic: 'الأخ لأب عصبة', ruleMalayalam: 'Residuary' };

      case 'paternal_sister':
        if (hasHeir('paternal_brother')) {
          return { share: fractionUtils.create(0, 1), rule: 'Paternal half-sister becomes residuary', ruleArabic: 'الأخت لأب عصبة بالغير', ruleMalayalam: 'Residuary' };
        }
        const fullSisterCount = this.heirs.find(h => h.type === 'full_sister')?.count || 0;
        if (fullSisterCount >= 2) {
          return { share: fractionUtils.create(0, 1), rule: 'Paternal half-sister blocked by 2+ full sisters', ruleArabic: 'الأخت لأب محجوبة', ruleMalayalam: 'Blocked' };
        }
        if (fullSisterCount === 1) {
          return { share: fractionUtils.create(1, 6), rule: 'Paternal half-sister gets 1/6 with one full sister', ruleArabic: 'للأخت لأب السدس', ruleMalayalam: '1/6' };
        }
        if (heir.count === 1) {
          return { share: fractionUtils.create(1, 2), rule: 'Single paternal half-sister gets 1/2', ruleArabic: 'للأخت لأب الواحدة النصف', ruleMalayalam: '1/2' };
        }
        return { share: fractionUtils.create(2, 3), rule: 'Two or more paternal half-sisters share 2/3', ruleArabic: 'للأختين لأب فأكثر الثلثان', ruleMalayalam: '2/3' };

      case 'maternal_brother':
      case 'maternal_sister':
        const maternalSiblingCount = 
          (this.heirs.find(h => h.type === 'maternal_brother')?.count || 0) +
          (this.heirs.find(h => h.type === 'maternal_sister')?.count || 0);
        
        if (maternalSiblingCount === 1) {
          return { share: fractionUtils.create(1, 6), rule: 'Single maternal sibling gets 1/6', ruleArabic: 'للأخ أو الأخت لأم الواحد السدس', ruleMalayalam: '1/6' };
        }
        return { share: fractionUtils.create(1, 3), rule: 'Two or more maternal siblings share 1/3', ruleArabic: 'للإخوة لأم الثلث بالتساوي', ruleMalayalam: '1/3 shared' };

      default:
        return { share: fractionUtils.create(0, 1), rule: 'Unknown heir type', ruleArabic: 'نوع وارث غير معروف', ruleMalayalam: 'Unknown' };
    }
  }

  calculate(): InheritanceResult {
    const netEstate = this.calculateNetEstate();
    const shares: HeirShare[] = [];
    const blockedHeirs: BlockedHeir[] = [];
    let totalFixedShares = fractionUtils.zero();

    const processedTypes = new Set<HeirType>();

    for (const heir of this.heirs) {
      const blockingInfo = this.getBlockingInfo(heir.type);
      if (blockingInfo) {
        blockedHeirs.push({
          heir,
          blockedBy: blockingInfo.blockedBy,
          blockedByArabic: blockingInfo.blockedByArabic,
          blockedByMalayalam: blockingInfo.blockedByMalayalam,
          reason: blockingInfo.reason,
          reasonArabic: blockingInfo.reasonArabic,
          reasonMalayalam: blockingInfo.reasonMalayalam,
        });
        this.notes.push(`${heir.label} is blocked from inheritance`);
        this.notesArabic.push(`${heir.labelArabic} محجوب عن الميراث`);
        continue;
      }

      if ((heir.type === 'maternal_brother' || heir.type === 'maternal_sister') && 
          !processedTypes.has('maternal_brother') && !processedTypes.has('maternal_sister')) {
        processedTypes.add('maternal_brother');
        processedTypes.add('maternal_sister');
        
        const maternalBrothers = this.heirs.find(h => h.type === 'maternal_brother');
        const maternalSisters = this.heirs.find(h => h.type === 'maternal_sister');
        const totalMaternalSiblings = (maternalBrothers?.count || 0) + (maternalSisters?.count || 0);
        
        if (totalMaternalSiblings > 0) {
          const { share, rule, ruleArabic, ruleMalayalam } = this.getHeirShare(heir);
          
          if (maternalBrothers && maternalBrothers.count > 0) {
            const individualShare = fractionUtils.divideByNumber(share, totalMaternalSiblings);
            shares.push({
              heir: maternalBrothers,
              share: individualShare,
              shareDescription: `${fractionUtils.toString(individualShare)} each`,
              shareDescriptionArabic: `${fractionUtils.toString(individualShare)} لكل واحد`,
              amount: 0, percentage: 0, rule, ruleArabic, ruleMalayalam,
              isPerPerson: true,
            });
            totalFixedShares = fractionUtils.add(totalFixedShares, 
              fractionUtils.create(individualShare.numerator * maternalBrothers.count, individualShare.denominator));
          }
          
          if (maternalSisters && maternalSisters.count > 0) {
            const individualShare = fractionUtils.divideByNumber(share, totalMaternalSiblings);
            shares.push({
              heir: maternalSisters,
              share: individualShare,
              shareDescription: `${fractionUtils.toString(individualShare)} each`,
              shareDescriptionArabic: `${fractionUtils.toString(individualShare)} لكل واحد`,
              amount: 0, percentage: 0, rule, ruleArabic, ruleMalayalam,
              isPerPerson: true,
            });
            totalFixedShares = fractionUtils.add(totalFixedShares, 
              fractionUtils.create(individualShare.numerator * maternalSisters.count, individualShare.denominator));
          }
        }
        continue;
      }

      if (processedTypes.has(heir.type)) continue;
      processedTypes.add(heir.type);

      const { share, rule, ruleArabic, ruleMalayalam } = this.getHeirShare(heir);
      
      if (share.numerator > 0) {
        shares.push({
          heir,
          share,
          shareDescription: fractionUtils.toString(share),
          shareDescriptionArabic: fractionUtils.toString(share),
          amount: 0, percentage: 0, rule, ruleArabic, ruleMalayalam,
          isPerPerson: false,
        });
        totalFixedShares = fractionUtils.add(totalFixedShares, share);
      }
    }

    const residueFraction = fractionUtils.create(
      totalFixedShares.denominator - totalFixedShares.numerator,
      totalFixedShares.denominator
    );

    const asabaHeirs = this.getAsabaHeirs();
    if (asabaHeirs.length > 0 && residueFraction.numerator > 0) {
      this.distributeResidue(shares, asabaHeirs, residueFraction);
    }

    let aslAlMasala = 1;
    for (const share of shares) {
      aslAlMasala = fractionUtils.lcm(aslAlMasala, share.share.denominator);
    }

    let awl = false;
    if (fractionUtils.toDecimal(totalFixedShares) > 1 && asabaHeirs.length === 0) {
      awl = true;
      this.notes.push("'Awl applied: Fixed shares exceed estate");
      this.notesArabic.push("تم تطبيق العول");
    }

    let radd = false;
    if (residueFraction.numerator > 0 && asabaHeirs.length === 0) {
      radd = true;
      this.notes.push("Radd applied: Excess returned to eligible heirs");
      this.notesArabic.push("تم تطبيق الرد");
      this.applyRadd(shares, residueFraction);
    }

    let totalDistributed = 0;
    const effectiveTotal = awl ? fractionUtils.toDecimal(totalFixedShares) : 1;

    for (const share of shares) {
      const shareDecimal = fractionUtils.toDecimal(share.share);
      const adjustedShare = awl ? shareDecimal / effectiveTotal : shareDecimal;
      
      if (share.isPerPerson) {
        share.amount = netEstate * adjustedShare * share.heir.count;
        share.percentage = adjustedShare * 100;
      } else {
        share.amount = netEstate * adjustedShare;
        share.percentage = adjustedShare * 100;
      }
      totalDistributed += share.amount;
    }

    return {
      estate: this.estate,
      netEstate,
      heirs: shares,
      blockedHeirs,
      totalDistributed,
      remainder: netEstate - totalDistributed,
      aslAlMasala,
      awl,
      radd,
      notes: this.notes,
      notesArabic: this.notesArabic,
    };
  }

  private getAsabaHeirs(): Heir[] {
    const asaba: Heir[] = [];
    const hasHeir = (type: HeirType) => this.heirs.some(h => h.type === type && h.count > 0);

    const sons = this.heirs.find(h => h.type === 'son' && h.count > 0);
    if (sons && !this.isBlocked('son')) {
      asaba.push(sons);
      const daughters = this.heirs.find(h => h.type === 'daughter' && h.count > 0);
      if (daughters) asaba.push(daughters);
      return asaba;
    }

    const grandsons = this.heirs.find(h => h.type === 'son_of_son' && h.count > 0);
    if (grandsons && !this.isBlocked('son_of_son')) {
      asaba.push(grandsons);
      const granddaughters = this.heirs.find(h => h.type === 'daughter_of_son' && h.count > 0);
      if (granddaughters) asaba.push(granddaughters);
      return asaba;
    }

    const father = this.heirs.find(h => h.type === 'father' && h.count > 0);
    if (father && !this.isBlocked('father') && !hasHeir('son') && !hasHeir('son_of_son')) {
      if (!hasHeir('daughter') && !hasHeir('daughter_of_son')) {
        asaba.push(father);
        return asaba;
      }
    }

    const grandfather = this.heirs.find(h => h.type === 'grandfather' && h.count > 0);
    if (grandfather && !this.isBlocked('grandfather') && !hasHeir('son') && !hasHeir('son_of_son')) {
      asaba.push(grandfather);
      return asaba;
    }

    const fullBrothers = this.heirs.find(h => h.type === 'full_brother' && h.count > 0);
    if (fullBrothers && !this.isBlocked('full_brother')) {
      asaba.push(fullBrothers);
      const fullSisters = this.heirs.find(h => h.type === 'full_sister' && h.count > 0);
      if (fullSisters) asaba.push(fullSisters);
      return asaba;
    }

    const paternalBrothers = this.heirs.find(h => h.type === 'paternal_brother' && h.count > 0);
    if (paternalBrothers && !this.isBlocked('paternal_brother')) {
      asaba.push(paternalBrothers);
      const paternalSisters = this.heirs.find(h => h.type === 'paternal_sister' && h.count > 0);
      if (paternalSisters) asaba.push(paternalSisters);
      return asaba;
    }

    return asaba;
  }

  private distributeResidue(shares: HeirShare[], asabaHeirs: Heir[], residue: Fraction): void {
    if (asabaHeirs.length === 0) return;

    let totalUnits = 0;
    const hasMixedGender = asabaHeirs.some(h => h.gender === 'male') && 
                          asabaHeirs.some(h => h.gender === 'female');

    if (hasMixedGender) {
      for (const heir of asabaHeirs) {
        totalUnits += heir.gender === 'male' ? heir.count * 2 : heir.count;
      }
    } else {
      for (const heir of asabaHeirs) {
        totalUnits += heir.count;
      }
    }

    for (const heir of asabaHeirs) {
      const units = hasMixedGender && heir.gender === 'male' ? heir.count * 2 : heir.count;
      const heirShare = fractionUtils.create(
        residue.numerator * units,
        residue.denominator * totalUnits
      );

      const perPersonShare = fractionUtils.divideByNumber(heirShare, heir.count);

      shares.push({
        heir,
        share: perPersonShare,
        shareDescription: `${fractionUtils.toString(perPersonShare)} (residue)`,
        shareDescriptionArabic: `${fractionUtils.toString(perPersonShare)} (تعصيب)`,
        amount: 0, percentage: 0,
        rule: `Residuary heir (asaba)`,
        ruleArabic: `عصبة`,
        ruleMalayalam: `Residuary`,
        isPerPerson: true,
      });
    }
  }

  private applyRadd(shares: HeirShare[], excess: Fraction): void {
    const eligibleShares = shares.filter(s => 
      s.heir.type !== 'husband' && s.heir.type !== 'wife'
    );

    if (eligibleShares.length === 0) return;

    let eligibleTotal = fractionUtils.zero();
    for (const share of eligibleShares) {
      eligibleTotal = fractionUtils.add(eligibleTotal, share.share);
    }

    for (const share of eligibleShares) {
      const proportion = fractionUtils.create(
        share.share.numerator * eligibleTotal.denominator,
        share.share.denominator * eligibleTotal.numerator
      );
      const additionalShare = fractionUtils.multiply(excess, proportion);
      const originalShare = fractionUtils.toString(share.share);
      share.share = fractionUtils.add(share.share, additionalShare);
      share.shareDescription = `${originalShare} + radd = ${fractionUtils.toString(share.share)}`;
      share.shareDescriptionArabic = `${originalShare} + رد = ${fractionUtils.toString(share.share)}`;
    }
  }
}

export function calculateInheritance(
  deceased: DeceasedInfo,
  heirs: Heir[],
  estate: Estate
): InheritanceResult {
  const calculator = new FaraidCalculator(deceased, heirs, estate);
  return calculator.calculate();
}
