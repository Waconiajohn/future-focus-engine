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
  return profile.retirementRange !== '<250k';
}

function hasCharitableIntent(profile: UserProfile): boolean {
  return profile.charitableGiving !== undefined && profile.charitableGiving !== 'none';
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
    const tierIndex = getRetirementTierIndex(profile.retirementRange);
    return tierIndex * 5;
  }
  return 0;
}

function getRealEstatePriorityBoost(profile: UserProfile, priorityTiers?: RealEstateRange[]): number {
  if (!priorityTiers) return 0;
  if (priorityTiers.includes(profile.realEstateRange)) {
    const tierIndex = getRealEstateTierIndex(profile.realEstateRange);
    return tierIndex * 5;
  }
  return 0;
}

function shouldSuppressStrategy(profile: UserProfile, conditions?: SuppressionConditions, complexity?: 'high' | 'medium' | 'low'): boolean {
  if (!conditions && !complexity) return false;
  
  if (complexity === 'high' && profile.retirementRange === '<250k') {
    return true;
  }
  
  if (conditions) {
    if (conditions.suppressBelowRetirementTier && 
        isRetirementBelowTier(profile, conditions.suppressBelowRetirementTier)) {
      return true;
    }
    
    if (conditions.suppressBelowRealEstateTier && 
        isRealEstateBelowTier(profile, conditions.suppressBelowRealEstateTier)) {
      return true;
    }
    
    if (conditions.suppressIfNoRealEstate && profile.realEstateRange === 'none') {
      return true;
    }
  }
  
  return false;
}

function computeImpact(
  baseImpact: 'high' | 'medium' | 'low',
  profile: UserProfile,
  strategy: Strategy
): 'high' | 'medium' | 'low' {
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  
  if (profile.retirementRange === '<250k') {
    if (baseImpact === 'high') return 'medium';
    if (baseImpact === 'medium') return 'low';
  }
  
  if (strategy.primaryTriggers.requiresRentalRealEstate) {
    if (realEstateIndex <= 1) {
      if (baseImpact === 'high') return 'medium';
      if (baseImpact === 'medium') return 'low';
    } else if (realEstateIndex === 2) {
      if (baseImpact === 'high') return 'medium';
    }
  }
  
  return baseImpact;
}

function computeUrgencyLevel(
  profile: UserProfile,
  strategy: Strategy,
  flags: TransitionYearFlags
): 'worth-deeper-review' | 'worth-considering' | 'worth-noting' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  
  if (retirementIndex >= 3) {
    if (strategy.category === 'withdrawal' || 
        strategy.id === 'roth-conversion-window' ||
        strategy.id === 'rmd-planning') {
      return 'worth-deeper-review';
    }
  }
  
  if (flags.isTransitionYear && strategy.transitionYearPriority && strategy.transitionYearPriority > 70) {
    return 'worth-deeper-review';
  }
  
  if (retirementIndex >= 1 && retirementIndex <= 2) {
    return 'worth-considering';
  }
  
  if (retirementIndex === 0) {
    return 'worth-noting';
  }
  
  return 'worth-considering';
}

