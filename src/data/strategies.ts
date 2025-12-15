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
// Driven by objective thresholds, not subjective judgment
// ========================================
function computeImpact(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'high' | 'medium' | 'low' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  const charitableLevel = profile.charitableGiving || 'none';
  
  // Strategy-specific impact rules based on objective thresholds
  switch (strategy.id) {
    // ROTH CONVERSION: Based on pre-tax assets + income variability
    case 'roth-conversion-window':
    case 'lower-income-planning':
      // High: $1M+ with income variability
      if (retirementIndex >= 3 && flags.isTransitionYear) return 'high';
      // Medium: $250k–$1M
      if (retirementIndex >= 1 && retirementIndex <= 2) return 'medium';
      // Low: pre-tax assets < $250k
      return 'low';
    
    // QCD / RMD PLANNING: Based on charitable giving level + RMD exposure
    case 'qcd-qualified-charitable':
    case 'rmd-planning':
      // High: $15k+ charitable and meaningful RMD exposure ($1M+)
      if ((charitableLevel === '25k-100k' || charitableLevel === '>100k') && retirementIndex >= 3) return 'high';
      // Medium: $5k–$15k charitable OR $1M+ retirement
      if (charitableLevel === '5k-25k' || retirementIndex >= 3) return 'medium';
      // Low: charitable giving <$5k/year
      return 'low';
    
    // 1031 EXCHANGE: Based on real estate equity
    case '1031-exchange':
      // High: large embedded gains ($750k+ equity)
      if (realEstateIndex >= 3) return 'high';
      // Medium: $250k–$750k equity
      if (realEstateIndex === 2) return 'medium';
      // Low: single small rental (<$250k)
      return 'low';
    
    // REAL ESTATE STRATEGIES: Based on equity level
    case 'real-estate-awareness':
    case 'depreciation-awareness':
      if (realEstateIndex >= 3) return 'high';
      if (realEstateIndex === 2) return 'medium';
      return 'low';
    
    // NUA: Based on employer stock concentration (assume high if flagged)
    case 'nua-employer-stock':
      // High if $500k+ retirement (likely meaningful stock position)
      if (retirementIndex >= 2) return 'high';
      return 'medium';
    
    // BUSINESS STRATEGIES: Based on retirement tier (proxy for business size)
    case 'business-retirement-plans':
    case 'qbi-deduction':
    case 'entity-structure':
      if (retirementIndex >= 3) return 'high';
      if (retirementIndex >= 1) return 'medium';
      return 'low';
    
    // CHARITABLE STRATEGIES: Based on giving level
    case 'charitable-bunching':
    case 'crt-charitable-trust':
      if (charitableLevel === '25k-100k' || charitableLevel === '>100k') return 'high';
      if (charitableLevel === '5k-25k') return 'medium';
      return 'low';
    
    // WITHDRAWAL STRATEGIES: Based on pre-tax balance
    case 'asset-sequencing':
    case 'qlac-awareness':
      if (retirementIndex >= 3) return 'high';
      if (retirementIndex >= 1) return 'medium';
      return 'low';
    
    // BACKDOOR STRATEGIES: Medium unless high assets
    case 'backdoor-roth':
    case 'mega-backdoor-roth':
      if (retirementIndex >= 3) return 'high';
      return 'medium';
    
    // HEALTHCARE/MEDICARE: Based on timing relevance
    case 'healthcare-subsidy-awareness':
      if (flags.isTransitionYear && profile.age >= 55 && profile.age < 65) return 'high';
      if (flags.isTransitionYear) return 'medium';
      return 'low';
    
    case 'medicare-planning':
      // High if approaching Medicare with large assets
      if (profile.age >= 63 && profile.age <= 65 && retirementIndex >= 3) return 'high';
      if (profile.age >= 62 && retirementIndex >= 2) return 'medium';
      return 'low';
    
    // DEFAULT: Use base impact adjusted by retirement tier
    default:
      const baseImpact = strategy.impact;
      if (retirementIndex === 0) {
        if (baseImpact === 'high') return 'medium';
        if (baseImpact === 'medium') return 'low';
      }
      return baseImpact;
  }
}

