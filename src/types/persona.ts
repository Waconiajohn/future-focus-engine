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

export type EmploymentStatus = 'employed' | 'unemployed' | 'retired' | 'self-employed' | 'consulting';

export type UnemploymentDuration = '<3months' | '3-6months' | '6-12months' | '>12months';

export type AgeBand = '45-49' | '50-54' | '55-59' | '60-69' | '70+';

export type SeveranceRange = 'none' | '<50k' | '50k-150k' | '150k-300k' | '>300k';
export type SeveranceType = 'lump-sum' | 'over-time';
export type UIRange = 'none' | '<2k' | '2k-4k' | '>4k';
export type CurrentYearIncomeComparison = 'higher' | 'similar' | 'lower' | 'unsure';

export interface UnemploymentDetails {
  duration: UnemploymentDuration;
  incomeLowerThanTypical: boolean;
  expectReturnWithin12Months: 'yes' | 'no' | 'not-sure';
  // New severance/UI fields
  receivedSeverance?: boolean;
  severanceRange?: SeveranceRange;
  severanceType?: SeveranceType;
  receivingUI?: boolean;
  uiRange?: UIRange;
  currentYearIncomeComparison?: CurrentYearIncomeComparison;
}

export interface SelfEmployedDetails {
  incomeFluctuatesQuarterly?: boolean;
  hasPositiveCashFlow?: boolean;
}

export type CharitableRange = 'none' | '<5k' | '5k-25k' | '25k-100k' | '>100k';

export type RiskTolerance = 'low' | 'moderate' | 'high';

export interface UserProfile {
  firstName: string;
  age: number;
  maritalStatus: MaritalStatus;
  retirementRange: RetirementRange;
  realEstateRange: RealEstateRange;
  employmentStatus: EmploymentStatus;
  unemploymentDetails?: UnemploymentDetails;
  selfEmployedDetails?: SelfEmployedDetails;
  spouseEmploymentStatus?: EmploymentStatus;
  spouseUnemploymentDetails?: UnemploymentDetails;
  spouseSelfEmployedDetails?: SelfEmployedDetails;
  
  // Core asset flags
  hasTraditionalIRA?: boolean;
  has401k?: boolean;
  hasTaxableBrokerage?: boolean;
  hasMultipleAccountTypes?: boolean;
  
  // Life context fields
  charitableGiving?: CharitableRange;
  hasBusinessOwnership?: boolean;
  hasEmployerStock?: boolean;
  hasRentalRealEstate?: boolean;
  
  // Roth-related triggers
  incomeAboveRothLimits?: boolean;
  hasLargePreTaxIRA?: boolean;
  employer401kAllowsAfterTax?: boolean;
  max401kContributions?: boolean;
  
  // Employment/separation triggers
  separatedFromService?: boolean;
  hasExecutiveCompensation?: boolean;
  
  // Education & family
  has529Account?: boolean;
  educationFundingIntent?: boolean;
  familyWealthTransferIntent?: boolean;
  multiGenerationalPlanningIntent?: boolean;
  
  // Real estate specific
  intendsToSellProperty?: boolean;
  sellingPrimaryResidence?: boolean;
  ownsDepreciatedRealEstate?: boolean;
  ownsLargeLandParcel?: boolean;
  activeParticipationInRental?: boolean;
  
  // Investment/business
  hasHighlyAppreciatedAssets?: boolean;
  hasEmbeddedCapitalGains?: boolean;
  hasRealizedCapitalGains?: boolean;
  ownsCCorpStock?: boolean;
  qsbsHoldingPeriod5Years?: boolean;
  sellingBusinessOrRealEstate?: boolean;
  
  // Income/tax context
  highTaxBracket?: boolean;
  incomeSpike?: boolean;
  highIncomeYear?: boolean;
  incomeSmoothingPreference?: boolean;
  expectedFutureTaxRatesHigher?: boolean;
  
  // Healthcare
  enrolledInHDHP?: boolean;
  
  // Planning preferences
  longevityConcern?: boolean;
  incomeReplacementNeed?: boolean;
  estatePlanningConcern?: boolean;
  riskTolerance?: RiskTolerance;
  hasMarketVolatility?: boolean;
  hasTaxableFixedIncome?: boolean;
}

// Computed flags for strategy matching
export interface TransitionYearFlags {
  isTransitionYear: boolean;
  anyoneUnemployed: boolean;
  bothUnemployed: boolean;
  incomeLowerThanTypical: boolean;
  shortTermTransition: boolean;
  longTermTransition: boolean;
  incomeVolatility: boolean;
}