// ========================================
// STRATEGY DEFINITIONS WITH DETERMINISTIC TRIGGERS
// ========================================
export const strategies: Strategy[] = [
  // ========================================
  // TIMING-BASED STRATEGIES
  // ========================================
  {
    id: 'lower-income-planning',
    title: 'Lower-Income Year Planning Window',
    description: 'When income drops temporarily — whether from job transition, sabbatical, or early retirement — a unique planning window opens. Actions taken during these periods can have lasting benefits.',
    whyForYou: 'Your current income situation creates a window that may not be available in future years.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 100,
    triggerReason: 'You indicated lower income or employment transition this year',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresTransitionYear: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      basePriorityBoost: 20
    }
  },
  {
    id: 'roth-conversion-window',
    title: 'Roth Conversion Opportunity',
    description: 'Converting pre-tax retirement funds to Roth accounts during lower-income periods means paying taxes now at potentially reduced rates. Future growth becomes tax-free.',
    whyForYou: 'You have pre-tax retirement accounts, and your current income situation may offer favorable conversion rates.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 90,
    triggerReason: 'You have pre-tax retirement accounts AND age < 73 AND income variability indicated',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      minAge: 45,
      maxAge: 72,
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      priorityAgeRange: { min: 55, max: 72 }
    }
  },
  {
    id: 'backdoor-roth',
    title: 'Backdoor Roth IRA',
    description: 'High earners above Roth IRA income limits can still fund Roth accounts through a two-step process: contribute to a non-deductible traditional IRA, then convert to Roth.',
    whyForYou: 'Often worth exploring when income exceeds Roth contribution limits and you don\'t have large existing pre-tax IRA balances.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Income above Roth IRA limits AND no large pre-tax IRA balance AND age < 70',
    evaluator: 'CPA',
    primaryTriggers: {
      maxAge: 69,
      requiresIncomeAboveRothLimits: true,
      requiresNoLargePreTaxIRA: true
    }
  },
  {
    id: 'mega-backdoor-roth',
    title: 'Mega Backdoor Roth',
    description: 'Some employer 401(k) plans allow after-tax contributions beyond the standard limit, which can then be converted to Roth. This can significantly increase tax-free retirement savings.',
    whyForYou: 'Often worth exploring when your employer plan allows after-tax contributions with in-plan conversions.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Currently employed AND employer 401(k) allows after-tax contributions',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      employmentStatus: ['employed'],
      requiresEmployer401kAfterTax: true
    },
    priorityModifiers: {
      basePriorityBoost: 15
    }
  },
  {
    id: 'bracket-management',
    title: 'Tax Bracket Management',
    description: 'Understanding your marginal tax bracket helps optimize when to recognize income, make conversions, or take deductions. Variable income years offer more flexibility.',
    whyForYou: 'Managing bracket thresholds becomes more important as taxable events increase.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 70,
    triggerReason: 'You have pre-tax retirement accounts requiring income planning',
    evaluator: 'CPA',
    primaryTriggers: {
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'],
      basePriorityBoost: 10
    }
  },
  {
    id: 'capital-gains-harvesting',
    title: 'Capital Gains Harvesting',
    description: 'In years with lower ordinary income, you may be able to realize long-term capital gains at the 0% rate. This resets your cost basis without triggering taxes.',
    whyForYou: 'Your reduced income this year may qualify you for preferential capital gains treatment.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 75,
    triggerReason: 'Income lower than typical this year',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresLowerIncome: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },

  // ========================================
  // STRUCTURE-BASED STRATEGIES
  // ========================================
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    description: 'Where you hold different investments matters. Placing tax-inefficient assets in tax-advantaged accounts and tax-efficient assets in taxable accounts can improve after-tax returns.',
    whyForYou: 'With multiple account types, strategic placement can compound benefits over time.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'You have pre-tax retirement accounts with meaningful balances',
    evaluator: 'CFP',
    primaryTriggers: {
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'hsa-optimization',
    title: 'HSA Optimization',
    description: 'Health Savings Accounts offer triple tax advantages: deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.',
    whyForYou: 'If you have HSA access through a high-deductible health plan, maximizing contributions builds a tax-efficient reserve.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Age under 65 AND HDHP eligibility possible',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      maxAge: 65,
      employmentStatus: ['employed', 'unemployed']
    }
  },
  {
    id: 'spousal-ira',
    title: 'Spousal IRA Contributions',
    description: 'Even when one spouse isn\'t working, the working spouse can contribute to an IRA on their behalf. This keeps both partners building retirement assets.',
    whyForYou: 'Your household situation allows for continued retirement contributions for both spouses.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Married AND age allows IRA contributions',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      maritalStatus: ['married'],
      maxAge: 73
    }
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes. Losses can also offset up to $3,000 of ordinary income annually.',
    whyForYou: 'With taxable investments alongside retirement accounts, this ongoing strategy can improve after-tax returns.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'You have investment accounts with potential loss positions',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'nua-employer-stock',
    title: 'Net Unrealized Appreciation (NUA)',
    description: 'If you hold employer stock in a qualified retirement plan, NUA rules may allow you to pay lower capital gains rates instead of ordinary income rates on the appreciation.',
    whyForYou: 'You indicated employer stock holdings — this specialized strategy applies directly to your situation.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employer stock in qualified plan AND separated from service',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresEmployerStock: true,
      requiresSeparatedFromService: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      basePriorityBoost: 15
    }
  },
  {
    id: 'employer-stock-awareness',
    title: 'Employer Stock Considerations',
    description: 'Concentrated employer stock positions carry both opportunity and risk. Understanding your options for diversification and tax-efficient liquidation is important.',
    whyForYou: 'You indicated employer stock holdings — worth reviewing concentration and planning options.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'You hold employer stock in a retirement plan',
    evaluator: 'CFP',
    primaryTriggers: {
      requiresEmployerStock: true
    }
  },

  // ========================================
  // WITHDRAWAL & RMD STRATEGIES
  // ========================================
  {
    id: 'rmd-planning',
    title: 'RMD Planning Strategies',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead — especially during lower-income years — can reduce the size of these forced withdrawals and their tax impact.',
    whyForYou: 'With pre-tax retirement accounts, proactive planning before RMDs begin offers more flexibility.',
    impact: 'high',
    category: 'withdrawal',
    transitionYearPriority: 85,
    triggerReason: 'Age 60+ AND has pre-tax retirement accounts',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      minAge: 60,
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'],
      priorityAgeRange: { min: 65, max: 72 }
    }
  },
  {
    id: 'asset-sequencing',
    title: 'Withdrawal Sequencing',
    description: 'The order in which you draw from different account types (taxable, tax-deferred, tax-free) significantly affects lifetime taxes.',
    whyForYou: 'Understanding sequencing now helps position assets for efficient withdrawals later.',
    impact: 'medium',
    category: 'withdrawal',
    triggerReason: 'Age 55+ AND has pre-tax retirement accounts',
    evaluator: 'CFP',
    primaryTriggers: {
      minAge: 55,
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'qlac-awareness',
    title: 'Longevity Annuity Awareness',
    description: 'Qualified Longevity Annuity Contracts (QLACs) allow you to defer a portion of RMDs until age 85, reducing required withdrawals in earlier years.',
    whyForYou: 'QLACs can be one tool in managing RMD exposure for larger balances.',
    impact: 'low',
    category: 'withdrawal',
    complexity: 'high',
    triggerReason: 'Age 65+ AND meaningful pre-tax IRA balance',
    evaluator: 'CFP',
    primaryTriggers: {
      minAge: 65,
      requiresPreTaxRetirement: true
    },
    suppressionConditions: {
      suppressBelowRetirementTier: '500k-1m'
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },

  // ========================================
  // CHARITABLE & GIVING STRATEGIES
  // ========================================
  {
    id: 'qcd-qualified-charitable',
    title: 'Qualified Charitable Distributions',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but aren\'t included in taxable income.',
    whyForYou: 'Your age and charitable intent make this a potentially powerful tax-efficient giving strategy.',
    impact: 'high',
    category: 'giving',
    triggerReason: 'Age 70+ AND has traditional IRA AND charitable giving intent',
    evaluator: 'CPA',
    primaryTriggers: {
      minAge: 70,
      requiresPreTaxRetirement: true,
      requiresCharitableIntent: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      basePriorityBoost: 20
    }
  },
  {
    id: 'charitable-bunching',
    title: 'Charitable Bunching Strategy',
    description: 'Concentrating multiple years of charitable giving into one year can help exceed the standard deduction threshold, maximizing tax benefits. A donor-advised fund can facilitate this.',
    whyForYou: 'Timing charitable contributions strategically can amplify their tax benefit.',
    impact: 'medium',
    category: 'giving',
    triggerReason: 'Charitable giving intent indicated',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresCharitableIntent: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'],
      higherPriorityRealEstateTiers: ['750k-2m', '>2m']
    }
  },
  {
    id: 'crt-charitable-trust',
    title: 'Charitable Remainder Trust Awareness',
    description: 'CRTs can provide income, reduce estate taxes, and support charitable causes. They work well with appreciated assets you want to diversify without immediate capital gains.',
    whyForYou: 'Your charitable intent combined with appreciated assets makes this worth exploring.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'Charitable intent AND meaningful assets for trust funding',
    evaluator: 'CPA/Attorney',
    primaryTriggers: {
      requiresCharitableIntent: true
    },
    suppressionConditions: {
      suppressBelowRetirementTier: '500k-1m'
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['2.5m-5m', '>5m'],
      higherPriorityRealEstateTiers: ['750k-2m', '>2m'],
      basePriorityBoost: 10
    }
  },

  // ========================================
  // REAL ESTATE STRATEGIES
  // ========================================
  {
    id: '1031-exchange',
    title: '1031 Exchange Considerations',
    description: 'If you sell investment real estate, a 1031 exchange allows you to defer capital gains by reinvesting in like-kind property. Timing and rules are strict.',
    whyForYou: 'You indicated rental real estate holdings — this applies if you\'re considering selling or repositioning.',
    impact: 'high',
    category: 'general',
    triggerReason: 'Owns investment real estate with meaningful equity',
    evaluator: 'CPA/Attorney',
    primaryTriggers: {
      requiresRentalRealEstate: true
    },
    suppressionConditions: {
      suppressBelowRealEstateTier: '250k-750k'
    },
    priorityModifiers: {
      higherPriorityRealEstateTiers: ['750k-2m', '>2m'],
      basePriorityBoost: 15
    }
  },
  {
    id: 'real-estate-awareness',
    title: 'Real Estate Tax Considerations',
    description: 'Real estate equity creates both opportunities and complexity. Understanding how property fits into your overall tax picture — including basis step-up at death — is valuable.',
    whyForYou: 'Your real estate holdings add an important dimension to your tax planning.',
    impact: 'medium',
    category: 'general',
    triggerReason: 'Owns investment/rental real estate',
    evaluator: 'CPA',
    primaryTriggers: {
      requiresRentalRealEstate: true
    },
    priorityModifiers: {
      higherPriorityRealEstateTiers: ['750k-2m', '>2m']
    }
  },
  {
    id: 'depreciation-awareness',
    title: 'Depreciation Recapture Planning',
    description: 'When selling rental property, depreciation taken reduces your basis and creates recapture income taxed at up to 25%. Understanding this helps with sale timing and exit planning.',
    whyForYou: 'Rental property depreciation will affect your tax picture upon sale.',
    impact: 'medium',
    category: 'general',
    triggerReason: 'Owns rental real estate (depreciation assumed)',
    evaluator: 'CPA',
    primaryTriggers: {
      requiresRentalRealEstate: true
    }
  },

  // ========================================
  // BUSINESS OWNER STRATEGIES
  // ========================================
  {
    id: 'business-retirement-plans',
    title: 'Business Retirement Plan Options',
    description: 'Business owners have access to retirement plans with higher contribution limits than standard IRAs — SEP-IRAs, Solo 401(k)s, or defined benefit plans.',
    whyForYou: 'As a business owner, you may have retirement plan options that significantly increase tax-advantaged savings.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requiresBusinessOwnership: true
    },
    priorityModifiers: {
      basePriorityBoost: 20
    }
  },
  {
    id: 'qbi-deduction',
    title: 'Qualified Business Income Deduction',
    description: 'The QBI deduction allows eligible business owners to deduct up to 20% of qualified business income. Income thresholds and limitations apply.',
    whyForYou: 'Business ownership may qualify you for this significant deduction — worth reviewing with your tax advisor.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    evaluator: 'CPA',
    primaryTriggers: {
      requiresBusinessOwnership: true
    }
  },
  {
    id: 'entity-structure',
    title: 'Entity Structure Review',
    description: 'The way your business is structured (sole prop, LLC, S-Corp, C-Corp) has significant tax implications. Periodic review ensures optimal structure as circumstances change.',
    whyForYou: 'Business owners should periodically review whether their entity structure remains optimal.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    evaluator: 'CPA/Attorney',
    primaryTriggers: {
      requiresBusinessOwnership: true
    }
  },

  // ========================================
  // HEALTHCARE & MEDICARE
  // ========================================
  {
    id: 'healthcare-subsidy-awareness',
    title: 'Healthcare Subsidy Considerations',
    description: 'If you\'re purchasing marketplace insurance, your income level affects premium subsidies. Understanding thresholds helps inform conversion and income recognition decisions.',
    whyForYou: 'During income transitions, healthcare subsidies become an important planning factor.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 80,
    triggerReason: 'Age under 65 AND in transition year (may need marketplace insurance)',
    evaluator: 'CFP',
    primaryTriggers: {
      maxAge: 65,
      requiresTransitionYear: true
    }
  },
  {
    id: 'medicare-planning',
    title: 'Medicare Premium Considerations',
    description: 'Medicare premiums (IRMAA) are based on income from two years prior. Planning ahead can help manage these income-based surcharges.',
    whyForYou: 'Income decisions now will affect your Medicare premiums in future years.',
    impact: 'medium',
    category: 'timing',
    triggerReason: 'Age 62+ (approaching Medicare, IRMAA lookback applies)',
    evaluator: 'CFP',
    primaryTriggers: {
      minAge: 62
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'],
      priorityAgeRange: { min: 63, max: 70 }
    }
  },

  // ========================================
  // 529 & EDUCATION
  // ========================================
  {
    id: '529-to-roth',
    title: '529 to Roth Rollover Awareness',
    description: 'Recent legislation allows unused 529 funds to be rolled into a Roth IRA for the beneficiary, subject to limits and holding period requirements.',
    whyForYou: 'If you have 529 accounts with potentially excess funds, this new option is worth understanding.',
    impact: 'low',
    category: 'structure',
    triggerReason: 'You indicated 529 account ownership',
    evaluator: 'CPA/CFP',
    primaryTriggers: {
      requires529Account: true
    }
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
    
    // Suppress during unemployment if flagged
    if (strategy.suppressDuringUnemployment && flags.anyoneUnemployed) {
      return false;
    }
    
    // Suppression checks - asset-based practicality
    if (shouldSuppressStrategy(profile, strategy.suppressionConditions, strategy.complexity)) {
      return false;
    }
    
    // ========================================
    // PRIMARY TRIGGER CHECKS - ALL must pass
    // ========================================
    
    // Age checks
    if (triggers.minAge && age < triggers.minAge) return false;
    if (triggers.maxAge && age > triggers.maxAge) return false;
    
    // Marital status check
    if (triggers.maritalStatus && !triggers.maritalStatus.includes(profile.maritalStatus)) {
      return false;
    }
    
    // Employment status check
    if (triggers.employmentStatus && !triggers.employmentStatus.includes(profile.employmentStatus)) {
      return false;
    }
    
    // Behavioral/situational triggers
    if (triggers.requiresPreTaxRetirement && !hasPreTaxRetirement(profile)) {
      return false;
    }
    
    if (triggers.requiresCharitableIntent && !hasCharitableIntent(profile)) {
      return false;
    }
    
    if (triggers.requiresEmployerStock && !profile.hasEmployerStock) {
      return false;
    }
    
    if (triggers.requiresRentalRealEstate && !profile.hasRentalRealEstate) {
      return false;
    }
    
    if (triggers.requiresBusinessOwnership && !profile.hasBusinessOwnership) {
      return false;
    }
    
    if (triggers.requiresTransitionYear && !flags.isTransitionYear) {
      return false;
    }
    
    if (triggers.requiresLowerIncome && !flags.incomeLowerThanTypical) {
      return false;
    }
    
    // Additional explicit triggers
    if (triggers.requiresIncomeAboveRothLimits && !profile.incomeAboveRothLimits) {
      return false;
    }
    
    if (triggers.requiresNoLargePreTaxIRA && profile.hasLargePreTaxIRA) {
      return false;
    }
    
    if (triggers.requiresEmployer401kAfterTax && !profile.employer401kAllowsAfterTax) {
      return false;
    }
    
    if (triggers.requiresSeparatedFromService && !profile.separatedFromService) {
      return false;
    }
    
    if (triggers.requires529Account && !profile.has529Account) {
      return false;
    }
    
    return true;
  });

  // Calculate computed values and sort
  const scoredStrategies: MatchedStrategy[] = matchedStrategies.map(strategy => {
    let priorityScore = 0;
    const modifiers = strategy.priorityModifiers;
    
    if (flags.isTransitionYear && strategy.transitionYearPriority) {
      priorityScore += strategy.transitionYearPriority;
    }
    
    const computedImpactValue = computeImpact(strategy.impact, profile, strategy);
    const impactScore = { high: 30, medium: 20, low: 10 };
    priorityScore += impactScore[computedImpactValue];
    
    if (modifiers) {
      priorityScore += getRetirementPriorityBoost(profile, modifiers.higherPriorityRetirementTiers);
      priorityScore += getRealEstatePriorityBoost(profile, modifiers.higherPriorityRealEstateTiers);
      
      if (modifiers.priorityAgeRange) {
        if (age >= modifiers.priorityAgeRange.min && age <= modifiers.priorityAgeRange.max) {
          priorityScore += 15;
        }
      }
      
      if (modifiers.basePriorityBoost) {
        priorityScore += modifiers.basePriorityBoost;
      }
    }
    
    const urgencyLevel = computeUrgencyLevel(profile, strategy, flags);
    
    return {
      ...strategy,
      computedImpact: computedImpactValue,
      urgencyLevel,
      priorityScore
    };
  });

  scoredStrategies.sort((a, b) => b.priorityScore - a.priorityScore);

  return scoredStrategies;
}

