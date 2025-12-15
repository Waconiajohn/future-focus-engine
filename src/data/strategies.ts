import { Strategy, MatchedStrategy, UserProfile, TransitionYearFlags, computeTransitionFlags, RetirementRange, RealEstateRange, SuppressionConditions } from '@/types/persona';

// ========================================
// TIER ORDER DEFINITIONS
// ========================================
const RETIREMENT_TIER_ORDER: RetirementRange[] = ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'];
const REAL_ESTATE_TIER_ORDER: RealEstateRange[] = ['none', '<250k', '250k-750k', '750k-2m', '>2m'];

// ========================================
// HELPER FUNCTIONS
// ========================================
function hasPreTaxRetirement(profile: UserProfile): boolean {
  return profile.hasTraditionalIRA || profile.has401k || profile.retirementRange !== '<250k';
}

function hasCharitableIntent(profile: UserProfile): boolean {
  return profile.charitableGiving !== undefined && profile.charitableGiving !== 'none';
}

function isHighNetWorth(profile: UserProfile): boolean {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  return retirementIndex >= 4 || realEstateIndex >= 3; // $2.5M+ retirement or $750k+ real estate
}

function getRetirementTierIndex(tier: RetirementRange): number {
  return RETIREMENT_TIER_ORDER.indexOf(tier);
}

function getRealEstateTierIndex(tier: RealEstateRange): number {
  return REAL_ESTATE_TIER_ORDER.indexOf(tier);
}

function isRetirementBelowTier(profile: UserProfile, threshold: RetirementRange): boolean {
  return getRetirementTierIndex(profile.retirementRange) < getRetirementTierIndex(threshold);
}

function isRealEstateBelowTier(profile: UserProfile, threshold: RealEstateRange): boolean {
  return getRealEstateTierIndex(profile.realEstateRange) < getRealEstateTierIndex(threshold);
}

function getRetirementPriorityBoost(profile: UserProfile, priorityTiers?: RetirementRange[]): number {
  if (!priorityTiers) return 0;
  if (priorityTiers.includes(profile.retirementRange)) {
    return getRetirementTierIndex(profile.retirementRange) * 5;
  }
  return 0;
}

function getRealEstatePriorityBoost(profile: UserProfile, priorityTiers?: RealEstateRange[]): number {
  if (!priorityTiers) return 0;
  if (priorityTiers.includes(profile.realEstateRange)) {
    return getRealEstateTierIndex(profile.realEstateRange) * 5;
  }
  return 0;
}

function shouldSuppressStrategy(profile: UserProfile, conditions?: SuppressionConditions, complexity?: 'high' | 'medium' | 'low'): boolean {
  if (!conditions && !complexity) return false;
  
  if (complexity === 'high' && profile.retirementRange === '<250k') return true;
  
  if (conditions) {
    if (conditions.suppressBelowRetirementTier && isRetirementBelowTier(profile, conditions.suppressBelowRetirementTier)) return true;
    if (conditions.suppressBelowRealEstateTier && isRealEstateBelowTier(profile, conditions.suppressBelowRealEstateTier)) return true;
    if (conditions.suppressIfNoRealEstate && profile.realEstateRange === 'none') return true;
  }
  
  return false;
}

// ========================================
// GRANULAR IMPACT COMPUTATION
// ========================================
function computeImpact(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'high' | 'medium' | 'low' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  const charitableLevel = profile.charitableGiving || 'none';
  
  switch (strategy.id) {
    case 'roth-conversion':
    case 'lower-income-planning':
      if (retirementIndex >= 3 && flags.incomeVolatility) return 'high';
      if (retirementIndex >= 1 && retirementIndex <= 2) return 'medium';
      return 'low';
    
    case 'qcd':
    case 'rmd-minimization':
      if ((charitableLevel === '25k-100k' || charitableLevel === '>100k') && retirementIndex >= 3) return 'high';
      if (charitableLevel === '5k-25k' || retirementIndex >= 3) return 'medium';
      return 'low';
    
    case '1031-exchange':
    case 'depreciation-recapture':
      if (realEstateIndex >= 3) return 'high';
      if (realEstateIndex === 2) return 'medium';
      return 'low';
    
    case 'nua':
      if (retirementIndex >= 2) return 'high';
      return 'medium';
    
    case 'crt':
    case 'dynasty-trust':
    case 'flp':
      if (retirementIndex >= 4 || realEstateIndex >= 3) return 'high';
      if (retirementIndex >= 3) return 'medium';
      return 'low';
    
    case 'daf':
    case 'charitable-bunching':
      if (charitableLevel === '25k-100k' || charitableLevel === '>100k') return 'high';
      if (charitableLevel === '5k-25k') return 'medium';
      return 'low';
    
    case 'qsbs':
    case 'opportunity-zone':
    case 'installment-sale':
      if (retirementIndex >= 3) return 'high';
      return 'medium';
    
    default:
      // Normalize ImpactLabel to 'high' | 'medium' | 'low'
      const impactMap: Record<string, 'high' | 'medium' | 'low'> = {
        'high': 'high', 'Advanced': 'high',
        'medium': 'medium', 'Material': 'medium',
        'low': 'low', 'Potential': 'low'
      };
      const baseImpact = impactMap[strategy.impact] || 'medium';
      if (retirementIndex === 0) {
        if (baseImpact === 'high') return 'medium';
        if (baseImpact === 'medium') return 'low';
      }
      return baseImpact;
  }
}

