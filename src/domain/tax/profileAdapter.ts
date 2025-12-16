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
  
  // If they have taxable brokerage, they likely have embedded gains
  const hasEmbeddedCapitalGains = persona.hasTaxableBrokerage || isHigherNetWorth;
  
  // Higher net worth individuals may have estate planning concerns
  const estatePlanningConcern = isHighNetWorth;
  
  // Higher net worth individuals may think about multi-generational planning
  const multiGenerationalPlanningIntent = isVeryHighNetWorth;
  const familyWealthTransferIntent = isHighNetWorth;
  
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
    hasTaxableBrokerage: persona.hasTaxableBrokerage ?? isHigherNetWorth,
    hasTraditionalIRA: hasPreTaxRetirement,
    has401k: hasPreTaxRetirement && (employmentStatus === 'employed' || tierIndex >= 1),
    hasMultipleAccountTypes,
    
    // Employer/employment related
    hasEmployerStock: persona.hasEmployerStockIn401k ?? (isHigherNetWorth && employmentStatus === 'employed'),
    hasRentalRealEstate: persona.realEstate === "Rental",
    hasBusinessOwnership: persona.businessOwnerOrEquity ?? false,
    
    // Income/Roth related - intelligent assumptions
    incomeAboveRothLimits,
    hasLargePreTaxIRA: tierIndex >= 2, // $500k+ likely has large pre-tax IRA
    employer401kAllowsAfterTax: employmentStatus === 'employed', // Assume possible
    max401kContributions: isHigherNetWorth && employmentStatus === 'employed',
    hasExecutiveCompensation: isHighNetWorth && employmentStatus === 'employed',
    separatedFromService: employmentStatus === 'unemployed' || employmentStatus === 'consulting',
    
    // Education & family
    enrolledInHDHP: persona.hasHSA ?? (age < 65), // Many under 65 have HDHP option
    has529Account: persona.has529 ?? false,
    educationFundingIntent: persona.has529 ?? (age < 60 && tierIndex >= 1),
    familyWealthTransferIntent,
    multiGenerationalPlanningIntent,

    // Investment/gains - intelligent assumptions
    hasMarketVolatility: true, // Always relevant
    hasEmbeddedCapitalGains,
    hasRealizedCapitalGains: hasEmbeddedCapitalGains, // If embedded, may realize
    highTaxBracket,
    hasTaxableFixedIncome: isHigherNetWorth,
    
    // Real estate
    intendsToSellProperty: persona.realEstate === "Rental", // Rental owners should know options
    sellingPrimaryResidence: false, // Don't assume
    ownsDepreciatedRealEstate: persona.realEstate === "Rental",
    activeParticipationInRental: persona.rentalLossesLikely ?? (persona.realEstate === "Rental"),
    ownsLargeLandParcel: isVeryHighNetWorth && persona.realEstate !== "None",
    
    // Business
    ownsCCorpStock: persona.businessOwnerOrEquity ?? false,
    qsbsHoldingPeriod5Years: persona.businessOwnerOrEquity ?? false,
    sellingBusinessOrRealEstate: persona.businessOwnerOrEquity || persona.realEstate === "Rental",
    
    // Income timing
    incomeSpike: false, // Don't assume
    highIncomeYear: highTaxBracket,
    incomeSmoothingPreference: isHigherNetWorth,
    expectedFutureTaxRatesHigher: age < 65, // Younger folks may expect higher future rates
    
    // Planning preferences - intelligent assumptions
    charitableGiving: persona.charitableGivingIntent ? "5k-25k" : (isHighNetWorth ? "5k-25k" : "none"),
    longevityConcern: age >= 55,
    incomeReplacementNeed: age >= 55 && age <= 70,
    estatePlanningConcern,
    riskTolerance: isHigherNetWorth ? "medium" : "low",
  };
}