export function computeTransitionFlags(profile: UserProfile): TransitionYearFlags {
  const primaryUnemployed = profile.employmentStatus === 'unemployed';
  const spouseUnemployed = profile.spouseEmploymentStatus === 'unemployed';
  const anyoneUnemployed = primaryUnemployed || spouseUnemployed;
  const bothUnemployed = profile.maritalStatus === 'married' && primaryUnemployed && spouseUnemployed;

  const primaryLowerIncome = primaryUnemployed && profile.unemploymentDetails?.incomeLowerThanTypical;
  const spouseLowerIncome = spouseUnemployed && profile.spouseUnemploymentDetails?.incomeLowerThanTypical;
  const incomeLowerThanTypical = primaryLowerIncome || spouseLowerIncome || false;

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

  // Income volatility: unemployed OR income spike OR lower than typical
  const incomeVolatility = anyoneUnemployed || incomeLowerThanTypical || profile.incomeSpike || false;

  return {
    isTransitionYear: anyoneUnemployed || incomeLowerThanTypical,
    anyoneUnemployed,
    bothUnemployed,
    incomeLowerThanTypical,
    shortTermTransition,
    longTermTransition,
    incomeVolatility
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
  whatThisIs: string;
  whyItAppears: string;
  whyOftenExplored: string;
  evaluator: Evaluator;
  description: string;
  whyForYou: string;
  impact: 'high' | 'medium' | 'low';
  category: 'timing' | 'structure' | 'withdrawal' | 'giving' | 'general' | 'real-estate' | 'business' | 'investment';
  primaryTriggers: PrimaryTriggers;
  priorityModifiers?: PriorityModifiers;
  suppressionConditions?: SuppressionConditions;
  transitionYearPriority?: number;
  suppressDuringUnemployment?: boolean;
  complexity?: 'high' | 'medium' | 'low';
  triggerReason: string;
}

export interface MatchedStrategy extends Strategy {
  computedImpact: 'high' | 'medium' | 'low';
  urgencyLevel: 'worth-deeper-review' | 'worth-considering' | 'worth-noting';
  priorityScore: number;
}

// PRIMARY TRIGGERS - Hard requirements. ALL must pass for strategy to appear.
export interface PrimaryTriggers {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: MaritalStatus[];
  employmentStatus?: EmploymentStatus[];
  
  // Account type requirements
  requiresPreTaxRetirement?: boolean;
  requiresTraditionalIRA?: boolean;
  requires401k?: boolean;
  requiresTaxableBrokerage?: boolean;
  requiresMultipleAccountTypes?: boolean;
  
  // Behavioral/situational triggers
  requiresCharitableIntent?: boolean;
  requiresEmployerStock?: boolean;
  requiresRentalRealEstate?: boolean;
  requiresBusinessOwnership?: boolean;
  requiresTransitionYear?: boolean;
  requiresLowerIncome?: boolean;
  requiresIncomeVolatility?: boolean;
  
  // Roth-related
  requiresIncomeAboveRothLimits?: boolean;
  requiresNoLargePreTaxIRA?: boolean;
  requiresEmployer401kAfterTax?: boolean;
  requiresMax401kContributions?: boolean;
  
  // Employment/separation
  requiresSeparatedFromService?: boolean;
  requiresExecutiveCompensation?: boolean;
  
  // Education & family
  requires529Account?: boolean;
  requiresEducationFundingIntent?: boolean;
  requiresFamilyWealthTransfer?: boolean;
  requiresMultiGenerationalPlanning?: boolean;
  
  // Real estate specific
  requiresIntendsToSellProperty?: boolean;
  requiresSellingPrimaryResidence?: boolean;
  requiresDepreciatedRealEstate?: boolean;
  requiresLargeLandParcel?: boolean;
  requiresActiveParticipation?: boolean;
  
  // Investment/business
  requiresHighlyAppreciatedAssets?: boolean;
  requiresEmbeddedCapitalGains?: boolean;
  requiresRealizedCapitalGains?: boolean;
  requiresCCorpStock?: boolean;
  requiresQSBSHoldingPeriod?: boolean;
  requiresSellingBusinessOrRealEstate?: boolean;
  
  // Income/tax context
  requiresHighTaxBracket?: boolean;
  requiresIncomeSpike?: boolean;
  requiresHighIncomeYear?: boolean;
  requiresIncomeSmoothingPreference?: boolean;
  requiresExpectedHigherFutureTaxes?: boolean;
  
  // Healthcare
  requiresHDHP?: boolean;
  
  // Planning preferences
  requiresLongevityConcern?: boolean;
  requiresIncomeReplacementNeed?: boolean;
  requiresEstatePlanningConcern?: boolean;
  requiresModerateRiskTolerance?: boolean;
  requiresMarketVolatility?: boolean;
  requiresTaxableFixedIncome?: boolean;
  requiresHighNetWorth?: boolean;
}

export interface SuppressionConditions {
  suppressBelowRetirementTier?: RetirementRange;
  suppressBelowRealEstateTier?: RealEstateRange;
  suppressIfNoRealEstate?: boolean;
}

export interface PriorityModifiers {
  higherPriorityRetirementTiers?: RetirementRange[];
  higherPriorityRealEstateTiers?: RealEstateRange[];
  priorityAgeRange?: { min: number; max: number };
  basePriorityBoost?: number;
}
