import type {
  Persona,
  UserProfile,
  MaritalStatus,
  EmploymentStatus,
  RetirementRange,
  RealEstateRange,
} from "@/types/persona";

function normalizeMaritalStatus(v: MaritalStatus): "Single" | "Married" {
  const s = String(v).toLowerCase();
  return s === "married" ? "Married" : "Single";
}

function normalizeEmploymentStatus(v: EmploymentStatus): EmploymentStatus {
  const s = String(v).toLowerCase();
  if (s === "employed" || s === "w-2") return "employed" as EmploymentStatus;
  if (s === "unemployed" || s === "retired") return "unemployed" as EmploymentStatus;
  if (s === "self-employed" || s === "consulting") return "consulting" as EmploymentStatus;
  if (s === "severance") return "Severance" as EmploymentStatus;
  return v;
}

function normalizeRetirementRange(v: RetirementRange): RetirementRange {
  const s = String(v).toLowerCase().replace(/\s+/g, "");
  if (s === "<250k") return "<250k";
  if (s === "250k-500k") return "250k-500k";
  if (s === "500k-1m") return "500k-1m" as RetirementRange;
  if (s === "1m-2.5m") return "1m-2.5m" as RetirementRange;
  if (s === "2.5m-5m") return "2.5m-5m" as RetirementRange;
  if (s === "5m+" || s === ">5m") return ">5m" as RetirementRange;
  return v;
}

function toRealEstateRange(realEstate: Persona["realEstate"]): RealEstateRange {
  if (realEstate === "None") return "none";
  if (realEstate === "Primary") return "250k-750k";
  if (realEstate === "Rental") return "250k-750k";
  return "none";
}

// Helper to get retirement tier index for assumptions
function getRetirementTierIndex(tier: RetirementRange): number {
  const order: RetirementRange[] = ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'];
  return order.indexOf(tier);
}

/**
 * Convert Persona to UserProfile with INTELLIGENT ASSUMPTIONS
 * Instead of setting everything to undefined, we make reasonable inferences
 * based on net worth tier and other collected data.
 */
