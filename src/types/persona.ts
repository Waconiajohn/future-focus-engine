
export type ImpactLabel = "Potential" | "Material" | "Advanced" | "high" | "medium" | "low";

export type ProfessionalTag =
  | "CPA"
  | "CFP"
  | "CPA + CFP"
  | "CPA/CFP"
  | "Estate Attorney"
  | "Attorney"
  | "CPA + Estate Attorney"
  | "CPA/Attorney"
  | "CFP/Attorney"
  | "CPA/CFP/Attorney"
  | "Advisor / CPA";

export type AgeBand = "45-49" | "50-54" | "55-59" | "60-65" | "60-69" | "70+";

export type EmploymentStatus = "Employed" | "Unemployed" | "Severance" | "Consulting" | "employed" | "unemployed" | "self-employed" | "consulting" | "retired";

export type MaritalStatus = "Single" | "Married" | "single" | "married";

export type RetirementRange =
  | "<250k"
  | "250k-500k"
  | "500k-1M"
  | "1M-2.5M"
  | "2.5M-5M"
  | "5M+"
  | "500k-1m"
  | "1m-2.5m"
  | "2.5m-5m"
  | ">5m";

export type RealEstateProfile = "None" | "Primary" | "Rental";

export type RealEstateRange = "none" | "<250k" | "250k-750k" | "750k-2m" | ">2m";

export type CharitableRange = "none" | "<5k" | "5k-25k" | "25k-100k" | ">100k";

export type UnemploymentDuration = "<3months" | "3-6months" | "6-12months" | ">12months";

export type SeveranceRange = "none" | "<50k" | "50k-150k" | "150k-300k" | ">300k";

export type SeveranceType = "lump-sum" | "over-time";

export type UIRange = "none" | "<2k" | "2k-4k" | ">4k";

export type CurrentYearIncomeComparison = "higher" | "similar" | "lower" | "unsure";

export type IncomeFluctuation = "stable" | "variable" | "declining" | "increasing";

export type UnemploymentDetails = {
  duration?: UnemploymentDuration;
  returnExpected?: "yes" | "no" | "not-sure";
  expectReturnWithin12Months?: "yes" | "no" | "not-sure";
  incomeLowerThanTypical?: boolean;
  hasSeverance?: boolean;
  receivedSeverance?: boolean;
  severanceRange?: SeveranceRange;
  severanceType?: SeveranceType;
  receivingUI?: boolean;
  uiRange?: UIRange;
  currentYearIncomeComparison?: CurrentYearIncomeComparison;
};

export type SelfEmployedDetails = {
  incomeFluctuation?: IncomeFluctuation;
  incomeFluctuatesQuarterly?: boolean;
  hasCashFlowConcerns?: boolean;
  hasPositiveCashFlow?: boolean;
};

export type Persona = {
  ageBand: AgeBand;
  maritalStatus: MaritalStatus;
  employment: EmploymentStatus;
  spouseEmployment?: EmploymentStatus;
  retirementRange: RetirementRange;
  realEstate: RealEstateProfile;

  // Optional refiners that reduce false positives
  hasTaxableBrokerage?: boolean;
  hasEmployerStockIn401k?: boolean;
  charitableGivingIntent?: boolean;
  hasHSA?: boolean;
  has529?: boolean;
  businessOwnerOrEquity?: boolean;
  rentalLossesLikely?: boolean;
  planningHorizonYears?: number;
};

export type UserProfile = {
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
  charitableGiving?: CharitableRange;
  hasBusinessOwnership?: boolean;
  hasEmployerStock?: boolean;
  hasRentalRealEstate?: boolean;
  hasTraditionalIRA?: boolean;
  has401k?: boolean;
  // Extended profile properties for strategies.ts
  hasTaxableBrokerage?: boolean;
  hasMultipleAccountTypes?: boolean;
  incomeAboveRothLimits?: boolean;
  hasLargePreTaxIRA?: boolean;
  employer401kAllowsAfterTax?: boolean;
  max401kContributions?: boolean;
  separatedFromService?: boolean;
  hasExecutiveCompensation?: boolean;
  has529Account?: boolean;
  educationFundingIntent?: boolean;
  familyWealthTransferIntent?: boolean;
  multiGenerationalPlanningIntent?: boolean;
  intendsToSellProperty?: boolean;
  sellingPrimaryResidence?: boolean;
  ownsDepreciatedRealEstate?: boolean;
  ownsLargeLandParcel?: boolean;
  activeParticipationInRental?: boolean;
  hasHighlyAppreciatedAssets?: boolean;
  hasEmbeddedCapitalGains?: boolean;
  hasRealizedCapitalGains?: boolean;
  ownsCCorpStock?: boolean;
  qsbsHoldingPeriod5Years?: boolean;
  sellingBusinessOrRealEstate?: boolean;
  highTaxBracket?: boolean;
  incomeSpike?: boolean;
  highIncomeYear?: boolean;
  incomeSmoothingPreference?: boolean;
  expectedFutureTaxRatesHigher?: boolean;
  enrolledInHDHP?: boolean;
  longevityConcern?: boolean;
  incomeReplacementNeed?: boolean;
  estatePlanningConcern?: boolean;
  riskTolerance?: "low" | "medium" | "high";
  hasMarketVolatility?: boolean;
  hasTaxableFixedIncome?: boolean;
};

