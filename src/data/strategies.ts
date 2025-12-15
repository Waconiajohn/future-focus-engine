import { Strategy, UserProfile } from '@/types/persona';
import { getAgeBand } from './stories';

export const strategies: Strategy[] = [
  {
    id: 'roth-conversion',
    title: 'Roth Conversion Opportunity',
    description: 'Converting pre-tax retirement funds to Roth accounts during lower-income years can reduce future tax burden. Taxes are paid now at potentially lower rates, and future growth becomes tax-free.',
    whyForYou: 'Your current income situation may create a window where conversion makes sense.',
    impact: 'high',
    requiredConditions: {
      minAge: 45,
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      employmentStatus: ['unemployed', 'retired']
    }
  },
  {
    id: 'asset-location',
    title: 'Asset Location Review',
    description: 'Where you hold different investments matters. Placing tax-inefficient assets in tax-advantaged accounts and tax-efficient assets in taxable accounts can improve after-tax returns.',
    whyForYou: 'With multiple account types, strategic placement can compound benefits over time.',
    impact: 'medium',
    requiredConditions: {
      retirementRanges: ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'lower-income-planning',
    title: 'Lower-Income Year Planning',
    description: 'Career transitions or temporary income drops create unique planning windows. Actions taken during these periods can have lasting benefits.',
    whyForYou: 'Income changes can create rare planning windows worth examining.',
    impact: 'high',
    requiredConditions: {
      employmentStatus: ['unemployed']
    }
  },
  {
    id: 'rmd-minimization',
    title: 'RMD Minimization Strategies',
    description: 'Required Minimum Distributions begin at age 73. Planning ahead can reduce the size of these forced withdrawals and their tax impact.',
    whyForYou: 'With your balance levels, proactive planning could meaningfully reduce future RMDs.',
    impact: 'high',
    requiredConditions: {
      minAge: 55,
      retirementRanges: ['1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'qcd-education',
    title: 'Qualified Charitable Distributions',
    description: 'After age 70½, you can donate directly from your IRA to charity. These donations count toward RMDs but aren\'t included in taxable income.',
    whyForYou: 'If charitable giving is part of your plans, this approach offers tax efficiency.',
    impact: 'medium',
    requiredConditions: {
      minAge: 70,
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
      requiresCharitable: true
    }
  },
  {
    id: 'hsa-optimization',
    title: 'HSA Optimization',
    description: 'Health Savings Accounts offer triple tax advantages: deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.',
    whyForYou: 'Maximizing HSA contributions during working years builds a tax-efficient health reserve.',
    impact: 'medium',
    requiredConditions: {
      maxAge: 65,
      employmentStatus: ['employed', 'unemployed']
    }
  },
  {
    id: 'charitable-bunching',
    title: 'Charitable Bunching Strategy',
    description: 'Concentrating multiple years of charitable giving into one year can help exceed the standard deduction threshold, maximizing tax benefits.',
    whyForYou: 'Timing charitable contributions strategically amplifies their tax benefit.',
    impact: 'medium',
    requiredConditions: {
      retirementRanges: ['1m-2.5m', '2.5m-5m', '>5m'],
      realEstateRanges: ['750k-2m', '>2m']
    }
  },
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting',
    description: 'Selling investments at a loss to offset gains can reduce current-year taxes. Losses can also offset up to $3,000 of ordinary income.',
    whyForYou: 'With taxable investments, this ongoing strategy can improve after-tax returns.',
    impact: 'medium',
    requiredConditions: {
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'bracket-management',
    title: 'Tax Bracket Management',
    description: 'Understanding your marginal tax bracket helps optimize decisions about income recognition, conversions, and deductions.',
    whyForYou: 'Staying aware of bracket thresholds enables more informed timing decisions.',
    impact: 'medium',
    requiredConditions: {
      retirementRanges: ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m']
    }
  },
  {
    id: 'real-estate-awareness',
    title: 'Real Estate Tax Planning',
    description: 'Real estate equity creates both opportunities and complexity. Understanding how property fits into your overall tax picture is valuable.',
    whyForYou: 'Your real estate holdings add an important dimension to consider.',
    impact: 'medium',
    requiredConditions: {
      realEstateRanges: ['750k-2m', '>2m']
    }
  }
];

export function matchStrategies(profile: UserProfile): Strategy[] {
  const age = profile.age;
  
  return strategies.filter(strategy => {
    const conditions = strategy.requiredConditions;
    
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
    if (conditions.employmentStatus && profile.employmentStatus) {
      if (!conditions.employmentStatus.includes(profile.employmentStatus)) {
        return false;
      }
    }
    
    return true;
  });
}
