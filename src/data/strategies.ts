import { Strategy, UserProfile, TransitionYearFlags, computeTransitionFlags } from '@/types/persona';

export const strategies: Strategy[] = [
  // ========================================
  // TIMING-BASED STRATEGIES (High priority during transition years)
  // ========================================
  {
    id: 'lower-income-planning',
    title: 'Lower-Income Year Planning Window',
    description: 'When income drops temporarily — whether from job transition, sabbatical, or early retirement — a unique planning window opens. Actions taken during these periods can have lasting benefits that extend well beyond the transition.',
    whyForYou: 'Your current income situation creates a window that may not be available in future years.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 100, // Highest priority
    requiredConditions: {
      requiresTransitionYear: true
    }
  },
  {
    id: 'roth-conversion-window',
    title: 'Roth Conversion Opportunity',
    description: 'Converting pre-tax retirement funds to Roth accounts during lower-income periods means paying taxes now at potentially reduced rates. Future growth becomes tax-free, and you avoid Required Minimum Distributions on converted amounts.',
    whyForYou: 'Lower current income may mean lower tax rates on conversions than you\'ll face later.',
    impact: 'high',
    category: 'timing',
    transitionYearPriority: 90,
    requiredConditions: {
      minAge: 45,
      retirementRanges: ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'bracket-management',
    title: 'Tax Bracket Management',
    description: 'Understanding your marginal tax bracket helps optimize when to recognize income, make conversions, or take deductions. During transition years, you may have more control over which bracket you land in.',
    whyForYou: 'Variable income years offer more flexibility to manage bracket thresholds.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 70,
    requiredConditions: {
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
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
    requiredConditions: {
      requiresLowerIncome: true,
      retirementRanges: ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },

  // ========================================
  // STRUCTURE-BASED STRATEGIES
  // ========================================
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    description: 'Where you hold different investments matters. Placing tax-inefficient assets in tax-advantaged accounts and tax-efficient assets in taxable accounts can improve after-tax returns over time.',
    whyForYou: 'With multiple account types, strategic placement can compound benefits.',
    impact: 'medium',
    category: 'structure',
    requiredConditions: {
      retirementRanges: ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'hsa-optimization',
    title: 'HSA Optimization',
    description: 'Health Savings Accounts offer triple tax advantages: deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses. They can serve as a powerful supplemental retirement account.',
    whyForYou: 'If you have HSA access, maximizing contributions builds a tax-efficient health reserve.',
    impact: 'medium',
    category: 'structure',
    suppressDuringUnemployment: false, // Still relevant for planning
    requiredConditions: {
      maxAge: 65,
      employmentStatus: ['employed', 'unemployed'] // May still have COBRA/marketplace HSA-eligible plan
    }
  },
  {
    id: 'spousal-ira',
    title: 'Spousal IRA Contributions',
    description: 'Even when one spouse isn\'t working, the working spouse can contribute to an IRA on behalf of the non-working spouse. This keeps both partners building retirement assets.',
    whyForYou: 'Your household situation allows for continued retirement contributions for both spouses.',
    impact: 'medium',
    category: 'structure',
    requiredConditions: {
      maritalStatus: ['married'],
      maxAge: 73
    }
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes. Losses can also offset up to $3,000 of ordinary income, with excess carrying forward.',
    whyForYou: 'With taxable investments, this ongoing strategy can improve after-tax returns.',
    impact: 'medium',
    category: 'structure',
    requiredConditions: {
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },

  // ========================================
  // WITHDRAWAL & RMD STRATEGIES
  // ========================================
  {
    id: 'rmd-minimization',
    title: 'RMD Minimization Strategies',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead — especially during lower-income years — can reduce the size of these forced withdrawals and their tax impact.',
    whyForYou: 'With your balance levels, proactive planning could meaningfully reduce future RMDs.',
    impact: 'high',
    category: 'withdrawal',
    transitionYearPriority: 85,
    requiredConditions: {
      minAge: 50,
      retirementRanges: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'asset-sequencing',
    title: 'Withdrawal Sequencing',
    description: 'The order in which you draw from different account types (taxable, tax-deferred, tax-free) significantly affects lifetime taxes. Planning the sequence before retirement begins offers more flexibility.',
    whyForYou: 'Understanding sequencing now helps position assets for efficient withdrawals later.',
    impact: 'medium',
    category: 'withdrawal',
    requiredConditions: {
      minAge: 55,
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'qcd-education',
    title: 'Qualified Charitable Distributions',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but aren\'t included in taxable income — a powerful combination for charitable givers.',
    whyForYou: 'If charitable giving is part of your plans, this approach offers significant tax efficiency.',
    impact: 'medium',
    category: 'giving',
    requiredConditions: {
      minAge: 70,
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'qlac-awareness',
    title: 'Longevity Annuity Awareness',
    description: 'Qualified Longevity Annuity Contracts (QLACs) allow you to defer a portion of RMDs until age 85, reducing required withdrawals in earlier years while providing guaranteed income later.',
    whyForYou: 'For larger balances, QLACs can be one tool in managing RMD exposure.',
    impact: 'low',
    category: 'withdrawal',
    requiredConditions: {
      minAge: 65,
      retirementRanges: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },

  // ========================================
  // CHARITABLE & GIVING STRATEGIES
  // ========================================
  {
    id: 'charitable-bunching',
    title: 'Charitable Bunching Strategy',
    description: 'Concentrating multiple years of charitable giving into one year can help exceed the standard deduction threshold, maximizing tax benefits. A donor-advised fund can facilitate this approach.',
    whyForYou: 'Timing charitable contributions strategically can amplify their tax benefit.',
    impact: 'medium',
    category: 'giving',
    requiredConditions: {
      retirementRanges: ['1m-2.5m', '2.5m-5m', '>5m'],
      realEstateRanges: ['750k-2m', '>2m']
    }
  },

  // ========================================
  // REAL ESTATE RELATED
  // ========================================
  {
    id: 'real-estate-awareness',
    title: 'Real Estate Tax Considerations',
    description: 'Real estate equity creates both opportunities and complexity. Understanding how property fits into your overall tax picture — including potential exclusions, basis step-up, and timing — is valuable.',
    whyForYou: 'Your real estate holdings add an important dimension to your planning.',
    impact: 'medium',
    category: 'general',
    requiredConditions: {
      realEstateRanges: ['750k-2m', '>2m']
    }
  },

  // ========================================
  // HEALTHCARE & CREDITS (Transition Year Specific)
  // ========================================
  {
    id: 'healthcare-subsidy-awareness',
    title: 'Healthcare Subsidy Considerations',
    description: 'If you\'re purchasing health insurance through the marketplace, your income level affects premium subsidies. Understanding the income thresholds can help you make informed decisions about conversions and other income recognition.',
    whyForYou: 'During income transitions, healthcare subsidies become an important factor to consider.',
    impact: 'medium',
    category: 'timing',
    transitionYearPriority: 80,
    requiredConditions: {
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
    requiredConditions: {
      minAge: 62
    }
  }
];

export function matchStrategies(profile: UserProfile): Strategy[] {
  const flags = computeTransitionFlags(profile);
  const age = profile.age;
  
  let matchedStrategies = strategies.filter(strategy => {
    const conditions = strategy.requiredConditions;
    
    // Suppress during unemployment if flagged
    if (strategy.suppressDuringUnemployment && flags.anyoneUnemployed) {
      return false;
    }
    
    // Age checks
    if (conditions.minAge && age < conditions.minAge) return false;
    if (conditions.maxAge && age > conditions.maxAge) return false;
    
    // Marital status check
    if (conditions.maritalStatus && !conditions.maritalStatus.includes(profile.maritalStatus)) {
      return false;
    }
    
    // Retirement range check
    if (conditions.retirementRanges && !conditions.retirementRanges.includes(profile.retirementRange)) {
      return false;
    }
    
    // Real estate range check
    if (conditions.realEstateRanges && !conditions.realEstateRanges.includes(profile.realEstateRange)) {
      return false;
    }
    
    // Employment status check
    if (conditions.employmentStatus) {
      if (!conditions.employmentStatus.includes(profile.employmentStatus)) {
        return false;
      }
    }
    
    // Transition year requirement
    if (conditions.requiresTransitionYear && !flags.isTransitionYear) {
      return false;
    }
    
    // Lower income requirement
    if (conditions.requiresLowerIncome && !flags.incomeLowerThanTypical) {
      return false;
    }
    
    return true;
  });

  // Sort strategies based on transition year priority and impact
  matchedStrategies.sort((a, b) => {
    // If in transition year, prioritize transition-year strategies
    if (flags.isTransitionYear) {
      const aPriority = a.transitionYearPriority || 0;
      const bPriority = b.transitionYearPriority || 0;
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
    }
    
    // Then sort by impact
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return matchedStrategies;
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
