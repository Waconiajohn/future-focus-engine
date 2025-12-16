/**
 * Strategies v2 - Scoring-based matching system
 * Each strategy has a base score from net worth tier + bonus from matching triggers
 */

import type { Strategy, MatchedStrategy, UserProfile, TransitionYearFlags, RetirementRange, RealEstateRange } from '@/types/persona';
import { computeTransitionFlags } from '@/types/persona';
import { 
  getRetirementTierIndex, 
  getRealEstateTierIndex,
  getNetWorthScore,
  isTierRelevant,
  calculateTriggerScore,
  SCORE_THRESHOLD,
  MAX_STRATEGIES
} from '@/lib/strategy-scoring';

// ========================================
// ALL 26 STRATEGIES - COMPREHENSIVE DEFINITIONS
// ========================================
export const strategies: Strategy[] = [
  {
    id: 'roth-conversion',
    title: 'Roth IRA Conversion',
    whatThisIs: 'Moving money from a traditional IRA/401(k) into a Roth IRA, paying tax now in exchange for tax-free growth/withdrawals later and no RMDs.',
    whyItAppears: 'Has pre-tax retirement accounts. Best in lower-income years before RMDs begin.',
    whyOftenExplored: 'Often explored when current-year income is lower than expected future income, potentially allowing conversion at reduced tax rates.',
    evaluator: 'CPA/CFP',
    description: 'Converting pre-tax retirement funds to Roth during lower-income periods may result in paying taxes at reduced rates.',
    whyForYou: 'Your profile indicates pre-tax retirement accounts with favorable conversion conditions.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 90,
    triggerReason: 'Has pre-tax retirement AND age < 73 AND income conditions favorable',
    primaryTriggers: { maxAge: 72, requiresPreTaxRetirement: true },
  },
  {
    id: 'backdoor-roth',
    title: 'Backdoor Roth IRA',
    whatThisIs: 'A two-step process where a non-deductible traditional IRA contribution is converted to Roth, allowing high earners to fund Roth accounts indirectly.',
    whyItAppears: 'Income above Roth limits. Best when no large pre-tax IRA balance exists.',
    whyOftenExplored: 'Often explored when income exceeds direct Roth contribution thresholds.',
    evaluator: 'CPA',
    description: 'High earners above Roth IRA income limits can still fund Roth accounts through a two-step contribution and conversion process.',
    whyForYou: 'Your income level suggests this strategy may be applicable.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'High income households seeking Roth access',
    primaryTriggers: { maxAge: 69 },
  },
  {
    id: 'mega-backdoor-roth',
    title: 'Mega Backdoor Roth',
    whatThisIs: 'An employer plan feature allowing after-tax 401(k) contributions beyond standard limits, which can then be converted to Roth.',
    whyItAppears: 'Employed with potentially eligible employer plan.',
    whyOftenExplored: 'Often explored when seeking to maximize Roth contributions beyond standard limits.',
    evaluator: 'CPA/CFP',
    description: 'Some employer 401(k) plans allow after-tax contributions beyond the standard limit, which can then be converted to Roth.',
    whyForYou: 'Your employer plan may allow after-tax contributions with conversion options.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Employed with 401(k) access',
    primaryTriggers: { employmentStatus: ['employed'] },
  },
  {
    id: 'rmd-minimization',
    title: 'RMD Minimization Strategies',
    whatThisIs: 'Proactive management to reduce Required Minimum Distributions from pre-tax retirement accounts, which begin at age 73.',
    whyItAppears: 'Age 60+ with pre-tax retirement accounts.',
    whyOftenExplored: 'Often explored when pre-tax balances are large enough that forced distributions may push into higher tax brackets.',
    evaluator: 'CPA/CFP',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead can reduce the size of these forced withdrawals.',
    whyForYou: 'You are approaching or past RMD age with pre-tax retirement accounts.',
    impact: 'high',
    category: 'withdrawal',
    transitionYearPriority: 85,
    triggerReason: 'Age 60+ with retirement assets',
    primaryTriggers: { minAge: 60, requiresPreTaxRetirement: true },
  },
  {
    id: 'qcd',
    title: 'Qualified Charitable Distribution (QCD)',
    whatThisIs: 'Direct transfer from an IRA to a qualified charity, which counts toward RMDs but is excluded from taxable income.',
    whyItAppears: 'Age 70+ with traditional IRA and charitable intent.',
    whyOftenExplored: 'Often explored when satisfying charitable giving goals while reducing taxable RMD income.',
    evaluator: 'CPA',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but are excluded from taxable income.',
    whyForYou: 'Your age, IRA ownership, and charitable intent align with QCD eligibility.',
    impact: 'high',
    category: 'giving',
    triggerReason: 'Age 70+ with charitable goals',
    primaryTriggers: { minAge: 70, requiresCharitableIntent: true },
  },
  {
    id: 'qlac',
    title: 'Qualified Longevity Annuity Contract (QLAC)',
    whatThisIs: 'A deferred income annuity purchased within a retirement account that can defer a portion of RMDs until age 85.',
    whyItAppears: 'Age 60+ with significant pre-tax retirement accounts.',
    whyOftenExplored: 'Often explored when seeking to reduce required distributions in earlier years while providing longevity income protection.',
    evaluator: 'CFP',
    description: 'QLACs allow you to defer a portion of RMDs until age 85, reducing required withdrawals in earlier years.',
    whyForYou: 'Your age and retirement account balances align with QLAC considerations.',
    impact: 'medium',
    category: 'withdrawal',
    complexity: 'high',
    triggerReason: 'Age 60+ with large pre-tax balances',
    primaryTriggers: { minAge: 60, requiresPreTaxRetirement: true },
  },
  {
    id: 'nua',
    title: 'Net Unrealized Appreciation (NUA)',
    whatThisIs: 'A tax treatment allowing employer stock in qualified plans to be distributed in-kind, with appreciation taxed at capital gains rates rather than ordinary income.',
    whyItAppears: 'Has employer stock in 401(k) or has recently separated from service.',
    whyOftenExplored: 'Often explored when employer stock has significant appreciation and separation from service has occurred.',
    evaluator: 'CPA/CFP',
    description: 'If you hold employer stock in a qualified retirement plan, NUA rules may allow capital gains treatment on the appreciation.',
    whyForYou: 'You may have employer stock holdings or recently changed jobs.',
    impact: 'high',
    category: 'structure',
    triggerReason: 'Potential employer stock in retirement plan',
    primaryTriggers: { requiresEmployerStock: true },
  },
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    whatThisIs: 'The practice of placing investments in accounts based on their tax characteristics to optimize after-tax returns.',
    whyItAppears: 'Has multiple account types or significant retirement assets.',
    whyOftenExplored: 'Often explored when holding investments across taxable, tax-deferred, and tax-free accounts.',
    evaluator: 'CFP',
    description: 'Where you hold different investments matters. Strategic placement across account types can improve after-tax returns.',
    whyForYou: 'You likely have multiple account types that could benefit from strategic placement.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Multiple account types likely',
    primaryTriggers: { requiresMultipleAccountTypes: true },
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    whatThisIs: 'Selling investments at a loss to offset capital gains and up to $3,000 of ordinary income annually, with indefinite carryforward.',
    whyItAppears: 'Has taxable brokerage account.',
    whyOftenExplored: 'Often explored during periods of market decline to capture losses for tax benefit while staying invested.',
    evaluator: 'CPA/CFP',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes while maintaining investment strategy.',
    whyForYou: 'Taxable account holdings can benefit from systematic loss harvesting.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Has taxable investments',
    primaryTriggers: { requiresTaxableBrokerage: true },
  },
  {
    id: 'cost-basis-planning',
    title: 'Cost Basis Planning',
    whatThisIs: 'Strategic management of investment cost basis through specific lot identification, gain/loss harvesting, and holding period optimization.',
    whyItAppears: 'Has taxable investments with potential embedded gains.',
    whyOftenExplored: 'Often explored when holding appreciated positions and seeking to manage tax impact of future sales.',
    evaluator: 'CPA/CFP',
    description: 'Managing cost basis through specific lot identification and holding periods can optimize tax outcomes on investment sales.',
    whyForYou: 'Taxable investments benefit from strategic cost basis management.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Has taxable investments',
    primaryTriggers: { requiresTaxableBrokerage: true },
  },
  {
    id: 'municipal-bonds',
    title: 'Municipal Bond Considerations',
    whatThisIs: 'Debt securities issued by state and local governments that typically pay interest exempt from federal income tax.',
    whyItAppears: 'Higher net worth with likely high tax bracket.',
    whyOftenExplored: 'Often explored when tax-equivalent yield on municipals exceeds taxable bond yields for the investor.',
    evaluator: 'CFP',
    description: 'Municipal bonds may provide tax-exempt income that exceeds after-tax returns on taxable bonds for high-bracket investors.',
    whyForYou: 'Your asset level suggests municipal bonds may warrant review for fixed income allocation.',
    impact: 'medium',
    category: 'investment',
    triggerReason: 'Higher net worth investor',
    primaryTriggers: { requiresHighTaxBracket: true },
  },
  {
    id: 'hsa',
    title: 'Health Savings Account (HSA) Optimization',
    whatThisIs: 'A tax-advantaged account offering triple tax benefits: deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.',
    whyItAppears: 'May be enrolled in or eligible for high-deductible health plan.',
    whyOftenExplored: 'Often explored for its unique triple tax advantage not available through other account types.',
    evaluator: 'CPA/CFP',
    description: 'HSAs offer triple tax advantages when paired with a high-deductible health plan.',
    whyForYou: 'HSA benefits are worth considering if you have or can get HDHP coverage.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Available to those under 65 with HDHP eligibility',
    primaryTriggers: { maxAge: 64, requiresHDHP: true },
  },
  {
    id: '529-planning',
    title: '529 Education Savings Planning',
    whatThisIs: 'Tax-advantaged savings accounts for education expenses, offering tax-free growth and withdrawals for qualified education costs.',
    whyItAppears: 'May have education funding goals.',
    whyOftenExplored: 'Often explored for funding education expenses with tax-free growth potential.',
    evaluator: 'CFP',
    description: '529 plans offer tax-free growth and withdrawals for qualified education expenses. New rules allow limited 529-to-Roth rollovers.',
    whyForYou: 'Education planning can benefit from 529 tax advantages.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Education funding consideration',
    primaryTriggers: { requiresEducationFundingIntent: true },
  },
  {
    id: 'daf',
    title: 'Donor-Advised Fund (DAF)',
    whatThisIs: 'A charitable giving vehicle that allows an immediate tax deduction while distributing funds to charities over time.',
    whyItAppears: 'Has charitable intent and taxable assets.',
    whyOftenExplored: 'Often explored to accelerate charitable deductions into high-income years while spreading actual grants over time.',
    evaluator: 'CPA/CFP',
    description: 'DAFs allow immediate tax deduction with flexibility to recommend grants to charities over multiple years.',
    whyForYou: 'Charitable giving combined with appreciated assets creates DAF opportunities.',
    impact: 'medium',
    category: 'giving',
    triggerReason: 'Charitable intent with taxable assets',
    primaryTriggers: { requiresCharitableIntent: true, requiresTaxableBrokerage: true },
  },
  {
    id: 'crt',
    title: 'Charitable Remainder Trust (CRT)',
    whatThisIs: 'An irrevocable trust that provides income to the donor for a period, with the remainder passing to charity.',
    whyItAppears: 'Higher net worth with appreciated assets and charitable intent.',
    whyOftenExplored: 'Often explored when holding highly appreciated assets and seeking income, capital gains deferral, and charitable impact.',
    evaluator: 'CPA/Attorney',
    description: 'CRTs can provide income, defer capital gains on appreciated assets, and support charitable goals.',
    whyForYou: 'Significant assets and charitable goals may align with CRT considerations.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'High net worth with charitable intent',
    primaryTriggers: { requiresCharitableIntent: true },
  },
  {
    id: '1031-exchange',
    title: '1031 Like-Kind Exchange',
    whatThisIs: 'Deferral of capital gains tax on the sale of investment real estate by reinvesting proceeds into like-kind replacement property.',
    whyItAppears: 'Has or may have investment real estate.',
    whyOftenExplored: 'Often explored when repositioning real estate holdings without triggering immediate capital gains recognition.',
    evaluator: 'CPA/Attorney',
    description: 'If you sell investment real estate, a 1031 exchange allows you to defer capital gains by reinvesting in like-kind property.',
    whyForYou: 'Investment real estate owners should understand 1031 exchange options.',
    impact: 'high',
    category: 'real-estate',
    triggerReason: 'Real estate holdings',
    primaryTriggers: { requiresRentalRealEstate: true },
  },
  {
    id: 'rental-loss-reps',
    title: 'Rental Loss / Real Estate Professional Status',
    whatThisIs: 'Tax treatment of rental real estate losses, including special rules for those who qualify as real estate professionals.',
    whyItAppears: 'Has or may have rental real estate.',
    whyOftenExplored: 'Often explored when rental activities generate losses that may offset other income under certain conditions.',
    evaluator: 'CPA',
    description: 'Rental property losses may offset other income depending on participation level and real estate professional status.',
    whyForYou: 'Rental real estate losses can provide tax benefits with proper planning.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'Real estate holdings',
    primaryTriggers: { requiresRentalRealEstate: true },
  },
  {
    id: 'conservation-easement',
    title: 'Conservation Easement',
    whatThisIs: 'A donation of development rights on land to a qualified organization, potentially generating a charitable deduction.',
    whyItAppears: 'High net worth with potential land holdings.',
    whyOftenExplored: 'Often explored when holding significant land and seeking large charitable deductions. Note: IRS scrutiny is significant.',
    evaluator: 'CPA/Attorney',
    description: 'Donating development rights on land may generate charitable deductions. Subject to significant IRS scrutiny.',
    whyForYou: 'High net worth individuals with land may explore this option.',
    impact: 'medium',
    category: 'giving',
    complexity: 'high',
    triggerReason: 'High net worth with potential land',
    primaryTriggers: { requiresHighIncomeYear: true },
  },
  {
    id: 'opportunity-zone',
    title: 'Opportunity Zone Investment',
    whatThisIs: 'Investment of capital gains into designated economically distressed areas for potential tax deferral and exclusion benefits.',
    whyItAppears: 'May have realized or upcoming capital gains.',
    whyOftenExplored: 'Often explored when seeking to defer capital gains while investing in designated development areas.',
    evaluator: 'CPA/CFP',
    description: 'Investing capital gains in Opportunity Zones may provide tax deferral and potential exclusion on appreciation.',
    whyForYou: 'Capital gains from sales can potentially be deferred through OZ investments.',
    impact: 'medium',
    category: 'investment',
    triggerReason: 'Potential capital gains',
    primaryTriggers: { requiresRealizedCapitalGains: true },
  },
  {
    id: 'installment-sale',
    title: 'Installment Sale',
    whatThisIs: 'Selling property in exchange for payments over time, allowing gain recognition to be spread across multiple tax years.',
    whyItAppears: 'May be considering sale of business or real estate.',
    whyOftenExplored: 'Often explored when seeking to spread gain recognition across years to manage tax bracket exposure.',
    evaluator: 'CPA/Attorney',
    description: 'Installment sales allow gain recognition to be spread over the payment period.',
    whyForYou: 'Large asset sales can benefit from installment treatment.',
    impact: 'medium',
    category: 'business',
    triggerReason: 'Potential large asset sale',
    primaryTriggers: { requiresSellingBusinessOrRealEstate: true },
  },
  {
    id: 'qsbs',
    title: 'Qualified Small Business Stock (QSBS)',
    whatThisIs: 'Potential exclusion of up to 100% of gain on the sale of qualified small business stock held for more than 5 years.',
    whyItAppears: 'Business ownership or equity indicated.',
    whyOftenExplored: 'Often explored when holding stock in qualifying C-corporations for potential gain exclusion.',
    evaluator: 'CPA/Attorney',
    description: 'QSBS may allow exclusion of substantial capital gains on qualifying small business stock sales.',
    whyForYou: 'Business equity may qualify for significant gain exclusion.',
    impact: 'high',
    category: 'business',
    triggerReason: 'Business ownership',
    primaryTriggers: { requiresBusinessOwnership: true },
  },
  {
    id: 'nqdc',
    title: 'Nonqualified Deferred Compensation',
    whatThisIs: 'Employer-sponsored plans allowing executives to defer income beyond qualified plan limits.',
    whyItAppears: 'Employed at level that may have NQDC options.',
    whyOftenExplored: 'Often explored for income deferral when expecting lower tax rates in retirement years.',
    evaluator: 'CPA/CFP',
    description: 'NQDC plans allow deferral of compensation to future years when tax rates may be lower.',
    whyForYou: 'Higher earners may have NQDC opportunities through their employer.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Employed with high income',
    primaryTriggers: { employmentStatus: ['employed'] },
  },
  {
    id: 'flp',
    title: 'Family Limited Partnership (FLP)',
    whatThisIs: 'An entity structure that may facilitate wealth transfer to family members while potentially reducing gift and estate tax exposure.',
    whyItAppears: 'High net worth with potential estate planning needs.',
    whyOftenExplored: 'Often explored for transferring family business or investment assets while maintaining control.',
    evaluator: 'Attorney',
    description: 'FLPs may facilitate intergenerational wealth transfer with potential valuation discounts.',
    whyForYou: 'Significant assets may benefit from family entity planning.',
    impact: 'medium',
    category: 'general',
    complexity: 'high',
    triggerReason: 'High net worth estate planning',
    primaryTriggers: { requiresFamilyWealthTransfer: true },
  },
  {
    id: 'primary-residence-exclusion',
    title: 'Primary Residence Exclusion',
    whatThisIs: 'Exclusion of up to $250,000 ($500,000 for married filing jointly) of gain on the sale of a primary residence.',
    whyItAppears: 'Most homeowners should be aware of this benefit.',
    whyOftenExplored: 'Often explored when selling a home to understand exclusion eligibility and maximization.',
    evaluator: 'CPA',
    description: 'The Section 121 exclusion may allow significant gain exclusion when selling your primary residence.',
    whyForYou: 'Understanding this exclusion is important for any home sale planning.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'General awareness for homeowners',
    primaryTriggers: { requiresSellingPrimaryResidence: true },
  },
  {
    id: 'depreciation-recapture',
    title: 'Depreciation Recapture Planning',
    whatThisIs: 'Tax treatment upon sale of depreciated property where accumulated depreciation is recaptured and taxed at up to 25%.',
    whyItAppears: 'Has or may have rental/investment real estate.',
    whyOftenExplored: 'Often explored when planning real estate sales to understand and potentially mitigate recapture exposure.',
    evaluator: 'CPA',
    description: 'When selling depreciated property, understanding recapture implications helps inform sale timing and exit strategy.',
    whyForYou: 'Real estate investors should understand depreciation recapture.',
    impact: 'medium',
    category: 'real-estate',
    triggerReason: 'Real estate holdings',
    primaryTriggers: { requiresRentalRealEstate: true },
  },
  {
    id: 'spousal-ira',
    title: 'Spousal IRA Contribution',
    whatThisIs: 'IRA contribution for a non-working spouse based on the working spouse\'s earned income.',
    whyItAppears: 'Married with one spouse potentially not working.',
    whyOftenExplored: 'Often explored to maximize household retirement contributions.',
    evaluator: 'CPA',
    description: 'A non-working spouse can contribute to an IRA based on the working spouse\'s income.',
    whyForYou: 'Married households can potentially double IRA contributions.',
    impact: 'medium',
    category: 'structure',
    triggerReason: 'Married household',
    primaryTriggers: { maritalStatus: ['Married', 'married'] },
  },
  {
    id: 'dynasty-trust',
    title: 'Dynasty Trust',
    whatThisIs: 'A long-term trust designed to pass wealth across multiple generations while minimizing transfer taxes at each generational level.',
    whyItAppears: 'Very high net worth with multi-generational planning goals.',
    whyOftenExplored: 'Often explored for significant wealth preservation across multiple generations.',
    evaluator: 'Attorney',
    description: 'Dynasty trusts may preserve family wealth across generations while minimizing estate taxes at each transfer.',
    whyForYou: 'Significant wealth may benefit from multi-generational planning structures.',
    impact: 'low',
    category: 'general',
    complexity: 'high',
    triggerReason: 'Very high net worth',
    primaryTriggers: { requiresMultiGenerationalPlanning: true },
  },
];