function computeUrgencyLevel(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'worth-deeper-review' | 'worth-considering' | 'worth-noting' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  
  if (retirementIndex >= 3) {
    if (strategy.category === 'withdrawal' || strategy.id === 'roth-conversion-window' || strategy.id === 'rmd-planning') {
      return 'worth-deeper-review';
    }
  }
  
  if (flags.isTransitionYear && strategy.transitionYearPriority && strategy.transitionYearPriority > 70) {
    return 'worth-deeper-review';
  }
  
  if (retirementIndex >= 1 && retirementIndex <= 2) return 'worth-considering';
  if (retirementIndex === 0) return 'worth-noting';
  
  return 'worth-considering';
}

// Guardrail: Limit high-impact strategies to max 3
function applyHighImpactGuardrail(strategies: MatchedStrategy[]): MatchedStrategy[] {
  let highCount = 0;
  
  return strategies.map(strategy => {
    if (strategy.computedImpact === 'high') {
      highCount++;
      if (highCount > 3) {
        // Downgrade to medium
        return { ...strategy, computedImpact: 'medium' as const };
      }
    }
    return strategy;
  });
}

// ========================================
// CPA-FRIENDLY STRATEGY DEFINITIONS
// ========================================
export const strategies: Strategy[] = [
  // TIMING-BASED STRATEGIES
  {
    id: 'lower-income-planning',
    title: 'Lower-Income Year Planning Window',
    whatThisIs: 'A temporary period when reduced income may create opportunities to recognize taxable events at lower marginal rates.',
    whyItAppears: 'Employment transition or reduced income indicated for current year.',
    whyOftenExplored: 'Lower-income years may allow for tax-efficient repositioning of assets before income normalizes.',
    evaluator: 'CPA/CFP',
    description: 'When income drops temporarily, a unique planning window opens. Actions taken during these periods can have lasting benefits.',
    whyForYou: 'Your current income situation creates a window that may not be available in future years.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 100,
    triggerReason: 'Employment transition or lower income this year',
    primaryTriggers: { requiresTransitionYear: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 20 }
  },
  {
    id: 'roth-conversion-window',
    title: 'Roth IRA Conversion',
    whatThisIs: 'The transfer of pre-tax retirement account funds to a Roth IRA, triggering current-year taxable income in exchange for future tax-free growth.',
    whyItAppears: 'Pre-tax retirement accounts present and age under 73.',
    whyOftenExplored: 'Converting during lower-income years may result in paying taxes at reduced rates compared to future years or RMD periods.',
    evaluator: 'CPA/CFP',
    description: 'Converting pre-tax retirement funds to Roth accounts during lower-income periods means paying taxes now at potentially reduced rates.',
    whyForYou: 'You have pre-tax retirement accounts, and your current income situation may offer favorable conversion rates.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 90,
    triggerReason: 'Pre-tax retirement accounts AND age under 73',
    primaryTriggers: { minAge: 45, maxAge: 72, requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], priorityAgeRange: { min: 55, max: 72 } }
  },
  {
    id: 'backdoor-roth',
    title: 'Backdoor Roth IRA',
    whatThisIs: 'A two-step process where a non-deductible traditional IRA contribution is converted to a Roth IRA, allowing high earners to fund Roth accounts indirectly.',
    whyItAppears: 'Income above direct Roth contribution limits and no large existing pre-tax IRA balance indicated.',
    whyOftenExplored: 'Allows continued Roth contributions when income exceeds direct contribution thresholds.',
    evaluator: 'CPA',
    description: 'High earners above Roth IRA income limits can still fund Roth accounts through a two-step process.',
    whyForYou: 'Income may exceed Roth contribution limits and no large existing pre-tax IRA balance.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Income above Roth limits AND no large pre-tax IRA',
    primaryTriggers: { maxAge: 69, requiresIncomeAboveRothLimits: true, requiresNoLargePreTaxIRA: true }
  },
  {
    id: 'mega-backdoor-roth',
    title: 'Mega Backdoor Roth',
    whatThisIs: 'An employer plan feature allowing after-tax 401(k) contributions beyond standard limits, which can then be converted to Roth.',
    whyItAppears: 'Currently employed and employer plan allows after-tax contributions.',
    whyOftenExplored: 'Can significantly increase annual Roth contribution capacity when employer plan permits.',
    evaluator: 'CPA/CFP',
    description: 'Some employer 401(k) plans allow after-tax contributions beyond the standard limit, which can then be converted to Roth.',
    whyForYou: 'Your employer plan may allow after-tax contributions with in-plan conversions.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employed AND employer 401(k) allows after-tax',
    primaryTriggers: { employmentStatus: ['employed'], requiresEmployer401kAfterTax: true },
    priorityModifiers: { basePriorityBoost: 15 }
  },
  {
    id: 'bracket-management',
    title: 'Tax Bracket Management',
    whatThisIs: 'Strategic timing of income recognition, deductions, and conversions to manage exposure to marginal tax rate thresholds.',
    whyItAppears: 'Pre-tax retirement accounts present.',
    whyOftenExplored: 'Understanding bracket boundaries helps inform decisions about when to recognize income or take deductions.',
    evaluator: 'CPA',
    description: 'Understanding your marginal tax bracket helps optimize when to recognize income, make conversions, or take deductions.',
    whyForYou: 'Managing bracket thresholds becomes relevant with multiple account types.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 70,
    triggerReason: 'Pre-tax retirement accounts present',
    primaryTriggers: { requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 10 }
  },
  {
    id: 'capital-gains-harvesting',
    title: 'Capital Gains Harvesting',
    whatThisIs: 'Realizing long-term capital gains during years when income is low enough to qualify for the 0% capital gains rate, resetting cost basis.',
    whyItAppears: 'Income lower than typical this year.',
    whyOftenExplored: 'May allow resetting cost basis on appreciated assets without incurring federal capital gains tax.',
    evaluator: 'CPA/CFP',
    description: 'In years with lower ordinary income, you may be able to realize long-term capital gains at the 0% rate.',
    whyForYou: 'Your reduced income this year may qualify for preferential capital gains treatment.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 75,
    triggerReason: 'Income lower than typical this year',
    primaryTriggers: { requiresLowerIncome: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // STRUCTURE-BASED STRATEGIES
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    whatThisIs: 'The practice of placing investments in accounts based on their tax characteristics to optimize after-tax returns.',
    whyItAppears: 'Multiple account types with meaningful balances.',
    whyOftenExplored: 'Tax-inefficient assets in tax-advantaged accounts and tax-efficient assets in taxable accounts may improve after-tax outcomes.',
    evaluator: 'CFP',
    description: 'Where you hold different investments matters. Placing tax-inefficient assets in tax-advantaged accounts can improve after-tax returns.',
    whyForYou: 'With multiple account types, strategic placement can compound benefits over time.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Pre-tax retirement accounts present',
    primaryTriggers: { requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'] }
  },
  {
    id: 'hsa-optimization',
    title: 'HSA Optimization',
    whatThisIs: 'Health Savings Accounts offer triple tax advantages: deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.',
    whyItAppears: 'Age under 65 and potential HDHP eligibility.',
    whyOftenExplored: 'HSAs provide unique tax benefits not available through other account types.',
    evaluator: 'CPA/CFP',
    description: 'Health Savings Accounts offer triple tax advantages when paired with a high-deductible health plan.',
    whyForYou: 'If you have HSA access, maximizing contributions builds a tax-efficient reserve.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Age under 65 AND potential HDHP eligibility',
    primaryTriggers: { maxAge: 65, employmentStatus: ['employed', 'unemployed'] }
  },
  {
    id: 'spousal-ira',
    title: 'Spousal IRA Contributions',
    whatThisIs: 'IRA contributions made on behalf of a non-working spouse using the working spouse\'s earned income.',
    whyItAppears: 'Married and within IRA contribution age limits.',
    whyOftenExplored: 'Allows continued retirement account funding for both spouses regardless of individual employment status.',
    evaluator: 'CPA/CFP',
    description: 'Even when one spouse is not working, the working spouse can contribute to an IRA on their behalf.',
    whyForYou: 'Your household situation allows for continued retirement contributions for both spouses.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Married AND age allows IRA contributions',
    primaryTriggers: { maritalStatus: ['married'], maxAge: 73 }
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    whatThisIs: 'Selling investments at a loss to offset capital gains and up to $3,000 of ordinary income annually, while maintaining market exposure.',
    whyItAppears: 'Investment accounts present.',
    whyOftenExplored: 'Ongoing harvesting can reduce current-year taxes while maintaining investment strategy.',
    evaluator: 'CPA/CFP',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes. Losses can also offset up to $3,000 of ordinary income.',
    whyForYou: 'With taxable investments alongside retirement accounts, this ongoing strategy can improve after-tax returns.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Investment accounts present',
    primaryTriggers: { requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },
  {
    id: 'nua-employer-stock',
    title: 'Net Unrealized Appreciation (NUA)',
    whatThisIs: 'A tax treatment allowing employer stock in qualified plans to be distributed in-kind, with appreciation taxed at capital gains rates rather than ordinary income.',
    whyItAppears: 'Employer stock in qualified plan AND separated from service.',
    whyOftenExplored: 'May result in lower total tax on highly appreciated employer stock compared to standard distribution treatment.',
    evaluator: 'CPA/CFP',
    description: 'If you hold employer stock in a qualified retirement plan, NUA rules may allow capital gains treatment on the appreciation.',
    whyForYou: 'You indicated employer stock holdings and separation from service.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employer stock in plan AND separated from service',
    primaryTriggers: { requiresEmployerStock: true, requiresSeparatedFromService: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 15 }
  },
  {
    id: 'employer-stock-awareness',
    title: 'Employer Stock Considerations',
    whatThisIs: 'Review of concentrated employer stock positions for diversification options and tax-efficient liquidation strategies.',
    whyItAppears: 'Employer stock holdings indicated.',
    whyOftenExplored: 'Concentrated positions carry both opportunity and concentration risk that warrants periodic review.',
    evaluator: 'CFP',
    description: 'Concentrated employer stock positions carry both opportunity and risk. Understanding your options is important.',
    whyForYou: 'You indicated employer stock holdings.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Employer stock holdings indicated',
    primaryTriggers: { requiresEmployerStock: true }
  },

  // WITHDRAWAL & RMD STRATEGIES
  {
    id: 'rmd-planning',
    title: 'RMD Planning Strategies',
    whatThisIs: 'Proactive management of Required Minimum Distributions from pre-tax retirement accounts, which begin at age 73.',
    whyItAppears: 'Age 60+ and pre-tax retirement accounts present.',
    whyOftenExplored: 'Reducing pre-tax balances before RMDs begin may lower future required distributions and their tax impact.',
    evaluator: 'CPA/CFP',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead can reduce the size of these forced withdrawals.',
    whyForYou: 'With pre-tax retirement accounts, proactive planning before RMDs begin offers more flexibility.',
    impact: 'high',
    category: 'withdrawal',
    transitionYearPriority: 85,
    triggerReason: 'Age 60+ AND pre-tax retirement accounts',
    primaryTriggers: { minAge: 60, requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'], priorityAgeRange: { min: 65, max: 72 } }
  },
  {
    id: 'asset-sequencing',
    title: 'Withdrawal Sequencing',
    whatThisIs: 'Strategic ordering of withdrawals from taxable, tax-deferred, and tax-free accounts to optimize lifetime tax efficiency.',
    whyItAppears: 'Age 55+ and multiple account types present.',
    whyOftenExplored: 'The sequence of withdrawals can significantly affect total lifetime taxes paid.',
    evaluator: 'CFP',
    description: 'The order in which you draw from different account types significantly affects lifetime taxes.',
    whyForYou: 'Understanding sequencing now helps position assets for efficient withdrawals later.',
    impact: 'medium',
    category: 'withdrawal',
    triggerReason: 'Age 55+ AND pre-tax accounts present',
    primaryTriggers: { minAge: 55, requiresPreTaxRetirement: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },
  {
    id: 'qlac-awareness',
    title: 'Qualified Longevity Annuity Contract (QLAC)',
    whatThisIs: 'A deferred income annuity purchased within a retirement account that can defer a portion of RMDs until age 85.',
    whyItAppears: 'Age 65+ and meaningful pre-tax IRA balance.',
    whyOftenExplored: 'May reduce required distributions in earlier years while providing longevity income protection.',
    evaluator: 'CFP',
    description: 'QLACs allow you to defer a portion of RMDs until age 85, reducing required withdrawals in earlier years.',
    whyForYou: 'QLACs can be one tool in managing RMD exposure for larger balances.',
    impact: 'low',
    category: 'withdrawal',
    complexity: 'high',
    triggerReason: 'Age 65+ AND meaningful IRA balance',
    primaryTriggers: { minAge: 65, requiresPreTaxRetirement: true },
    suppressionConditions: { suppressBelowRetirementTier: '500k-1m' },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'] }
  },

  // CHARITABLE STRATEGIES
  {
    id: 'qcd-qualified-charitable',
    title: 'Qualified Charitable Distribution (QCD)',
    whatThisIs: 'Direct transfer from an IRA to a qualified charity, which counts toward RMDs but is excluded from taxable income.',
    whyItAppears: 'Age 70+ AND traditional IRA present AND charitable intent indicated.',
    whyOftenExplored: 'Satisfies charitable giving goals while reducing taxable RMD income.',
    evaluator: 'CPA',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but are excluded from taxable income.',
    whyForYou: 'Your age and charitable intent make this worth reviewing.',
    impact: 'high',
    category: 'giving',
    triggerReason: 'Age 70+ AND IRA AND charitable intent',
    primaryTriggers: { minAge: 70, requiresPreTaxRetirement: true, requiresCharitableIntent: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'], basePriorityBoost: 20 }
  },
  {
    id: 'charitable-bunching',
    title: 'Charitable Bunching Strategy',
    whatThisIs: 'Concentrating multiple years of charitable contributions into a single year to exceed the standard deduction and itemize.',
    whyItAppears: 'Charitable giving intent indicated.',
    whyOftenExplored: 'May increase tax benefit of charitable giving compared to spreading donations evenly across years.',
    evaluator: 'CPA/CFP',
    description: 'Concentrating multiple years of charitable giving into one year can help exceed the standard deduction threshold.',
    whyForYou: 'Timing charitable contributions strategically can amplify their tax benefit.',
    impact: 'medium',
    category: 'giving',
    triggerReason: 'Charitable giving intent indicated',
    primaryTriggers: { requiresCharitableIntent: true },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'], higherPriorityRealEstateTiers: ['750k-2m', '>2m'] }
  },
  {
    id: 'crt-charitable-trust',
    title: 'Charitable Remainder Trust (CRT)',
    whatThisIs: 'An irrevocable trust that provides income to the donor for a period, with the remainder passing to charity.',
    whyItAppears: 'Charitable intent AND meaningful assets for trust funding.',
    whyOftenExplored: 'Can provide income, defer capital gains on appreciated assets, and support charitable goals.',
    evaluator: 'CPA/Attorney',
    description: 'CRTs can provide income, reduce estate taxes, and support charitable causes. They work well with appreciated assets.',
    whyForYou: 'Your charitable intent combined with appreciated assets makes this worth reviewing.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'Charitable intent AND meaningful assets',
    primaryTriggers: { requiresCharitableIntent: true },
    suppressionConditions: { suppressBelowRetirementTier: '500k-1m' },
    priorityModifiers: { higherPriorityRetirementTiers: ['2.5m-5m', '>5m'], higherPriorityRealEstateTiers: ['750k-2m', '>2m'], basePriorityBoost: 10 }
  },

  // REAL ESTATE STRATEGIES
  {
    id: '1031-exchange',
    title: '1031 Like-Kind Exchange',
    whatThisIs: 'Deferral of capital gains tax on the sale of investment real estate by reinvesting proceeds into like-kind replacement property.',
    whyItAppears: 'Investment real estate with meaningful equity indicated.',
    whyOftenExplored: 'Allows repositioning of real estate holdings without triggering immediate capital gains recognition.',
    evaluator: 'CPA/Attorney',
    description: 'If you sell investment real estate, a 1031 exchange allows you to defer capital gains by reinvesting in like-kind property.',
    whyForYou: 'You indicated rental real estate holdings.',
    impact: 'high',
    category: 'general',
    triggerReason: 'Investment real estate with meaningful equity',
    primaryTriggers: { requiresRentalRealEstate: true },
    suppressionConditions: { suppressBelowRealEstateTier: '250k-750k' },
    priorityModifiers: { higherPriorityRealEstateTiers: ['750k-2m', '>2m'], basePriorityBoost: 15 }
  },
  {
    id: 'real-estate-awareness',
    title: 'Real Estate Tax Considerations',
    whatThisIs: 'Overview of tax implications related to investment real estate, including basis step-up, depreciation, and disposition strategies.',
    whyItAppears: 'Investment/rental real estate indicated.',
    whyOftenExplored: 'Real estate adds complexity to tax planning that warrants periodic review with advisors.',
    evaluator: 'CPA',
    description: 'Real estate equity creates both opportunities and complexity in your overall tax picture.',
    whyForYou: 'Your real estate holdings add an important dimension to your tax planning.',
    impact: 'medium',
    category: 'general',
    triggerReason: 'Investment/rental real estate indicated',
    primaryTriggers: { requiresRentalRealEstate: true },
    priorityModifiers: { higherPriorityRealEstateTiers: ['750k-2m', '>2m'] }
  },
  {
    id: 'depreciation-awareness',
    title: 'Depreciation Recapture Planning',
    whatThisIs: 'Tax treatment upon sale of rental property where accumulated depreciation is "recaptured" and taxed at up to 25%.',
    whyItAppears: 'Rental real estate indicated (depreciation assumed).',
    whyOftenExplored: 'Understanding recapture implications helps inform sale timing and exit strategy decisions.',
    evaluator: 'CPA',
    description: 'When selling rental property, depreciation taken reduces your basis and creates recapture income taxed at up to 25%.',
    whyForYou: 'Rental property depreciation will affect your tax picture upon sale.',
    impact: 'medium',
    category: 'general',
    triggerReason: 'Rental real estate indicated',
    primaryTriggers: { requiresRentalRealEstate: true }
  },

  // BUSINESS OWNER STRATEGIES
  {
    id: 'business-retirement-plans',
    title: 'Business Retirement Plan Options',
    whatThisIs: 'Retirement plans available to business owners with higher contribution limits than standard IRAs, including SEP-IRA, Solo 401(k), and defined benefit plans.',
    whyItAppears: 'Business ownership indicated.',
    whyOftenExplored: 'May allow significantly higher tax-advantaged retirement contributions than employee-only options.',
    evaluator: 'CPA/CFP',
    description: 'Business owners have access to retirement plans with higher contribution limits than standard IRAs.',
    whyForYou: 'As a business owner, you may have retirement plan options that increase tax-advantaged savings.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    primaryTriggers: { requiresBusinessOwnership: true },
    priorityModifiers: { basePriorityBoost: 20 }
  },
  {
    id: 'qbi-deduction',
    title: 'Qualified Business Income (QBI) Deduction',
    whatThisIs: 'A deduction of up to 20% of qualified business income for eligible pass-through entities, subject to income thresholds and limitations.',
    whyItAppears: 'Business ownership indicated.',
    whyOftenExplored: 'Can provide substantial deduction for qualifying business income.',
    evaluator: 'CPA',
    description: 'The QBI deduction allows eligible business owners to deduct up to 20% of qualified business income.',
    whyForYou: 'Business ownership may qualify you for this deduction.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    primaryTriggers: { requiresBusinessOwnership: true }
  },
  {
    id: 'entity-structure',
    title: 'Entity Structure Review',
    whatThisIs: 'Periodic assessment of business entity type (sole prop, LLC, S-Corp, C-Corp) for optimal tax treatment given current circumstances.',
    whyItAppears: 'Business ownership indicated.',
    whyOftenExplored: 'Entity structure has significant tax implications that may change as business circumstances evolve.',
    evaluator: 'CPA/Attorney',
    description: 'The way your business is structured has significant tax implications. Periodic review ensures optimal structure.',
    whyForYou: 'Business owners should periodically review whether their entity structure remains optimal.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Business ownership indicated',
    primaryTriggers: { requiresBusinessOwnership: true }
  },

  // HEALTHCARE & MEDICARE
  {
    id: 'healthcare-subsidy-awareness',
    title: 'Healthcare Subsidy Considerations',
    whatThisIs: 'Review of how income affects marketplace insurance premium subsidies (Premium Tax Credits) and cost-sharing reductions.',
    whyItAppears: 'Age under 65 AND in transition year (may need marketplace coverage).',
    whyOftenExplored: 'Income decisions can significantly affect subsidy eligibility and net insurance costs.',
    evaluator: 'CFP',
    description: 'If purchasing marketplace insurance, your income level affects premium subsidies.',
    whyForYou: 'During income transitions, healthcare subsidies become an important planning factor.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 80,
    triggerReason: 'Age under 65 AND transition year',
    primaryTriggers: { maxAge: 65, requiresTransitionYear: true }
  },
  {
    id: 'medicare-planning',
    title: 'Medicare Premium Considerations (IRMAA)',
    whatThisIs: 'Income-Related Monthly Adjustment Amounts that increase Medicare Part B and D premiums based on income from two years prior.',
    whyItAppears: 'Age 62+ (approaching Medicare enrollment period).',
    whyOftenExplored: 'Current income decisions affect future Medicare premiums due to the two-year lookback.',
    evaluator: 'CFP',
    description: 'Medicare premiums (IRMAA) are based on income from two years prior. Planning ahead can help manage these surcharges.',
    whyForYou: 'Income decisions now will affect your Medicare premiums in future years.',
    impact: 'medium',
    category: 'timing',
    triggerReason: 'Age 62+ (IRMAA lookback applies)',
    primaryTriggers: { minAge: 62 },
    priorityModifiers: { higherPriorityRetirementTiers: ['1m-2.5m', '2.5m-5m', '>5m'], priorityAgeRange: { min: 63, max: 70 } }
  },

  // 529 & EDUCATION
  {
    id: '529-to-roth',
    title: '529-to-Roth Rollover',
    whatThisIs: 'Under SECURE 2.0, unused 529 funds can be rolled into a Roth IRA for the beneficiary, subject to lifetime limits and holding period requirements.',
    whyItAppears: '529 account ownership indicated.',
    whyOftenExplored: 'Provides an option for 529 funds that exceed education needs.',
    evaluator: 'CPA/CFP',
    description: 'Recent legislation allows unused 529 funds to be rolled into a Roth IRA for the beneficiary, subject to limits.',
    whyForYou: 'If you have 529 accounts with potentially excess funds, this option is worth understanding.',
    impact: 'low',
    category: 'structure',
    triggerReason: '529 account ownership indicated',
    primaryTriggers: { requires529Account: true }
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
    
    // PRIMARY TRIGGER CHECKS
    if (triggers.minAge && age < triggers.minAge) return false;
    if (triggers.maxAge && age > triggers.maxAge) return false;
    if (triggers.maritalStatus && !triggers.maritalStatus.includes(profile.maritalStatus)) return false;
    if (triggers.employmentStatus && !triggers.employmentStatus.includes(profile.employmentStatus)) return false;
    if (triggers.requiresPreTaxRetirement && !hasPreTaxRetirement(profile)) return false;
    if (triggers.requiresCharitableIntent && !hasCharitableIntent(profile)) return false;
    if (triggers.requiresEmployerStock && !profile.hasEmployerStock) return false;
    if (triggers.requiresRentalRealEstate && !profile.hasRentalRealEstate) return false;
    if (triggers.requiresBusinessOwnership && !profile.hasBusinessOwnership) return false;
    if (triggers.requiresTransitionYear && !flags.isTransitionYear) return false;
    if (triggers.requiresLowerIncome && !flags.incomeLowerThanTypical) return false;
    if (triggers.requiresIncomeAboveRothLimits && !profile.incomeAboveRothLimits) return false;
    if (triggers.requiresNoLargePreTaxIRA && profile.hasLargePreTaxIRA) return false;
    if (triggers.requiresEmployer401kAfterTax && !profile.employer401kAllowsAfterTax) return false;
    if (triggers.requiresSeparatedFromService && !profile.separatedFromService) return false;
    if (triggers.requires529Account && !profile.has529Account) return false;
    
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

  // Sort by priority score (highest first)
  scoredStrategies.sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Apply guardrail: limit high-impact strategies to max 3
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
