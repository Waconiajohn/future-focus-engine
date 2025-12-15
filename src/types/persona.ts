export type MaritalStatus = 'single' | 'married';

export type RetirementRange = 
  | '<250k' 
  | '250k-500k' 
  | '500k-1m' 
  | '1m-2.5m' 
  | '2.5m-5m'
  | '>5m';

export type RealEstateRange = 
  | 'none' 
  | '<250k' 
  | '250k-750k' 
  | '750k-2m' 
  | '>2m';

export type EmploymentStatus = 'employed' | 'unemployed' | 'retired';

export type UnemploymentDuration = '<3months' | '3-6months' | '6-12months' | '>12months';

export type AgeBand = '45-49' | '50-54' | '55-59' | '60-69' | '70+';

export interface UnemploymentDetails {
  duration: UnemploymentDuration;
  incomeLowerThanTypical: boolean;
  expectReturnWithin12Months: 'yes' | 'no' | 'not-sure';
}

export type CharitableRange = 'none' | '<5k' | '5k-25k' | '25k-100k' | '>100k';

export interface UserProfile {
  firstName: string;
  age: number;
  maritalStatus: MaritalStatus;
  retirementRange: RetirementRange;
  realEstateRange: RealEstateRange;
  employmentStatus: EmploymentStatus;
  unemploymentDetails?: UnemploymentDetails;
  spouseEmploymentStatus?: EmploymentStatus;
  spouseUnemploymentDetails?: UnemploymentDetails;
  // Life context fields
  charitableGiving?: CharitableRange;
  hasBusinessOwnership?: boolean;
  hasEmployerStock?: boolean;
  hasRentalRealEstate?: boolean;
  // Additional trigger fields
  incomeAboveRothLimits?: boolean;
  hasLargePreTaxIRA?: boolean;
  employer401kAllowsAfterTax?: boolean;
  separatedFromService?: boolean;
  has529Account?: boolean;
}

// Computed flags for strategy matching
export interface TransitionYearFlags {
  isTransitionYear: boolean;
  anyoneUnemployed: boolean;
  bothUnemployed: boolean;
  incomeLowerThanTypical: boolean;
  shortTermTransition: boolean; // expects return within 12 months
  longTermTransition: boolean; // doesn't expect return or unsure
}

export function computeTransitionFlags(profile: UserProfile): TransitionYearFlags {
  const primaryUnemployed = profile.employmentStatus === 'unemployed';
  const spouseUnemployed = profile.spouseEmploymentStatus === 'unemployed';
  const anyoneUnemployed = primaryUnemployed || spouseUnemployed;
  const bothUnemployed = profile.maritalStatus === 'married' && primaryUnemployed && spouseUnemployed;

  // Check if income is lower than typical for anyone unemployed
  const primaryLowerIncome = primaryUnemployed && profile.unemploymentDetails?.incomeLowerThanTypical;
  const spouseLowerIncome = spouseUnemployed && profile.spouseUnemploymentDetails?.incomeLowerThanTypical;
  const incomeLowerThanTypical = primaryLowerIncome || spouseLowerIncome || false;

  // Determine if this is a short-term or long-term transition
  const primaryExpectsReturn = profile.unemploymentDetails?.expectReturnWithin12Months === 'yes';
  const spouseExpectsReturn = profile.spouseUnemploymentDetails?.expectReturnWithin12Months === 'yes';
  const shortTermTransition = (primaryUnemployed && primaryExpectsReturn) || 
                              (spouseUnemployed && spouseExpectsReturn);
  
  const primaryLongTerm = primaryUnemployed && 
    (profile.unemploymentDetails?.expectReturnWithin12Months === 'no' || 
     profile.unemploymentDetails?.expectReturnWithin12Months === 'not-sure');
  const spouseLongTerm = spouseUnemployed && 
    (profile.spouseUnemploymentDetails?.expectReturnWithin12Months === 'no' || 
     profile.spouseUnemploymentDetails?.expectReturnWithin12Months === 'not-sure');
  const longTermTransition = primaryLongTerm || spouseLongTerm;

  return {
    isTransitionYear: anyoneUnemployed || incomeLowerThanTypical,
    anyoneUnemployed,
    bothUnemployed,
    incomeLowerThanTypical,
    shortTermTransition,
    longTermTransition
  };
}