// Generate cautionary notes based on profile
export function getTransitionYearCautions(profile: UserProfile): string[] {
  const flags = computeTransitionFlags(profile);
  const cautions: string[] = [];

  if (!flags.isTransitionYear) return cautions;

  if (flags.incomeLowerThanTypical && profile.age < 65) {
    cautions.push(
      "Healthcare subsidies: If you're using marketplace insurance, additional income (from conversions or capital gains) could affect your premium subsidies. Consider the full picture before acting."
    );
  }

  if (flags.incomeLowerThanTypical) {
    cautions.push(
      "Bracket thresholds: While lower income creates opportunities, be mindful of key thresholds — like the 12%/22% bracket boundary or capital gains rate changes — when timing income recognition."
    );
  }

  if (profile.age >= 62 && profile.age < 65) {
    cautions.push(
      "Medicare ahead: Income decisions now may affect Medicare premiums when you enroll. IRMAA surcharges are based on income from two years prior."
    );
  }

  if (flags.bothUnemployed) {
    cautions.push(
      "Temporary window: With both partners in transition, this year may offer unusual planning flexibility. Consider what actions make sense before circumstances change."
    );
  }

  if (flags.shortTermTransition) {
    cautions.push(
      "Time-limited opportunity: If you expect income to return to normal within a year, some strategies work best when implemented promptly."
    );
  }

  return cautions;
}