function computeUrgencyLevel(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'worth-deeper-review' | 'worth-considering' | 'worth-noting' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  
  if (retirementIndex >= 3 && (strategy.category === 'withdrawal' || strategy.id === 'roth-conversion')) {
    return 'worth-deeper-review';
  }
  
  if (flags.isTransitionYear && strategy.transitionYearPriority && strategy.transitionYearPriority > 70) {
    return 'worth-deeper-review';
  }
  
  if (retirementIndex >= 1 && retirementIndex <= 2) return 'worth-considering';
  if (retirementIndex === 0) return 'worth-noting';
  
  return 'worth-considering';
}

function applyHighImpactGuardrail(strategies: MatchedStrategy[]): MatchedStrategy[] {
  let highCount = 0;
  return strategies.map(strategy => {
    if (strategy.computedImpact === 'high') {
      highCount++;
      if (highCount > 3) {
        return { ...strategy, computedImpact: 'medium' as const };
      }
    }
    return strategy;
  });
}

// ========================================
// ALL 26 STRATEGIES WITH DETERMINISTIC TRIGGERS
// ========================================
export const strategies: Strategy[] = [
  // 1. ROTH IRA CONVERSION
  {
    id: 'roth-conversion',
    title: 'Roth IRA Conversion',
    whatThisIs: 'The transfer of pre-tax retirement account funds to a Roth IRA, triggering current-year taxable income in exchange for future tax-free growth.',
    whyItAppears: 'Has traditional IRA or 401(k) AND age < 73 AND (unemployed OR income volatility OR expects higher future tax rates).',
    whyOftenExplored: 'Often explored when current-year income is lower than expected future income, potentially allowing conversion at reduced tax rates.',
    evaluator: 'CPA/CFP',
    description: 'Converting pre-tax retirement funds to Roth during lower-income periods may result in paying taxes at reduced rates.',
    whyForYou: 'Your profile indicates pre-tax retirement accounts with favorable conversion conditions.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 90,
    triggerReason: 'Has pre-tax retirement AND age < 73 AND income conditions favorable',
    primaryTriggers: {
      maxAge: 72,
      requiresPreTaxRetirement: true
    },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], priorityAgeRange: { min: 55, max: 72 } }
  },

  // 2. BACKDOOR ROTH IRA
  {
    id: 'backdoor-roth',
    title: 'Backdoor Roth IRA',
    whatThisIs: 'A two-step process where a non-deductible traditional IRA contribution is converted to Roth, allowing high earners to fund Roth accounts indirectly.',
    whyItAppears: 'Income above Roth limits AND no large pre-tax IRA balance AND age < 70.',
    whyOftenExplored: 'Often explored when income exceeds direct Roth contribution thresholds but the pro-rata rule would not create significant tax complications.',
    evaluator: 'CPA',
    description: 'High earners above Roth IRA income limits can still fund Roth accounts through a two-step contribution and conversion process.',
    whyForYou: 'Your income may exceed Roth limits and you indicated no large existing pre-tax IRA balance.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Income above Roth limits AND no large pre-tax IRA AND age < 70',
    primaryTriggers: { maxAge: 69, requiresIncomeAboveRothLimits: true, requiresNoLargePreTaxIRA: true }
  },

  // 3. MEGA BACKDOOR ROTH
  {
    id: 'mega-backdoor-roth',
    title: 'Mega Backdoor Roth',
    whatThisIs: 'An employer plan feature allowing after-tax 401(k) contributions beyond standard limits, which can then be converted to Roth.',
    whyItAppears: 'Employed AND employer 401(k) allows after-tax contributions AND maxing standard contributions.',
    whyOftenExplored: 'Often explored when seeking to maximize Roth contributions beyond standard limits and employer plan permits.',
    evaluator: 'CPA/CFP',
    description: 'Some employer 401(k) plans allow after-tax contributions beyond the standard limit, which can then be converted to Roth.',
    whyForYou: 'Your employer plan may allow after-tax contributions with conversion options.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employed AND employer allows after-tax 401(k) AND maxing contributions',
    primaryTriggers: { employmentStatus: ['employed'], requiresEmployer401kAfterTax: true, requiresMax401kContributions: true },
    priorityModifiers: { basePriorityBoost: 15 }
  },

  // 4. RMD MINIMIZATION
  {
    id: 'rmd-minimization',
    title: 'RMD Minimization Strategies',
    whatThisIs: 'Proactive management to reduce Required Minimum Distributions from pre-tax retirement accounts, which begin at age 73.',
    whyItAppears: 'Age 72+ AND has traditional IRA or 401(k).',
    whyOftenExplored: 'Often explored when pre-tax balances are large enough that forced distributions may push into higher tax brackets.',
    evaluator: 'CPA/CFP',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead can reduce the size of these forced withdrawals.',
    whyForYou: 'You are approaching or past RMD age with pre-tax retirement accounts.',
    impact: 'high',
    category: 'withdrawal',
    transitionYearPriority: 85,
    triggerReason: 'Age 72+ AND has traditional IRA',
    primaryTriggers: { minAge: 72, requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // 5. QUALIFIED CHARITABLE DISTRIBUTIONS (QCD)
  {
    id: 'qcd',
    title: 'Qualified Charitable Distribution (QCD)',
    whatThisIs: 'Direct transfer from an IRA to a qualified charity, which counts toward RMDs but is excluded from taxable income.',
    whyItAppears: 'Age 70.5+ AND has traditional IRA AND charitable giving intent.',
    whyOftenExplored: 'Often explored when satisfying charitable giving goals while reducing taxable RMD income.',
    evaluator: 'CPA',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but are excluded from taxable income.',
    whyForYou: 'Your age, IRA ownership, and charitable intent align with QCD eligibility.',
    impact: 'high',
    category: 'giving',
    triggerReason: 'Age 70.5+ AND traditional IRA AND charitable intent',
    primaryTriggers: { minAge: 70, requiresTraditionalIRA: true, requiresCharitableIntent: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 20 }
  },

  // 6. QLAC
  {
    id: 'qlac',
    title: 'Qualified Longevity Annuity Contract (QLAC)',
    whatThisIs: 'A deferred income annuity purchased within a retirement account that can defer a portion of RMDs until age 85.',
    whyItAppears: 'Age 60+ AND has traditional IRA or 401(k) AND longevity concern indicated.',
    whyOftenExplored: 'Often explored when seeking to reduce required distributions in earlier years while providing longevity income protection.',
    evaluator: 'CFP',
    description: 'QLACs allow you to defer a portion of RMDs until age 85, reducing required withdrawals in earlier years.',
    whyForYou: 'Your age, retirement accounts, and longevity planning interest align with QLAC considerations.',
    impact: 'low',
    category: 'withdrawal',
    complexity: 'high',
    triggerReason: 'Age 60+ AND pre-tax retirement AND longevity concern',
    primaryTriggers: { minAge: 60, requiresPreTaxRetirement: true, requiresLongevityConcern: true },
    suppressionConditions: { suppressBelowRetirementTier: '500k-1m' },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // 7. NET UNREALIZED APPRECIATION (NUA)
  {
    id: 'nua',
    title: 'Net Unrealized Appreciation (NUA)',
    whatThisIs: 'A tax treatment allowing employer stock in qualified plans to be distributed in-kind, with appreciation taxed at capital gains rates rather than ordinary income.',
    whyItAppears: 'Owns employer stock in 401(k) AND separated from service.',
    whyOftenExplored: 'Often explored when employer stock has significant appreciation and separation from service has occurred.',
    evaluator: 'CPA/CFP',
    description: 'If you hold employer stock in a qualified retirement plan, NUA rules may allow capital gains treatment on the appreciation.',
    whyForYou: 'You indicated employer stock holdings and separation from service.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employer stock in 401(k) AND separated from service',
    primaryTriggers: { requiresEmployerStock: true, requiresSeparatedFromService: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 15 }
  },

  // 8. ASSET LOCATION
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    whatThisIs: 'The practice of placing investments in accounts based on their tax characteristics to optimize after-tax returns.',
    whyItAppears: 'Has multiple account types.',
    whyOftenExplored: 'Often explored when holding investments across taxable, tax-deferred, and tax-free accounts.',
    evaluator: 'CFP',
    description: 'Where you hold different investments matters. Strategic placement across account types can improve after-tax returns.',
    whyForYou: 'You indicated multiple account types.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Has multiple account types',
    primaryTriggers: { requiresMultipleAccountTypes: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // 9. TAX-LOSS HARVESTING
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    whatThisIs: 'Selling investments at a loss to offset capital gains and up to $3,000 of ordinary income annually, while maintaining market exposure.',
    whyItAppears: 'Has taxable brokerage account AND market volatility indicated.',
    whyOftenExplored: 'Often explored during periods of market decline to capture losses for tax benefit while staying invested.',
    evaluator: 'CPA/CFP',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes while maintaining investment strategy.',
    whyForYou: 'You indicated taxable brokerage holdings with market volatility.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Taxable brokerage AND market volatility',
    primaryTriggers: { requiresTaxableBrokerage: true, requiresMarketVolatility: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // 10. COST BASIS PLANNING
  {
    id: 'cost-basis-planning',
    title: 'Cost Basis Planning',
    whatThisIs: 'Strategic management of investment cost basis through specific lot identification, gain/loss harvesting, and holding period optimization.',
    whyItAppears: 'Has taxable brokerage AND embedded capital gains.',
    whyOftenExplored: 'Often explored when holding appreciated positions and seeking to manage tax impact of future sales.',
    evaluator: 'CPA/CFP',
    description: 'Managing cost basis through specific lot identification and holding periods can optimize tax outcomes on investment sales.',
    whyForYou: 'You indicated taxable investments with embedded capital gains.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Taxable brokerage AND embedded capital gains',
    primaryTriggers: { requiresTaxableBrokerage: true, requiresEmbeddedCapitalGains: true }
  },

  // 11. MUNICIPAL BONDS
  {
    id: 'municipal-bonds',
    title: 'Municipal Bond Considerations',
    whatThisIs: 'Debt securities issued by state and local governments that typically pay interest exempt from federal income tax.',
    whyItAppears: 'High tax bracket AND taxable fixed income holdings.',
    whyOftenExplored: 'Often explored when tax-equivalent yield on municipals exceeds taxable bond yields for the investor.',
    evaluator: 'CFP',
    description: 'Municipal bonds may provide tax-exempt income that exceeds after-tax returns on taxable bonds for high-bracket investors.',
    whyForYou: 'Your tax bracket and fixed income holdings suggest municipal bonds may warrant review.',
    impact: 'medium',
    category: 'investment',
    triggerReason: 'High tax bracket AND taxable fixed income',
    primaryTriggers: { requiresHighTaxBracket: true, requiresTaxableFixedIncome: true }
  },

  // 12. HEALTH SAVINGS ACCOUNT (HSA)
  {
    id: 'hsa',
    title: 'Health Savings Account (HSA) Optimization',
    whatThisIs: 'A tax-advantaged account offering triple tax benefits: deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.',
    whyItAppears: 'Enrolled in HDHP AND age < 65.',
    whyOftenExplored: 'Often explored for its unique triple tax advantage not available through other account types.',
    evaluator: 'CPA/CFP',
    description: 'HSAs offer triple tax advantages when paired with a high-deductible health plan.',
    whyForYou: 'You indicated HDHP enrollment and are under Medicare age.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Enrolled in HDHP AND age < 65',
    primaryTriggers: { maxAge: 64, requiresHDHP: true }
  },

  // 13. 529 PLANNING
  {
    id: '529-planning',
    title: '529 Education Savings Planning',
    whatThisIs: 'Tax-advantaged savings accounts for education expenses, offering tax-free growth and withdrawals for qualified education costs.',
    whyItAppears: 'Education funding intent indicated.',
    whyOftenExplored: 'Often explored for funding education expenses with tax-free growth potential.',
    evaluator: 'CFP',
    description: '529 plans offer tax-free growth and withdrawals for qualified education expenses.',
    whyForYou: 'You indicated interest in education funding.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Education funding intent',
    primaryTriggers: { requiresEducationFundingIntent: true }
  },

  // 14. DONOR-ADVISED FUND (DAF)
  {
    id: 'daf',
    title: 'Donor-Advised Fund (DAF)',
    whatThisIs: 'A charitable giving vehicle that allows an immediate tax deduction while distributing funds to charities over time.',
    whyItAppears: 'Charitable giving intent AND taxable assets AND income spike.',
    whyOftenExplored: 'Often explored to accelerate charitable deductions into high-income years while spreading actual grants over time.',
    evaluator: 'CPA/CFP',
    description: 'DAFs allow immediate tax deduction with flexibility to recommend grants to charities over multiple years.',
    whyForYou: 'Your charitable intent and income situation align with DAF considerations.',
    impact: 'medium',
    category: 'giving',
    triggerReason: 'Charitable intent AND taxable assets AND income spike',
    primaryTriggers: { requiresCharitableIntent: true, requiresTaxableBrokerage: true, requiresIncomeSpike: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // 15. CHARITABLE REMAINDER TRUST (CRT)
  {
    id: 'crt',
    title: 'Charitable Remainder Trust (CRT)',
    whatThisIs: 'An irrevocable trust that provides income to the donor for a period, with the remainder passing to charity.',
    whyItAppears: 'Highly appreciated assets AND charitable intent AND income replacement need.',
    whyOftenExplored: 'Often explored when holding highly appreciated assets and seeking income, capital gains deferral, and charitable impact.',
    evaluator: 'CPA/Attorney',
    description: 'CRTs can provide income, defer capital gains on appreciated assets, and support charitable goals.',
    whyForYou: 'Your appreciated assets, charitable intent, and income needs align with CRT considerations.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'Highly appreciated assets AND charitable intent AND income need',
    primaryTriggers: { requiresHighlyAppreciatedAssets: true, requiresCharitableIntent: true, requiresIncomeReplacementNeed: true },
    suppressionConditions: { suppressBelowRetirementTier: '1m-2.5m' },
    priorityModifiers: { higherPriorityRetirementTiers: ['2.5m-5m', '>5m'], basePriorityBoost: 10 }
  },

  // 16. 1031 EXCHANGE
  {
    id: '1031-exchange',
    title: '1031 Like-Kind Exchange',
    whatThisIs: 'Deferral of capital gains tax on the sale of investment real estate by reinvesting proceeds into like-kind replacement property.',
    whyItAppears: 'Owns investment real estate AND intends to sell property.',
    whyOftenExplored: 'Often explored when repositioning real estate holdings without triggering immediate capital gains recognition.',
    evaluator: 'CPA/Attorney',
    description: 'If you sell investment real estate, a 1031 exchange allows you to defer capital gains by reinvesting in like-kind property.',
    whyForYou: 'You indicated investment real estate with intent to sell.',
    impact: 'high',
    category: 'real-estate',
    triggerReason: 'Owns investment real estate AND intends to sell',
    primaryTriggers: { requiresRentalRealEstate: true, requiresIntendsToSellProperty: true },
    suppressionConditions: { suppressBelowRealEstateTier: '250k-750k' },
    priorityModifiers: { higherPriorityRealEstateTiers: ['750k-2m', '>2m'], basePriorityBoost: 15 }
  },

  // 17. RENTAL LOSS / REPS
  {
    id: 'rental-loss-reps',
    title: 'Rental Loss / Real Estate Professional Status',
    whatThisIs: 'Tax treatment of rental real estate losses, including special rules for those who qualify as real estate professionals.',
    whyItAppears: 'Owns rental real estate AND active participation.',
    whyOftenExplored: 'Often explored when rental activities generate losses that may offset other income under certain conditions.',
    evaluator: 'CPA',
    description: 'Rental property losses may offset other income depending on participation level and real estate professional status.',
    whyForYou: 'Your rental real estate ownership and active participation indicate potential for loss deductions.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'Owns rental real estate AND active participation',
    primaryTriggers: { requiresRentalRealEstate: true, requiresActiveParticipation: true }
  },

  // 18. CONSERVATION EASEMENT
  {
    id: 'conservation-easement',
    title: 'Conservation Easement',
    whatThisIs: 'A donation of development rights on land to a qualified organization, potentially generating a charitable deduction.',
    whyItAppears: 'Owns large land parcel AND high income year.',
    whyOftenExplored: 'Often explored when holding significant land and seeking large charitable deductions. Note: IRS scrutiny is significant.',
    evaluator: 'CPA/Attorney',
    description: 'Donating development rights on land may generate charitable deductions. Subject to significant IRS scrutiny.',
    whyForYou: 'Your land holdings and income situation may align with conservation easement considerations.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'Large land parcel AND high income year',
    primaryTriggers: { requiresLargeLandParcel: true, requiresHighIncomeYear: true },
    suppressionConditions: { suppressBelowRetirementTier: '1m-2.5m' }
  },

  // 19. OPPORTUNITY ZONE
  {
    id: 'opportunity-zone',
    title: 'Opportunity Zone Investment',
    whatThisIs: 'Investment of capital gains into designated economically distressed areas for potential tax deferral and exclusion benefits.',
    whyItAppears: 'Realized capital gains AND risk tolerance moderate or higher.',
    whyOftenExplored: 'Often explored when seeking to defer capital gains while investing in designated development areas.',
    evaluator: 'CPA/CFP',
    description: 'Investing capital gains in Opportunity Zones may provide tax deferral and potential exclusion on appreciation.',
    whyForYou: 'Your realized capital gains and risk tolerance align with Opportunity Zone considerations.',
    impact: 'medium',
    category: 'investment',
    triggerReason: 'Realized capital gains AND moderate+ risk tolerance',
    primaryTriggers: { requiresRealizedCapitalGains: true, requiresModerateRiskTolerance: true }
  },

  // 20. INSTALLMENT SALE
  {
    id: 'installment-sale',
    title: 'Installment Sale',
    whatThisIs: 'Selling property in exchange for payments over time, allowing gain recognition to be spread across multiple tax years.',
    whyItAppears: 'Selling business or real estate AND income smoothing preference.',
    whyOftenExplored: 'Often explored when seeking to spread gain recognition across years to manage tax bracket exposure.',
    evaluator: 'CPA/Attorney',
    description: 'Installment sales allow gain recognition to be spread over the payment period.',
    whyForYou: 'Your sale plans and income smoothing preference align with installment sale considerations.',
    impact: 'medium',
    category: 'business',
    triggerReason: 'Selling business/real estate AND income smoothing preference',
    primaryTriggers: { requiresSellingBusinessOrRealEstate: true, requiresIncomeSmoothingPreference: true }
  },

  // 21. QSBS (SECTION 1202)
  {
    id: 'qsbs',
    title: 'Qualified Small Business Stock (QSBS)',
    whatThisIs: 'Potential exclusion of up to 100% of gain on the sale of qualified small business stock held for more than 5 years.',
    whyItAppears: 'Owns C-corp stock AND holding period 5+ years.',
    whyOftenExplored: 'Often explored when holding stock in qualifying C-corporations for potential gain exclusion.',
    evaluator: 'CPA/Attorney',
    description: 'QSBS may allow exclusion of substantial capital gains on qualifying small business stock sales.',
    whyForYou: 'Your C-corp stock ownership and holding period may qualify for QSBS treatment.',
    impact: 'high',
    category: 'business',
    triggerReason: 'C-corp stock AND 5+ year holding period',
    primaryTriggers: { requiresCCorpStock: true, requiresQSBSHoldingPeriod: true },
    priorityModifiers: { basePriorityBoost: 20 }
  },

  // 22. NONQUALIFIED DEFERRED COMPENSATION
  {
    id: 'nqdc',
    title: 'Nonqualified Deferred Compensation',
    whatThisIs: 'Employer-sponsored plans allowing executives to defer income beyond qualified plan limits.',
    whyItAppears: 'Employed AND has executive compensation.',
    whyOftenExplored: 'Often explored for income deferral when expecting lower tax rates in retirement years.',
    evaluator: 'CPA/CFP',
    description: 'NQDC plans allow deferral of compensation to future years when tax rates may be lower.',
    whyForYou: 'Your employment status and compensation indicate NQDC eligibility.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Employed AND executive compensation',
    primaryTriggers: { employmentStatus: ['employed'], requiresExecutiveCompensation: true }
  },

  // 23. FAMILY LIMITED PARTNERSHIP
  {
    id: 'flp',
    title: 'Family Limited Partnership (FLP)',
    whatThisIs: 'An entity structure that may facilitate wealth transfer to family members while potentially reducing gift and estate tax exposure.',
    whyItAppears: 'Family wealth transfer intent AND estate planning concern.',
    whyOftenExplored: 'Often explored for transferring family business or investment assets while maintaining control.',
    evaluator: 'Attorney',
    description: 'FLPs may facilitate intergenerational wealth transfer with potential valuation discounts.',
    whyForYou: 'Your wealth transfer goals and estate planning concerns align with FLP considerations.',
    impact: 'medium',
    category: 'general',
    complexity: 'high',
    triggerReason: 'Family wealth transfer intent AND estate planning concern',
    primaryTriggers: { requiresFamilyWealthTransfer: true, requiresEstatePlanningConcern: true },
    suppressionConditions: { suppressBelowRetirementTier: '1m-2.5m' }
  },

  // 24. PRIMARY RESIDENCE EXCLUSION
  {
    id: 'primary-residence-exclusion',
    title: 'Primary Residence Exclusion',
    whatThisIs: 'Exclusion of up to $250,000 ($500,000 for married filing jointly) of gain on the sale of a primary residence.',
    whyItAppears: 'Selling primary residence.',
    whyOftenExplored: 'Often explored when selling a home to understand exclusion eligibility and maximization.',
    evaluator: 'CPA',
    description: 'The Section 121 exclusion may allow significant gain exclusion when selling your primary residence.',
    whyForYou: 'You indicated plans to sell your primary residence.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'Selling primary residence',
    primaryTriggers: { requiresSellingPrimaryResidence: true }
  },

  // 25. DEPRECIATION / RECAPTURE PLANNING
  {
    id: 'depreciation-recapture',
    title: 'Depreciation Recapture Planning',
    whatThisIs: 'Tax treatment upon sale of depreciated property where accumulated depreciation is recaptured and taxed at up to 25%.',
    whyItAppears: 'Owns depreciated real estate AND intends to sell.',
    whyOftenExplored: 'Often explored when planning real estate sales to understand and potentially mitigate recapture exposure.',
    evaluator: 'CPA',
    description: 'When selling depreciated property, understanding recapture implications helps inform sale timing and exit strategy.',
    whyForYou: 'Your depreciated real estate and sale plans indicate recapture planning considerations.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'Depreciated real estate AND intends to sell',
    primaryTriggers: { requiresDepreciatedRealEstate: true, requiresIntendsToSellProperty: true }
  },

  // 26. DYNASTY TRUST
  {
    id: 'dynasty-trust',
    title: 'Dynasty Trust',
    whatThisIs: 'A long-term trust designed to pass wealth across multiple generations while minimizing transfer taxes at each generational level.',
    whyItAppears: 'Multi-generational planning intent AND high net worth.',
    whyOftenExplored: 'Often explored for significant wealth preservation across multiple generations.',
    evaluator: 'Attorney',
    description: 'Dynasty trusts may preserve family wealth across generations while minimizing estate taxes at each transfer.',
    whyForYou: 'Your multi-generational planning goals and asset level align with dynasty trust considerations.',
    impact: 'low',
    category: 'general',
    complexity: 'high',
    triggerReason: 'Multi-generational planning AND high net worth',
    primaryTriggers: { requiresMultiGenerationalPlanning: true, requiresHighNetWorth: true },
    suppressionConditions: { suppressBelowRetirementTier: '2.5m-5m' }
  }
];

// ========================================
// MATCH STRATEGIES FUNCTION
// ========================================
export function matchStrategies(profile: UserProfile): MatchedStrategy[] {
  const flags = computeTransitionFlags(profile);
  const age = profile.age;
  
  let matchedStrategies = strategies.filter(strategy => {
    const triggers = strategy.primaryTriggers;
    
    if (strategy.suppressDuringUnemployment && flags.anyoneUnemployed) return false;
    if (shouldSuppressStrategy(profile, strategy.suppressionConditions, strategy.complexity)) return false;
    
    // Age checks
    if (triggers.minAge && age < triggers.minAge) return false;
    if (triggers.maxAge && age > triggers.maxAge) return false;
    
    // Status checks
    if (triggers.maritalStatus && !triggers.maritalStatus.includes(profile.maritalStatus)) return false;
    if (triggers.employmentStatus && !triggers.employmentStatus.includes(profile.employmentStatus)) return false;
    
    // Account type requirements
    if (triggers.requiresPreTaxRetirement && !hasPreTaxRetirement(profile)) return false;
    if (triggers.requiresTraditionalIRA && !profile.hasTraditionalIRA) return false;
    if (triggers.requires401k && !profile.has401k) return false;
    if (triggers.requiresTaxableBrokerage && !profile.hasTaxableBrokerage) return false;
    if (triggers.requiresMultipleAccountTypes && !profile.hasMultipleAccountTypes) return false;
    
    // Behavioral/situational triggers
    if (triggers.requiresCharitableIntent && !hasCharitableIntent(profile)) return false;
    if (triggers.requiresEmployerStock && !profile.hasEmployerStock) return false;
    if (triggers.requiresRentalRealEstate && !profile.hasRentalRealEstate) return false;
    if (triggers.requiresBusinessOwnership && !profile.hasBusinessOwnership) return false;
    if (triggers.requiresTransitionYear && !flags.isTransitionYear) return false;
    if (triggers.requiresLowerIncome && !flags.incomeLowerThanTypical) return false;
    if (triggers.requiresIncomeVolatility && !flags.incomeVolatility) return false;
    
    // Roth-related
    if (triggers.requiresIncomeAboveRothLimits && !profile.incomeAboveRothLimits) return false;
    if (triggers.requiresNoLargePreTaxIRA && profile.hasLargePreTaxIRA) return false;
    if (triggers.requiresEmployer401kAfterTax && !profile.employer401kAllowsAfterTax) return false;
    if (triggers.requiresMax401kContributions && !profile.max401kContributions) return false;
    
    // Employment/separation
    if (triggers.requiresSeparatedFromService && !profile.separatedFromService) return false;
    if (triggers.requiresExecutiveCompensation && !profile.hasExecutiveCompensation) return false;
    
    // Education & family
    if (triggers.requires529Account && !profile.has529Account) return false;
    if (triggers.requiresEducationFundingIntent && !profile.educationFundingIntent) return false;
    if (triggers.requiresFamilyWealthTransfer && !profile.familyWealthTransferIntent) return false;
    if (triggers.requiresMultiGenerationalPlanning && !profile.multiGenerationalPlanningIntent) return false;
    
    // Real estate specific
    if (triggers.requiresIntendsToSellProperty && !profile.intendsToSellProperty) return false;
    if (triggers.requiresSellingPrimaryResidence && !profile.sellingPrimaryResidence) return false;
    if (triggers.requiresDepreciatedRealEstate && !profile.ownsDepreciatedRealEstate) return false;
    if (triggers.requiresLargeLandParcel && !profile.ownsLargeLandParcel) return false;
    if (triggers.requiresActiveParticipation && !profile.activeParticipationInRental) return false;
    
    // Investment/business
    if (triggers.requiresHighlyAppreciatedAssets && !profile.hasHighlyAppreciatedAssets) return false;
    if (triggers.requiresEmbeddedCapitalGains && !profile.hasEmbeddedCapitalGains) return false;
    if (triggers.requiresRealizedCapitalGains && !profile.hasRealizedCapitalGains) return false;
    if (triggers.requiresCCorpStock && !profile.ownsCCorpStock) return false;
    if (triggers.requiresQSBSHoldingPeriod && !profile.qsbsHoldingPeriod5Years) return false;
    if (triggers.requiresSellingBusinessOrRealEstate && !profile.sellingBusinessOrRealEstate) return false;
    
    // Income/tax context
    if (triggers.requiresHighTaxBracket && !profile.highTaxBracket) return false;
    if (triggers.requiresIncomeSpike && !profile.incomeSpike) return false;
    if (triggers.requiresHighIncomeYear && !profile.highIncomeYear) return false;
    if (triggers.requiresIncomeSmoothingPreference && !profile.incomeSmoothingPreference) return false;
    if (triggers.requiresExpectedHigherFutureTaxes && !profile.expectedFutureTaxRatesHigher) return false;
    
    // Healthcare
    if (triggers.requiresHDHP && !profile.enrolledInHDHP) return false;
    
    // Planning preferences
    if (triggers.requiresLongevityConcern && !profile.longevityConcern) return false;
    if (triggers.requiresIncomeReplacementNeed && !profile.incomeReplacementNeed) return false;
    if (triggers.requiresEstatePlanningConcern && !profile.estatePlanningConcern) return false;
    if (triggers.requiresModerateRiskTolerance && (!profile.riskTolerance || profile.riskTolerance === 'low')) return false;
    if (triggers.requiresMarketVolatility && !profile.hasMarketVolatility) return false;
    if (triggers.requiresTaxableFixedIncome && !profile.hasTaxableFixedIncome) return false;
    if (triggers.requiresHighNetWorth && !isHighNetWorth(profile)) return false;
    
    return true;
  });

  let scoredStrategies: MatchedStrategy[] = matchedStrategies.map(strategy => {
    let priorityScore = 0;
    const modifiers = strategy.priorityModifiers;
    
    if (flags.isTransitionYear && strategy.transitionYearPriority) {
      priorityScore += strategy.transitionYearPriority;
    }
    
    const computedImpactValue = computeImpact(profile, strategy, flags);
    const impactScore = { high: 30, medium: 20, low: 10 };
    priorityScore += impactScore[computedImpactValue];
    
    if (modifiers) {
      priorityScore += getRetirementPriorityBoost(profile, modifiers.higherPriorityRetirementTiers);
      priorityScore += getRealEstatePriorityBoost(profile, modifiers.higherPriorityRealEstateTiers);
      
      if (modifiers.priorityAgeRange && age >= modifiers.priorityAgeRange.min && age <= modifiers.priorityAgeRange.max) {
        priorityScore += 15;
      }
      
      if (modifiers.basePriorityBoost) priorityScore += modifiers.basePriorityBoost;
    }
    
    const urgencyLevel = computeUrgencyLevel(profile, strategy, flags);
    
    return { ...strategy, computedImpact: computedImpactValue, urgencyLevel, priorityScore };
  });

  scoredStrategies.sort((a, b) => b.priorityScore - a.priorityScore);
  scoredStrategies = applyHighImpactGuardrail(scoredStrategies);
  
  return scoredStrategies;
}

export function getTransitionYearCautions(profile: UserProfile): string[] {
  const flags = computeTransitionFlags(profile);
  const cautions: string[] = [];

  if (!flags.isTransitionYear) return cautions;

  if (flags.incomeLowerThanTypical && profile.age < 65) {
    cautions.push("Healthcare subsidies: If using marketplace insurance, additional income could affect premium subsidies.");
  }

  if (flags.incomeLowerThanTypical) {
    cautions.push("Bracket thresholds: Be mindful of key thresholds when timing income recognition.");
  }

  if (profile.age >= 62 && profile.age < 65) {
    cautions.push("Medicare ahead: Income decisions now may affect Medicare premiums. IRMAA uses a two-year lookback.");
  }

  if (flags.bothUnemployed) {
    cautions.push("Temporary window: With both partners in transition, this year may offer unusual planning flexibility.");
  }

  if (flags.shortTermTransition) {
    cautions.push("Time-limited opportunity: If income returns to normal within a year, some strategies work best when implemented promptly.");
  }

  return cautions;
}