export interface PersonaStory {
  id: string;
  name: string;
  age: number;
  maritalStatus: MaritalStatus;
  ageBand: AgeBand;
  retirementTier: RetirementRange[];
  realEstateTier: RealEstateRange[];
  narrative: string;
  whyItMatters: string;
  unlocksStrategies: string[];
}

export type Evaluator = 'CPA' | 'CFP' | 'Attorney' | 'CPA/CFP' | 'CPA/Attorney' | 'CFP/Attorney' | 'CPA/CFP/Attorney';

export interface Strategy {
  id: string;
  title: string;
  description: string;
  whyForYou: string;
  impact: 'high' | 'medium' | 'low';
  category: 'timing' | 'structure' | 'withdrawal' | 'giving' | 'general';
  // Primary triggers - ALL must be true for strategy to appear
  primaryTriggers: PrimaryTriggers;
  // Modifiers - affect priority/urgency, not eligibility
  priorityModifiers?: PriorityModifiers;
  // Suppression conditions - strategy hidden if ANY condition met
  suppressionConditions?: SuppressionConditions;
  transitionYearPriority?: number;
  suppressDuringUnemployment?: boolean;
  // Complexity flag for suppression at lower tiers
  complexity?: 'high' | 'medium' | 'low';
  // Display metadata
  triggerReason: string; // What condition triggered visibility
  evaluator: Evaluator; // Who should evaluate this strategy
}

// Matched strategy with computed values
export interface MatchedStrategy extends Strategy {
  computedImpact: 'high' | 'medium' | 'low';
  urgencyLevel: 'worth-deeper-review' | 'worth-considering' | 'worth-noting';
  priorityScore: number;
}

// PRIMARY TRIGGERS - Hard requirements. If ANY fails, strategy NEVER appears.
export interface PrimaryTriggers {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: MaritalStatus[];
  // Behavioral/situational triggers
  requiresPreTaxRetirement?: boolean; // Has meaningful pre-tax accounts
  requiresCharitableIntent?: boolean; // charitableGiving > 'none'
  requiresEmployerStock?: boolean;
  requiresRentalRealEstate?: boolean;
  requiresBusinessOwnership?: boolean;
  requiresTransitionYear?: boolean;
  requiresLowerIncome?: boolean;
  employmentStatus?: EmploymentStatus[];
  // Additional explicit triggers
  requiresIncomeAboveRothLimits?: boolean;
  requiresNoLargePreTaxIRA?: boolean;
  requiresEmployer401kAfterTax?: boolean;
  requiresSeparatedFromService?: boolean;
  requires529Account?: boolean;
}

// SUPPRESSION CONDITIONS - Strategy hidden if ANY condition is met
export interface SuppressionConditions {
  // Suppress if retirement accounts below these tiers
  suppressBelowRetirementTier?: RetirementRange;
  // Suppress if real estate below these tiers
  suppressBelowRealEstateTier?: RealEstateRange;
  // Suppress if no real estate
  suppressIfNoRealEstate?: boolean;
}

// PRIORITY MODIFIERS - Affect sorting/urgency, never eligibility
export interface PriorityModifiers {
  // Higher balances = higher priority (not a requirement)
  higherPriorityRetirementTiers?: RetirementRange[];
  higherPriorityRealEstateTiers?: RealEstateRange[];
  // Boost priority for these age ranges
  priorityAgeRange?: { min: number; max: number };
  // Base priority boost
  basePriorityBoost?: number;
}

// Legacy interface for backward compatibility during migration
export interface StrategyConditions {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: MaritalStatus[];
  retirementRanges?: RetirementRange[];
  realEstateRanges?: RealEstateRange[];
  employmentStatus?: EmploymentStatus[];
  requiresTransitionYear?: boolean;
  requiresLowerIncome?: boolean;
  requiresCharitable?: boolean;
  requiresEmployerStock?: boolean;
}