export type TransitionYearFlags = {
  isTransitionYear: boolean;
  anyoneUnemployed: boolean;
  bothUnemployed: boolean;
  shortTermTransition: boolean;
  incomeLowerThanTypical: boolean;
  incomeVolatility: boolean;
};

export function computeTransitionFlags(profile: UserProfile): TransitionYearFlags {
  const unemployedStatuses = ['unemployed', 'Unemployed'];
  const primaryUnemployed = unemployedStatuses.includes(profile.employmentStatus);
  const spouseUnemployed = profile.spouseEmploymentStatus ? unemployedStatuses.includes(profile.spouseEmploymentStatus) : false;
  
  const shortTermDurations = ['<3months', '3-6months'];
  const primaryShortTerm = profile.unemploymentDetails?.duration && shortTermDurations.includes(profile.unemploymentDetails.duration);
  const spouseShortTerm = profile.spouseUnemploymentDetails?.duration && shortTermDurations.includes(profile.spouseUnemploymentDetails.duration);
  
  const primaryLower = profile.unemploymentDetails?.currentYearIncomeComparison === 'lower';
  const spouseLower = profile.spouseUnemploymentDetails?.currentYearIncomeComparison === 'lower';
  
  const selfEmployedStatuses = ['self-employed', 'consulting', 'Consulting'];
  const primarySelfEmployed = selfEmployedStatuses.includes(profile.employmentStatus);
  const spouseSelfEmployed = profile.spouseEmploymentStatus ? selfEmployedStatuses.includes(profile.spouseEmploymentStatus) : false;
  const hasIncomeVolatility = primarySelfEmployed || spouseSelfEmployed || primaryUnemployed || spouseUnemployed;
  
  return {
    isTransitionYear: primaryUnemployed || spouseUnemployed || primarySelfEmployed || spouseSelfEmployed,
    anyoneUnemployed: primaryUnemployed || spouseUnemployed,
    bothUnemployed: primaryUnemployed && spouseUnemployed,
    shortTermTransition: (primaryShortTerm || spouseShortTerm) ?? false,
    incomeLowerThanTypical: primaryLower || spouseLower,
    incomeVolatility: hasIncomeVolatility,
  };
}

export type SuppressionConditions = {
  suppressBelowRetirementTier?: RetirementRange;
  suppressBelowRealEstateTier?: RealEstateRange;
  suppressIfNoRealEstate?: boolean;
};

export type StrategyId =
  | "rothConversions"
  | "backdoorRoth"
  | "megaBackdoorRoth"
  | "rmdQcd"
  | "qlac"
  | "nua"
  | "assetLocation"
  | "taxLossHarvesting"
  | "costBasisPlanning"
  | "muniBonds"
  | "hsa"
  | "plan529"
  | "daf"
  | "crt"
  | "exchange1031"
  | "rentalLossRules"
  | "conservationEasement"
  | "opportunityZones"
  | "installmentSales"
  | "qsbs1202"
  | "nqdc"
  | "flpIncomeShift"
  | "homeSaleExclusion"
  | "depreciationRecapture"
  | "spousalIra"
  | "saversCredit"
  | "lifeInsurancePlanning"
  | "dynastyTrust"
  // New strategy IDs from strategies.ts
  | "roth-conversion"
  | "backdoor-roth"
  | "mega-backdoor-roth"
  | "rmd-minimization"
  | "qcd"
  | "asset-location"
  | "tax-loss-harvesting"
  | "cost-basis-planning"
  | "municipal-bonds"
  | "529-planning"
  | "charitable-bunching"
  | "1031-exchange"
  | "depreciation-recapture"
  | "rental-loss-rules"
  | "opportunity-zone"
  | "installment-sale"
  | "qsbs"
  | "lower-income-planning"
  | "spousal-ira"
  | "flp"
  | "dynasty-trust"
  | "life-insurance"
  | "home-sale-exclusion"
  | "conservation-easement";

