/**
 * Strategy Rules - JSON-style declarative rule definitions
 * This file provides a structured, machine-readable format for all 26 strategies
 */

export interface StrategyCondition {
  field: string;
  op: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'notIn' | 'exists' | 'notExists' | 'contains';
  value: unknown;
}

export interface ImpactRule {
  label: 'High' | 'Medium' | 'Low';
  allOf: StrategyCondition[];
}

export interface StrategyRule {
  id: string;
  name: string;
  eligibility: {
    allOf?: StrategyCondition[];
    anyOf?: StrategyCondition[];
  };
  suppression?: {
    anyOf?: StrategyCondition[];
  };
  impactRules: ImpactRule[];
  cardCopy: {
    whatThisIs: string;
    whyItAppearsTemplate: string;
    whyOftenExplored: string;
    whoReviews: ('CPA' | 'CFP' | 'Attorney')[];
    notes: string[];
  };
}

export interface GlobalRules {
  maxHighImpactStrategies: number;
  suppressSavingsEstimatesIfLowConfidence: boolean;
  alwaysIncludeDisclaimerFooter: boolean;
  netWorthOnlyAffectsImpactNotEligibility: boolean;
}

export const globalRules: GlobalRules = {
  maxHighImpactStrategies: 3,
  suppressSavingsEstimatesIfLowConfidence: true,
  alwaysIncludeDisclaimerFooter: true,
  netWorthOnlyAffectsImpactNotEligibility: true
};

