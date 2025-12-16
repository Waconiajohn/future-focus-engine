/**
 * Strategy-specific advisor questions and document checklists
 * for the Advisor Briefing Generator
 */

export interface AdvisorInfo {
  questionsForAdvisor: string[];
  documentsToGather: string[];
  deadlines?: string[];
  professionalType: string;
}

export const strategyAdvisorInfo: Record<string, AdvisorInfo> = {
  'roth-conversion': {
    questionsForAdvisor: [
      'What is the optimal annual conversion amount given my tax bracket?',
      'How will conversions affect my Medicare premiums (IRMAA)?',
      'Should I convert all at once or spread across multiple years?',
      'What are the state tax implications of Roth conversions?',
      'How does this strategy interact with my Social Security benefits?',
    ],
    documentsToGather: [
      'Most recent federal and state tax returns (2-3 years)',
      'IRA and 401(k) account statements',
      'Social Security statement',
      'Current year income estimates',
      'Pension or annuity income documentation',
    ],
    deadlines: [
      'Roth conversions must be completed by December 31st of the tax year',
      'No deadline for traditional IRA contributions for prior year until tax filing deadline',
    ],
    professionalType: 'CPA or CFP',
  },

  'backdoor-roth': {
    questionsForAdvisor: [
      'Do I have any existing pre-tax IRA balances that would trigger the pro-rata rule?',
      'What is the proper sequence of steps to execute this correctly?',
      'How do I report this on my tax return (Form 8606)?',
      'Should I wait for the contribution to "settle" before converting?',
    ],
    documentsToGather: [
      'All IRA account statements',
      'Prior year Form 8606 (if applicable)',
      'Current year income documentation',
      'Most recent tax return',
    ],
    deadlines: [
      'IRA contribution deadline: April 15th (or tax filing deadline)',
      'Conversion can be done anytime after contribution',
    ],
    professionalType: 'CPA',
  },

  'mega-backdoor-roth': {
    questionsForAdvisor: [
      'Does my employer plan allow after-tax contributions?',
      'Can I do in-plan Roth conversions or in-service distributions?',
      'What is my plan\'s total contribution limit?',
      'How often can I convert the after-tax contributions?',
    ],
    documentsToGather: [
      '401(k) Summary Plan Description (SPD)',
      'Current 401(k) contribution elections',
      'Year-to-date 401(k) statement',
      'HR benefits contact information',
    ],
    deadlines: [
      'Contributions must be made during the plan year',
      'Check plan rules for conversion frequency limits',
    ],
    professionalType: 'CPA or CFP',
  },

  'rmd-minimization': {
    questionsForAdvisor: [
      'What is my projected RMD amount over the next 10 years?',
      'Should I accelerate Roth conversions before RMDs begin?',
      'How will RMDs affect my Social Security taxation?',
      'What strategies can reduce my RMD base?',
    ],
    documentsToGather: [
      'All retirement account statements (IRA, 401(k), 403(b))',
      'Social Security benefit statement',
      'Pension documentation',
      'Most recent tax returns',
    ],
    deadlines: [
      'RMDs must be taken by December 31st each year',
      'First RMD deadline: April 1st of the year after turning 73',
    ],
    professionalType: 'CPA or CFP',
  },

  'qcd': {
    questionsForAdvisor: [
      'What is the maximum QCD amount I can give this year ($105,000 for 2024)?',
      'How do I coordinate QCDs with my RMD requirements?',
      'Which charities qualify for QCDs?',
      'Should I use QCD instead of other giving methods?',
    ],
    documentsToGather: [
      'IRA statements',
      'List of intended charitable recipients with EINs',
      'Prior year charitable giving records',
      'RMD calculation from IRA custodian',
    ],
    deadlines: [
      'QCDs count toward RMD if done by December 31st',
      'Must be age 70½ or older at time of distribution',
    ],
    professionalType: 'CPA',
  },

  '1031-exchange': {
    questionsForAdvisor: [
      'What properties qualify as "like-kind" for my exchange?',
      'How do I handle boot (cash or non-like-kind property)?',
      'What is my depreciation recapture exposure?',
      'Should I consider a Delaware Statutory Trust (DST)?',
    ],
    documentsToGather: [
      'Current property purchase documents and HUD-1',
      'Depreciation schedules',
      'Capital improvement receipts',
      'Current property appraisal',
      'Mortgage payoff amount',
    ],
    deadlines: [
      '45 days: Identify replacement property(ies)',
      '180 days: Close on replacement property',
      'Deadlines are strict and cannot be extended',
    ],
    professionalType: 'CPA and Real Estate Attorney',
  },

  'daf': {
    questionsForAdvisor: [
      'What assets are best to contribute to a DAF?',
      'How much can I deduct this year?',
      'Which DAF provider is best for my situation?',
      'Should I bunch multiple years of giving?',
    ],
    documentsToGather: [
      'Investment account statements with cost basis',
      'Charitable giving history',
      'Current year income estimates',
      'Most recent tax return',
    ],
    deadlines: [
      'Contributions must be completed by December 31st for current year deduction',
      'Grants from DAF can be made anytime',
    ],
    professionalType: 'CPA or CFP',
  },

  'tax-loss-harvesting': {
    questionsForAdvisor: [
      'Which positions should I harvest losses from?',
      'How do I avoid wash sale violations?',
      'What replacement securities should I use?',
      'Should I harvest losses in December or throughout the year?',
    ],
    documentsToGather: [
      'Brokerage statements with cost basis',
      'Year-to-date realized gains/losses',
      'All investment account holdings (including spouse)',
    ],
    deadlines: [
      'Must execute trades by December 31st for current year benefit',
      '30-day wash sale rule applies before and after sale',
    ],
    professionalType: 'CPA or CFP',
  },

  'hsa': {
    questionsForAdvisor: [
      'Am I eligible for HSA contributions?',
      'What is my maximum contribution amount?',
      'Should I invest my HSA or use it for current expenses?',
      'How do I maximize the triple tax benefit?',
    ],
    documentsToGather: [
      'Health insurance plan documents (HDHP verification)',
      'Current HSA account statements',
      'Medical expense receipts',
    ],
    deadlines: [
      'Contribution deadline: April 15th (tax filing deadline)',
      'Must be enrolled in HDHP on the 1st of the month to contribute',
    ],
    professionalType: 'CPA or CFP',
  },

  'qsbs': {
    questionsForAdvisor: [
      'Does my stock qualify as QSBS?',
      'Have I met the 5-year holding period requirement?',
      'What is my maximum excludable gain?',
      'Should I consider a QSBS rollover (Section 1045)?',
    ],
    documentsToGather: [
      'Stock certificates or transfer documents',
      'Company formation documents (articles of incorporation)',
      'Documentation of original investment date and amount',
      'Company gross assets test documentation',
    ],
    deadlines: [
      'Must hold stock for 5+ years for full exclusion',
      '60-day rollover window for Section 1045 deferral',
    ],
    professionalType: 'CPA and Business Attorney',
  },

  // Default for strategies without specific info
  'default': {
    questionsForAdvisor: [
      'What are the specific requirements for this strategy?',
      'What are the potential risks or downsides?',
      'How does this fit with my overall financial plan?',
      'What is the implementation process?',
    ],
    documentsToGather: [
      'Most recent tax returns (2-3 years)',
      'Relevant account statements',
      'Current income documentation',
    ],
    professionalType: 'CPA or CFP',
  },
};

export function getAdvisorInfoForStrategy(strategyId: string): AdvisorInfo {
  return strategyAdvisorInfo[strategyId] || strategyAdvisorInfo['default'];
}