// ========================================
// SCORING-BASED MATCH FUNCTION
// ========================================
export function matchStrategies(profile: UserProfile): MatchedStrategy[] {
  const flags = computeTransitionFlags(profile);
  const netWorthScore = getNetWorthScore(profile);
  const retirementTier = profile.retirementRange;
  
  const scoredStrategies: Array<{ strategy: Strategy; score: number }> = [];
  
  for (const strategy of strategies) {
    let score = 0;
    
    // Base score from net worth tier relevance
    if (isTierRelevant(strategy.id, retirementTier)) {
      score += 30 + netWorthScore; // Base 30 + net worth bonus
    }
    
    // Trigger scoring (additive, not eliminative)
    const triggerScores = calculateTriggerScore(profile, strategy.primaryTriggers as Record<string, unknown>);
    score += triggerScores.ageMatch;
    score += triggerScores.employmentMatch;
    score += triggerScores.accountTypeMatch;
    score += triggerScores.situationalMatch;
    
    // Transition year bonus
    if (flags.isTransitionYear && strategy.transitionYearPriority) {
      score += strategy.transitionYearPriority / 5;
    }
    
    // Age-based suppression for certain strategies (hard gates only for truly inappropriate)
    const age = profile.age;
    if (strategy.id === 'qcd' && age < 70) continue; // QCD requires 70.5+
    if (strategy.id === 'rmd-minimization' && age < 55) continue; // Too early to be relevant
    
    // Complexity suppression for lower net worth
    if (strategy.complexity === 'high' && getRetirementTierIndex(retirementTier) < 2) {
      score -= 20; // Reduce but don't eliminate
    }
    
    scoredStrategies.push({ strategy, score });
  }
  
  // Filter by threshold and sort by score
  const matchedStrategies = scoredStrategies
    .filter(({ score }) => score >= SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_STRATEGIES)
    .map(({ strategy, score }) => ({
      ...strategy,
      computedImpact: computeImpact(profile, strategy, flags),
      computedUrgency: computeUrgency(profile, strategy, flags),
      priorityScore: score,
    }));
  
  // Apply guardrail: max 4 high-impact
  return applyHighImpactGuardrail(matchedStrategies);
}

function computeImpact(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'high' | 'medium' | 'low' {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  
  // Higher net worth = higher potential impact
  if (retirementIndex >= 4) return 'high';
  if (retirementIndex >= 2) {
    if (strategy.impact === 'high') return 'high';
    return 'medium';
  }
  if (strategy.impact === 'high') return 'medium';
  return 'low';
}

function computeUrgency(profile: UserProfile, strategy: Strategy, flags: TransitionYearFlags): 'worth-deeper-review' | 'worth-considering' | 'worth-noting' {
  if (flags.isTransitionYear && strategy.transitionYearPriority && strategy.transitionYearPriority > 70) {
    return 'worth-deeper-review';
  }
  
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  if (retirementIndex >= 3) return 'worth-deeper-review';
  if (retirementIndex >= 1) return 'worth-considering';
  return 'worth-noting';
}

function applyHighImpactGuardrail(strategies: MatchedStrategy[]): MatchedStrategy[] {
  let highCount = 0;
  return strategies.map(strategy => {
    if (strategy.computedImpact === 'high') {
      highCount++;
      if (highCount > 4) {
        return { ...strategy, computedImpact: 'medium' as const };
      }
    }
    return strategy;
  });
}