export const strategyRules: StrategyRule[] = [
  {
    id: 'roth-conversion',
    name: 'Roth IRA Conversion',
    eligibility: {
      allOf: [
        { field: 'age', op: '<', value: 73 },
        { field: 'hasPreTaxRetirement', op: '==', value: true }
      ],
      anyOf: [
        { field: 'employmentStatus', op: '==', value: 'unemployed' },
        { field: 'incomeVolatility', op: '==', value: true },
        { field: 'expectedFutureTaxRatesHigher', op: '==', value: true }
      ]
    },
    impactRules: [
      { label: 'High', allOf: [{ field: 'retirementRange', op: 'in', value: ['1m-2.5m', '2.5m-5m', '>5m'] }, { field: 'incomeVolatility', op: '==', value: true }] },
      { label: 'Medium', allOf: [{ field: 'retirementRange', op: 'in', value: ['250k-500k', '500k-1m'] }] },
      { label: 'Low', allOf: [{ field: 'retirementRange', op: '==', value: '<250k' }] }
    ],
    cardCopy: {
      whatThisIs: 'The transfer of pre-tax retirement account funds to a Roth IRA, triggering current-year taxable income in exchange for future tax-free growth.',
      whyItAppearsTemplate: 'You have {{retirementRange}} in pre-tax accounts and are under age 73 with favorable income conditions.',
      whyOftenExplored: 'Often explored when current-year income is lower than expected future income, potentially allowing conversion at reduced tax rates.',
      whoReviews: ['CPA', 'CFP'],
      notes: ['Educational only', 'Outcomes depend on full tax return', 'Requires professional review']
    }
  },
  {
    id: 'backdoor-roth',
    name: 'Backdoor Roth IRA',
    eligibility: {
      allOf: [
        { field: 'age', op: '<', value: 70 },
        { field: 'incomeAboveRothLimits', op: '==', value: true },
        { field: 'hasLargePreTaxIRA', op: '==', value: false }
      ]
    },
    impactRules: [
      { label: 'Medium', allOf: [{ field: 'incomeAboveRothLimits', op: '==', value: true }] },
      { label: 'Low', allOf: [] }
    ],
    cardCopy: {
      whatThisIs: 'A two-step process where a non-deductible traditional IRA contribution is converted to Roth, allowing high earners to fund Roth accounts indirectly.',
      whyItAppearsTemplate: 'Your income exceeds Roth limits and you indicated no large existing pre-tax IRA balance.',
      whyOftenExplored: 'Often explored when income exceeds direct Roth contribution thresholds but the pro-rata rule would not create significant tax complications.',
      whoReviews: ['CPA'],
      notes: ['Educational only', 'Pro-rata rule applies if you have pre-tax IRA balances', 'Requires professional review']
    }
  },
  {
    id: 'mega-backdoor-roth',
    name: 'Mega Backdoor Roth',
    eligibility: {
      allOf: [
        { field: 'employmentStatus', op: '==', value: 'employed' },
        { field: 'employer401kAllowsAfterTax', op: '==', value: true },
        { field: 'max401kContributions', op: '==', value: true }
      ]
    },
    impactRules: [
      { label: 'High', allOf: [{ field: 'retirementRange', op: 'in', value: ['1m-2.5m', '2.5m-5m', '>5m'] }] },
      { label: 'Medium', allOf: [] }
    ],
    cardCopy: {
      whatThisIs: 'An employer plan feature allowing after-tax 401(k) contributions beyond standard limits, which can then be converted to Roth.',
      whyItAppearsTemplate: 'You are employed with a 401(k) that allows after-tax contributions and you are maxing standard contributions.',
      whyOftenExplored: 'Often explored when seeking to maximize Roth contributions beyond standard limits and employer plan permits.',
      whoReviews: ['CPA', 'CFP'],
      notes: ['Educational only', 'Requires employer plan support', 'Requires professional review']
    }
  },
  {
    id: 'rmd-minimization',
    name: 'RMD Minimization Strategies',
    eligibility: {
      allOf: [
        { field: 'age', op: '>=', value: 72 },
        { field: 'hasPreTaxRetirement', op: '==', value: true }
      ]
    },
    impactRules: [
      { label: 'High', allOf: [{ field: 'retirementRange', op: 'in', value: ['1m-2.5m', '2.5m-5m', '>5m'] }] },
      { label: 'Medium', allOf: [{ field: 'retirementRange', op: 'in', value: ['500k-1m'] }] },
      { label: 'Low', allOf: [{ field: 'retirementRange', op: 'in', value: ['<250k', '250k-500k'] }] }
    ],
    cardCopy: {
      whatThisIs: 'Proactive management to reduce Required Minimum Distributions from pre-tax retirement accounts, which begin at age 73.',
      whyItAppearsTemplate: 'You are age {{age}} with pre-tax retirement accounts approaching or past RMD age.',
      whyOftenExplored: 'Often explored when pre-tax balances are large enough that forced distributions may push into higher tax brackets.',
      whoReviews: ['CPA', 'CFP'],
      notes: ['Educational only', 'RMD rules changed with SECURE Act 2.0', 'Requires professional review']
    }
  },
  {
    id: 'qcd',
    name: 'Qualified Charitable Distribution (QCD)',
    eligibility: {
      allOf: [
        { field: 'age', op: '>=', value: 70 },
        { field: 'hasTraditionalIRA', op: '==', value: true },
        { field: 'charitableGivingIntent', op: '==', value: true }
      ]
    },
    impactRules: [
      { label: 'High', allOf: [{ field: 'charitableGiving', op: 'in', value: ['25k-100k', '>100k'] }, { field: 'retirementRange', op: 'in', value: ['1m-2.5m', '2.5m-5m', '>5m'] }] },
      { label: 'Medium', allOf: [{ field: 'charitableGiving', op: 'in', value: ['5k-25k'] }] },
      { label: 'Low', allOf: [{ field: 'charitableGiving', op: 'in', value: ['none', '<5k'] }] }
    ],
    cardCopy: {
      whatThisIs: 'Direct transfer from an IRA to a qualified charity, which counts toward RMDs but is excluded from taxable income.',
      whyItAppearsTemplate: 'You are age {{age}}, have a traditional IRA, and give {{charitableGiving}} annually to charity.',
      whyOftenExplored: 'Often explored when satisfying charitable giving goals while reducing taxable RMD income.',
      whoReviews: ['CPA'],
      notes: ['Educational only', 'Must go directly to charity', 'Up to $105,000 annually (2024)', 'Requires professional review']
    }
  },
  {
    id: '1031-exchange',
    name: '1031 Like-Kind Exchange',
    eligibility: {
      allOf: [
        { field: 'hasRentalRealEstate', op: '==', value: true },
        { field: 'intendsToSellProperty', op: '==', value: true }
      ]
    },
    suppression: {
      anyOf: [
        { field: 'realEstateRange', op: 'in', value: ['none', '<250k'] }
      ]
    },
    impactRules: [
      { label: 'High', allOf: [{ field: 'realEstateRange', op: 'in', value: ['750k-2m', '>2m'] }] },
      { label: 'Medium', allOf: [{ field: 'realEstateRange', op: '==', value: '250k-750k' }] },
      { label: 'Low', allOf: [] }
    ],
    cardCopy: {
      whatThisIs: 'Deferral of capital gains tax on the sale of investment real estate by reinvesting proceeds into like-kind replacement property.',
      whyItAppearsTemplate: 'You own investment real estate ({{realEstateRange}} equity) and intend to sell.',
      whyOftenExplored: 'Often explored when repositioning real estate holdings without triggering immediate capital gains recognition.',
      whoReviews: ['CPA', 'Attorney'],
      notes: ['Educational only', 'Strict 45/180 day timelines', 'Investment property only', 'Requires professional review']
    }
  }
];

export const DISCLAIMER_FOOTER = "This tool highlights planning concepts that may warrant further discussion with a qualified tax or legal professional. It does not provide tax advice or individualized recommendations.";