export type StrategyCategory = "timing" | "structure" | "withdrawal" | "giving" | "general" | "real-estate" | "business" | "investment";

export type PrimaryTriggers = {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: MaritalStatus[];
  employmentStatus?: EmploymentStatus[];
  
  // Account requirements
  requiresPreTaxRetirement?: boolean;
  requiresTraditionalIRA?: boolean;
  requires401k?: boolean;
  requiresTaxableBrokerage?: boolean;
  requiresMultipleAccountTypes?: boolean;
  
  // Roth-related
  requiresIncomeAboveRothLimits?: boolean;
  requiresNoLargePreTaxIRA?: boolean;
  requiresEmployer401kAfterTax?: boolean;
  requiresMax401kContributions?: boolean;
  
  // Employment/separation
  requiresEmployerStock?: boolean;
  requiresSeparatedFromService?: boolean;
  requiresExecutiveCompensation?: boolean;
  
  // Charitable
  requiresCharitableIntent?: boolean;
  
  // Education & family
  requires529Account?: boolean;
  requiresEducationFundingIntent?: boolean;
  requiresFamilyWealthTransfer?: boolean;
  requiresMultiGenerationalPlanning?: boolean;
  
  // Real estate
  requiresRentalRealEstate?: boolean;
  requiresIntendsToSellProperty?: boolean;
  requiresSellingPrimaryResidence?: boolean;
  requiresDepreciatedRealEstate?: boolean;
  requiresLargeLandParcel?: boolean;
  requiresActiveParticipation?: boolean;
  
  // Business
  requiresBusinessOwnership?: boolean;
  requiresCCorpStock?: boolean;
  requiresQSBSHoldingPeriod?: boolean;
  requiresSellingBusinessOrRealEstate?: boolean;
  
  // Investment
  requiresHighlyAppreciatedAssets?: boolean;
  requiresEmbeddedCapitalGains?: boolean;
  requiresRealizedCapitalGains?: boolean;
  requiresMarketVolatility?: boolean;
  requiresTaxableFixedIncome?: boolean;
  
  // Income/tax context
  requiresHighTaxBracket?: boolean;
  requiresIncomeSpike?: boolean;
  requiresHighIncomeYear?: boolean;
  requiresIncomeSmoothingPreference?: boolean;
  requiresExpectedHigherFutureTaxes?: boolean;
  
  // Transition year
  requiresTransitionYear?: boolean;
  requiresLowerIncome?: boolean;
  requiresIncomeVolatility?: boolean;
  
  // Healthcare
  requiresHDHP?: boolean;
  
  // Planning preferences
  requiresLongevityConcern?: boolean;
  requiresIncomeReplacementNeed?: boolean;
  requiresEstatePlanningConcern?: boolean;
  requiresModerateRiskTolerance?: boolean;
  requiresHighNetWorth?: boolean;
};

export type PriorityModifiers = {
  higherPriorityRetirementTiers?: RetirementRange[];
  higherPriorityRealEstateTiers?: RealEstateRange[];
  priorityAgeRange?: { min: number; max: number };
  basePriorityBoost?: number;
};

export type Strategy = {
  id: StrategyId | string;
  title: string;
  whyThisMayApply?: string;
  scenario?: string;
  decisionWindow?: string;
  professional?: ProfessionalTag;
  impact: ImpactLabel;
  cta?: "Worth discussing";
  cpaSummary?: string;
  // New fields from strategies.ts
  whatThisIs?: string;
  whyItAppears?: string;
  whyOftenExplored?: string;
  evaluator?: string;
  description?: string;
  whyForYou?: string;
  category?: StrategyCategory;
  complexity?: "high" | "medium" | "low";
  transitionYearPriority?: number;
  triggerReason?: string;
  primaryTriggers?: PrimaryTriggers;
  priorityModifiers?: PriorityModifiers;
  suppressionConditions?: SuppressionConditions;
  suppressDuringUnemployment?: boolean;
};

export type MatchedStrategy = Strategy & {
  computedImpact: "high" | "medium" | "low";
  computedUrgency?: "worth-deeper-review" | "worth-considering" | "worth-noting";
  priority?: number;
  priorityScore?: number;
};

export type PersonaStory = {
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
};

export type TriggerResult = {
  strategyId: StrategyId;
  matched: boolean;
  reasons: string[];
  confidence: "Low" | "Medium" | "High";
};
