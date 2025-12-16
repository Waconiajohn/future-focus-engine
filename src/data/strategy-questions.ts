/**
 * Strategy-specific questions for the Advisor Briefing Generator
 * Each strategy has 3-5 targeted follow-up questions
 */

export interface StrategyQuestion {
  id: string;
  label: string;
  type: 'range' | 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
  rangeMin?: number;
  rangeMax?: number;
  rangeStep?: number;
  rangeFormat?: 'currency' | 'percentage' | 'number';
}

export interface StrategyQuestionSet {
  strategyId: string;
  questions: StrategyQuestion[];
}

export const strategyQuestions: Record<string, StrategyQuestion[]> = {
  'roth-conversion': [
    {
      id: 'pretax-balance',
      label: 'What is your approximate traditional IRA/401(k) balance?',
      type: 'select',
      options: [
        { value: 'under-100k', label: 'Under $100,000' },
        { value: '100k-250k', label: '$100,000 - $250,000' },
        { value: '250k-500k', label: '$250,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: 'over-1m', label: 'Over $1,000,000' },
      ],
    },
    {
      id: 'income-comparison',
      label: 'How does your expected income this year compare to typical years?',
      type: 'select',
      options: [
        { value: 'much-lower', label: 'Much lower than usual' },
        { value: 'somewhat-lower', label: 'Somewhat lower than usual' },
        { value: 'similar', label: 'About the same' },
        { value: 'higher', label: 'Higher than usual' },
      ],
    },
    {
      id: 'large-income-events',
      label: 'Do you expect any large income events in the next 5 years?',
      type: 'checkbox',
    },
    {
      id: 'medicare-premiums',
      label: 'Are you currently paying Medicare premiums (IRMAA concern)?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not-yet', label: 'Not yet (under 65)' },
      ],
    },
  ],

  'backdoor-roth': [
    {
      id: 'existing-pretax-ira',
      label: 'Do you have an existing traditional IRA with pre-tax money?',
      type: 'select',
      options: [
        { value: 'none', label: 'No existing traditional IRA' },
        { value: 'small', label: 'Yes, but small balance (under $10,000)' },
        { value: 'significant', label: 'Yes, significant balance' },
      ],
    },
    {
      id: 'income-level',
      label: 'What is your approximate household income?',
      type: 'select',
      options: [
        { value: 'under-200k', label: 'Under $200,000' },
        { value: '200k-300k', label: '$200,000 - $300,000' },
        { value: '300k-500k', label: '$300,000 - $500,000' },
        { value: 'over-500k', label: 'Over $500,000' },
      ],
    },
    {
      id: 'done-before',
      label: 'Have you done a backdoor Roth conversion before?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, regularly' },
        { value: 'once', label: 'Yes, but only once' },
        { value: 'no', label: 'No, never' },
      ],
    },
  ],

  'mega-backdoor-roth': [
    {
      id: 'plan-allows',
      label: 'Does your employer 401(k) allow after-tax contributions?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: "I'm not sure" },
      ],
    },
    {
      id: 'current-contributions',
      label: 'Are you currently maxing out your 401(k) contributions?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, contributing the maximum' },
        { value: 'close', label: 'Close to maximum' },
        { value: 'no', label: 'No, below maximum' },
      ],
    },
    {
      id: 'additional-savings',
      label: 'How much additional savings capacity do you have annually?',
      type: 'select',
      options: [
        { value: 'under-10k', label: 'Under $10,000' },
        { value: '10k-25k', label: '$10,000 - $25,000' },
        { value: '25k-50k', label: '$25,000 - $50,000' },
        { value: 'over-50k', label: 'Over $50,000' },
      ],
    },
  ],

  'rmd-minimization': [
    {
      id: 'pretax-balance',
      label: 'What is your total pre-tax retirement account balance?',
      type: 'select',
      options: [
        { value: 'under-500k', label: 'Under $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: '1m-2m', label: '$1,000,000 - $2,000,000' },
        { value: 'over-2m', label: 'Over $2,000,000' },
      ],
    },
    {
      id: 'rmd-started',
      label: 'Have your Required Minimum Distributions started?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, already taking RMDs' },
        { value: 'soon', label: 'No, but within 5 years' },
        { value: 'later', label: 'No, more than 5 years away' },
      ],
    },
    {
      id: 'need-income',
      label: 'Do you need the RMD income for living expenses?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, I need all of it' },
        { value: 'partial', label: 'I need some of it' },
        { value: 'no', label: "No, I don't need it" },
      ],
    },
  ],

  'qcd': [
    {
      id: 'annual-giving',
      label: 'What is your typical annual charitable giving amount?',
      type: 'select',
      options: [
        { value: 'under-1k', label: 'Under $1,000' },
        { value: '1k-5k', label: '$1,000 - $5,000' },
        { value: '5k-15k', label: '$5,000 - $15,000' },
        { value: '15k-50k', label: '$15,000 - $50,000' },
        { value: 'over-50k', label: 'Over $50,000' },
      ],
    },
    {
      id: 'taking-rmds',
      label: 'Are you currently taking RMDs from your IRA?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no-eligible', label: 'No, but I am over 70½' },
        { value: 'no-not-eligible', label: 'No, I am under 70½' },
      ],
    },
    {
      id: 'deduction-type',
      label: 'Do you currently itemize deductions or take the standard deduction?',
      type: 'select',
      options: [
        { value: 'itemize', label: 'Itemize' },
        { value: 'standard', label: 'Standard deduction' },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
  ],

  '1031-exchange': [
    {
      id: 'property-value',
      label: 'What is the approximate value of the property you might sell?',
      type: 'select',
      options: [
        { value: 'under-250k', label: 'Under $250,000' },
        { value: '250k-500k', label: '$250,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: '1m-2m', label: '$1,000,000 - $2,000,000' },
        { value: 'over-2m', label: 'Over $2,000,000' },
      ],
    },
    {
      id: 'cost-basis',
      label: 'What is your estimated cost basis (original purchase price + improvements)?',
      type: 'select',
      options: [
        { value: 'under-100k', label: 'Under $100,000' },
        { value: '100k-250k', label: '$100,000 - $250,000' },
        { value: '250k-500k', label: '$250,000 - $500,000' },
        { value: 'over-500k', label: 'Over $500,000' },
        { value: 'unsure', label: "I'm not sure" },
      ],
    },
    {
      id: 'sale-timeline',
      label: 'When are you thinking of selling?',
      type: 'select',
      options: [
        { value: '0-6-months', label: 'Within 6 months' },
        { value: '6-12-months', label: '6-12 months' },
        { value: '1-2-years', label: '1-2 years' },
        { value: 'exploring', label: 'Just exploring options' },
      ],
    },
    {
      id: 'replacement-property',
      label: 'Do you have a replacement property in mind?',
      type: 'select',
      options: [
        { value: 'yes-identified', label: 'Yes, already identified' },
        { value: 'looking', label: 'Actively looking' },
        { value: 'no', label: 'Not yet' },
      ],
    },
  ],

  'daf': [
    {
      id: 'giving-amount',
      label: 'How much do you typically give to charity annually?',
      type: 'select',
      options: [
        { value: 'under-5k', label: 'Under $5,000' },
        { value: '5k-15k', label: '$5,000 - $15,000' },
        { value: '15k-50k', label: '$15,000 - $50,000' },
        { value: 'over-50k', label: 'Over $50,000' },
      ],
    },
    {
      id: 'appreciated-assets',
      label: 'Do you have appreciated stocks or other assets you could donate?',
      type: 'select',
      options: [
        { value: 'yes-significant', label: 'Yes, with significant gains' },
        { value: 'yes-some', label: 'Yes, with some gains' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      id: 'high-income-year',
      label: 'Is this a higher-than-normal income year for you?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, significantly higher' },
        { value: 'somewhat', label: 'Somewhat higher' },
        { value: 'normal', label: 'About normal' },
        { value: 'lower', label: 'Lower than normal' },
      ],
    },
  ],

  'tax-loss-harvesting': [
    {
      id: 'taxable-account-size',
      label: 'What is the approximate size of your taxable brokerage accounts?',
      type: 'select',
      options: [
        { value: 'under-100k', label: 'Under $100,000' },
        { value: '100k-500k', label: '$100,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: 'over-1m', label: 'Over $1,000,000' },
      ],
    },
    {
      id: 'recent-gains',
      label: 'Have you realized capital gains this year?',
      type: 'select',
      options: [
        { value: 'significant', label: 'Yes, significant gains' },
        { value: 'some', label: 'Yes, some gains' },
        { value: 'no', label: 'No gains this year' },
      ],
    },
    {
      id: 'current-losses',
      label: 'Do you have positions currently showing losses?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: "I'm not sure" },
      ],
    },
  ],

  'hsa': [
    {
      id: 'hdhp-enrolled',
      label: 'Are you enrolled in a High Deductible Health Plan (HDHP)?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes, currently enrolled' },
        { value: 'no-eligible', label: 'No, but I could enroll' },
        { value: 'no-not-eligible', label: 'No, not eligible' },
        { value: 'unsure', label: "I'm not sure" },
      ],
    },
    {
      id: 'current-hsa-balance',
      label: 'What is your current HSA balance (if any)?',
      type: 'select',
      options: [
        { value: 'none', label: 'No HSA' },
        { value: 'under-5k', label: 'Under $5,000' },
        { value: '5k-25k', label: '$5,000 - $25,000' },
        { value: 'over-25k', label: 'Over $25,000' },
      ],
    },
    {
      id: 'medical-expenses',
      label: 'How would you describe your annual medical expenses?',
      type: 'select',
      options: [
        { value: 'minimal', label: 'Minimal (generally healthy)' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'significant', label: 'Significant' },
      ],
    },
  ],

  'qsbs': [
    {
      id: 'business-type',
      label: 'What type of business entity do you have ownership in?',
      type: 'select',
      options: [
        { value: 'c-corp', label: 'C Corporation' },
        { value: 's-corp', label: 'S Corporation' },
        { value: 'llc', label: 'LLC' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'unsure', label: "I'm not sure" },
      ],
    },
    {
      id: 'holding-period',
      label: 'How long have you held the stock?',
      type: 'select',
      options: [
        { value: 'under-1-year', label: 'Less than 1 year' },
        { value: '1-5-years', label: '1-5 years' },
        { value: 'over-5-years', label: 'More than 5 years' },
      ],
    },
    {
      id: 'potential-gain',
      label: 'What is the estimated gain on your business stock?',
      type: 'select',
      options: [
        { value: 'under-100k', label: 'Under $100,000' },
        { value: '100k-500k', label: '$100,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: 'over-1m', label: 'Over $1,000,000' },
      ],
    },
  ],

  // Default questions for strategies without specific questions
  'default': [
    {
      id: 'current-situation',
      label: 'Briefly describe your current situation related to this strategy:',
      type: 'text',
      placeholder: 'e.g., I have a rental property I might sell...',
    },
    {
      id: 'timeline',
      label: 'What is your expected timeline for implementing this strategy?',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Immediately (within 3 months)' },
        { value: 'soon', label: 'Soon (3-12 months)' },
        { value: 'later', label: 'Later (1-2 years)' },
        { value: 'exploring', label: 'Just exploring' },
      ],
    },
    {
      id: 'concerns',
      label: 'What questions or concerns do you have about this strategy?',
      type: 'text',
      placeholder: 'Enter any specific questions...',
    },
  ],
};

export function getQuestionsForStrategy(strategyId: string): StrategyQuestion[] {
  return strategyQuestions[strategyId] || strategyQuestions['default'];
}
