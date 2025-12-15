import { Strategy, UserProfile, TransitionYearFlags, computeTransitionFlags, RetirementRange, RealEstateRange } from '@/types/persona';

// Helper to check if user has meaningful pre-tax retirement accounts
function hasPreTaxRetirement(profile: UserProfile): boolean {
  return profile.retirementRange !== '<250k';
}

// Helper to check charitable intent
function hasCharitableIntent(profile: UserProfile): boolean {
  return profile.charitableGiving !== undefined && profile.charitableGiving !== 'none';
}

// Helper to calculate priority boost from retirement tier
function getRetirementPriorityBoost(profile: UserProfile, priorityTiers?: RetirementRange[]): number {
  if (!priorityTiers) return 0;
  if (priorityTiers.includes(profile.retirementRange)) {
    // Higher tiers get more boost
    const tierOrder: RetirementRange[] = ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'];
    const tierIndex = tierOrder.indexOf(profile.retirementRange);
    return tierIndex * 5; // 0, 5, 10, 15, 20, 25
  }
  return 0;
}

// Helper to calculate priority boost from real estate tier
function getRealEstatePriorityBoost(profile: UserProfile, priorityTiers?: RealEstateRange[]): number {
  if (!priorityTiers) return 0;
  if (priorityTiers.includes(profile.realEstateRange)) {
    const tierOrder: RealEstateRange[] = ['none', '<250k', '250k-750k', '750k-2m', '>2m'];
    const tierIndex = tierOrder.indexOf(profile.realEstateRange);
    return tierIndex * 5;
  }
  return 0;
}

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
    primaryTriggers: {
      minAge: 45,
      requiresPreTaxRetirement: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      priorityAgeRange: { min: 55, max: 72 }
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
    primaryTriggers: {
      requiresEmployerStock: true
    },
    priorityModifiers: {
      higherPriorityRetirementTiers: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      basePriorityBoost: 15
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
    primaryTriggers: {
      minAge: 65,
      requiresPreTaxRetirement: true
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
    primaryTriggers: {
      requiresCharitableIntent: true
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
    primaryTriggers: {
      requiresRentalRealEstate: true
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
    primaryTriggers: {
      requiresRentalRealEstate: true
    },
    priorityModifiers: {
      higherPriorityRealEstateTiers: ['750k-2m', '>2m']
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
    primaryTriggers: {
      // This appears for everyone as general education - it's relatively new legislation
    }
  }
];

export function matchStrategies(profile: UserProfile): Strategy[] {
  const flags = computeTransitionFlags(profile);
  const age = profile.age;
  
  let matchedStrategies = strategies.filter(strategy => {
    const triggers = strategy.primaryTriggers;
    
    // Suppress during unemployment if flagged
    if (strategy.suppressDuringUnemployment && flags.anyoneUnemployed) {
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
    
    return true;
  });

  // ========================================
  // CALCULATE PRIORITY SCORES & SORT
  // ========================================
  const scoredStrategies = matchedStrategies.map(strategy => {
    let priorityScore = 0;
    const modifiers = strategy.priorityModifiers;
    
    // Base priority from transition year
    if (flags.isTransitionYear && strategy.transitionYearPriority) {
      priorityScore += strategy.transitionYearPriority;
    }
    
    // Impact-based score
    const impactScore = { high: 30, medium: 20, low: 10 };
    priorityScore += impactScore[strategy.impact];
    
    if (modifiers) {
      // Retirement tier boost
      priorityScore += getRetirementPriorityBoost(profile, modifiers.higherPriorityRetirementTiers);
      
      // Real estate tier boost
      priorityScore += getRealEstatePriorityBoost(profile, modifiers.higherPriorityRealEstateTiers);
      
      // Age range boost
      if (modifiers.priorityAgeRange) {
        if (age >= modifiers.priorityAgeRange.min && age <= modifiers.priorityAgeRange.max) {
          priorityScore += 15;
        }
      }
      
      // Base boost
      if (modifiers.basePriorityBoost) {
        priorityScore += modifiers.basePriorityBoost;
      }
    }
    
    return { strategy, priorityScore };
  });

  // Sort by priority score (highest first)
  scoredStrategies.sort((a, b) => b.priorityScore - a.priorityScore);

  return scoredStrategies.map(s => s.strategy);
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