export function personaToUserProfile(persona: Persona): UserProfile {
  const maritalStatus = normalizeMaritalStatus(persona.maritalStatus);
  const employmentStatus = normalizeEmploymentStatus(persona.employment);
  const spouseEmploymentStatus = persona.spouseEmployment
    ? normalizeEmploymentStatus(persona.spouseEmployment)
    : undefined;

  const ageBandMidpoint: Record<string, number> = {
    "45-49": 47,
    "50-54": 52,
    "55-59": 57,
    "60-65": 62,
    "60-69": 65,
    "70+": 72,
  };

  const age = ageBandMidpoint[String(persona.ageBand)] ?? 52;
  const retirementRange = normalizeRetirementRange(persona.retirementRange);
  const tierIndex = getRetirementTierIndex(retirementRange);

  // Get screening flags (default to empty if not provided)
  const screening = persona.screening ?? {};

  // INTELLIGENT ASSUMPTIONS based on net worth tier
  const isHigherNetWorth = tierIndex >= 2; // $500k+
  const isHighNetWorth = tierIndex >= 3; // $1M+
  const isVeryHighNetWorth = tierIndex >= 4; // $2.5M+

  // If someone has $250k+ in retirement, they almost certainly have pre-tax accounts
  const hasPreTaxRetirement = tierIndex >= 1;
  
  // Higher net worth individuals likely have multiple account types
  const hasMultipleAccountTypes = tierIndex >= 1 || persona.hasTaxableBrokerage;
  
  // $500k+ likely means high income, above Roth limits if employed
  const incomeAboveRothLimits = isHigherNetWorth && employmentStatus === 'employed';
  
  // Higher net worth often correlates with high tax bracket
  const highTaxBracket = isHigherNetWorth;
  
  // Use screening flags for unrealized gains, otherwise assume based on net worth
  const hasEmbeddedCapitalGains = screening.hasUnrealizedGains ?? (persona.hasTaxableBrokerage || isHigherNetWorth);
  
  // Use screening flags for estate planning
  const estatePlanningConcern = screening.hasEstateAboveExemption ?? isHighNetWorth;
  
  // Higher net worth individuals may think about multi-generational planning
  const multiGenerationalPlanningIntent = screening.hasEstateAboveExemption ?? isVeryHighNetWorth;
  const familyWealthTransferIntent = screening.hasEstateAboveExemption ?? isHighNetWorth;
  
  // If married with one employed spouse, spousal IRA is relevant
  const isSpousalIraRelevant = maritalStatus === 'Married' && 
    (employmentStatus !== 'employed' || spouseEmploymentStatus !== 'employed');

  return {
    firstName: "",
    age,
    maritalStatus,
    retirementRange,
    realEstateRange: toRealEstateRange(persona.realEstate),

    employmentStatus,
    spouseEmploymentStatus,

    // Account types - intelligent assumptions
    hasTaxableBrokerage: screening.hasUnrealizedGains ?? persona.hasTaxableBrokerage ?? isHigherNetWorth,
    hasTraditionalIRA: hasPreTaxRetirement,
    has401k: hasPreTaxRetirement && (employmentStatus === 'employed' || tierIndex >= 1),
    hasMultipleAccountTypes,
    
    // Use screening flags for employer stock
    hasEmployerStock: screening.hasEmployerStockIn401k ?? persona.hasEmployerStockIn401k ?? false,
    hasRentalRealEstate: persona.realEstate === "Rental",
    
    // Use screening flags for business ownership
    hasBusinessOwnership: screening.hasBusinessOwnership ?? persona.businessOwnerOrEquity ?? false,
    
    // Income/Roth related - intelligent assumptions
    incomeAboveRothLimits,
    hasLargePreTaxIRA: tierIndex >= 2,
    employer401kAllowsAfterTax: employmentStatus === 'employed',
    max401kContributions: isHigherNetWorth && employmentStatus === 'employed',
    hasExecutiveCompensation: isHighNetWorth && employmentStatus === 'employed',
    separatedFromService: employmentStatus === 'unemployed' || employmentStatus === 'consulting',
    
    // Use screening flags for HSA and education
    enrolledInHDHP: screening.hasHighDeductibleHealthPlan ?? persona.hasHSA ?? false,
    has529Account: screening.hasEducationGoals ?? persona.has529 ?? false,
    educationFundingIntent: screening.hasEducationGoals ?? persona.has529 ?? false,
    familyWealthTransferIntent,
    multiGenerationalPlanningIntent,

    // Investment/gains - use screening flags
    hasMarketVolatility: true,
    hasEmbeddedCapitalGains,
    hasRealizedCapitalGains: hasEmbeddedCapitalGains,
    highTaxBracket,
    hasTaxableFixedIncome: isHigherNetWorth,
    
    // Real estate
    intendsToSellProperty: persona.realEstate === "Rental",
    sellingPrimaryResidence: false,
    ownsDepreciatedRealEstate: persona.realEstate === "Rental",
    activeParticipationInRental: persona.rentalLossesLikely ?? (persona.realEstate === "Rental"),
    ownsLargeLandParcel: isVeryHighNetWorth && persona.realEstate !== "None",
    
    // Use screening flags for business
    ownsCCorpStock: screening.hasBusinessOwnership ?? persona.businessOwnerOrEquity ?? false,
    qsbsHoldingPeriod5Years: screening.hasBusinessOwnership ?? persona.businessOwnerOrEquity ?? false,
    sellingBusinessOrRealEstate: (screening.hasBusinessOwnership ?? persona.businessOwnerOrEquity) || persona.realEstate === "Rental",
    
    // Income timing
    incomeSpike: false,
    highIncomeYear: highTaxBracket,
    incomeSmoothingPreference: isHigherNetWorth,
    expectedFutureTaxRatesHigher: age < 65,
    
    // Use screening flags for charitable giving
    charitableGiving: screening.hasCharitableIntent ? "5k-25k" : (isHighNetWorth ? "5k-25k" : "none"),
    longevityConcern: age >= 55,
    incomeReplacementNeed: age >= 55 && age <= 70,
    estatePlanningConcern,
    riskTolerance: isHigherNetWorth ? "medium" : "low",
  };
}
