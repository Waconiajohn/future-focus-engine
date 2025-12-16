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
  // Return one of the values that strategies.ts expects in employmentStatus[] checks.
  // strategies.ts mostly checks lowercase strings: ['employed']
  const s = String(v).toLowerCase();
  if (s === "employed" || s === "w-2") return "employed" as EmploymentStatus;
  if (s === "unemployed" || s === "retired") return "unemployed" as EmploymentStatus;
  if (s === "self-employed" || s === "consulting") return "consulting" as EmploymentStatus;
  if (s === "severance") return "Severance" as EmploymentStatus;
  // fallback: preserve original
  return v;
}

function normalizeRetirementRange(v: RetirementRange): RetirementRange {
  // strategies.ts uses lowercase variants like 500k-1m, 1m-2.5m, >5m
  const s = String(v).toLowerCase().replace(/\s+/g, "");
  if (s === "<250k") return "<250k";
  if (s === "250k-500k") return "250k-500k";
  if (s === "500k-1m" || s === "500k-1m" || s === "500k-1m") return "500k-1m" as RetirementRange;
  if (s === "1m-2.5m") return "1m-2.5m" as RetirementRange;
  if (s === "2.5m-5m") return "2.5m-5m" as RetirementRange;
  if (s === "5m+" || s === ">5m") return ">5m" as RetirementRange;
  // if the TitleCase ones come in
  if (s === "500k-1m") return "500k-1m" as RetirementRange;
  if (s === "1m-2.5m") return "1m-2.5m" as RetirementRange;
  if (s === "2.5m-5m") return "2.5m-5m" as RetirementRange;
  return v;
}

function toRealEstateRange(realEstate: Persona["realEstate"]): RealEstateRange {
  // Persona only captures type, not value range; default to "none" when None.
  // If Primary/Rental, we don't know value. Use a conservative mid tier to avoid suppressing.
  if (realEstate === "None") return "none";
  if (realEstate === "Primary") return "250k-750k";
  return "250k-750k";
}

export function personaToUserProfile(persona: Persona): UserProfile {
  const maritalStatus = normalizeMaritalStatus(persona.maritalStatus);
  const employmentStatus = normalizeEmploymentStatus(persona.employment);

  const spouseEmploymentStatus = persona.spouseEmployment
    ? normalizeEmploymentStatus(persona.spouseEmployment)
    : undefined;

  // AgeBand is not numeric; pick midpoint for now.
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

  return {
    firstName: "",
    age,
    maritalStatus,
    retirementRange,
    realEstateRange: toRealEstateRange(persona.realEstate),

    employmentStatus,
    spouseEmploymentStatus,

    // Optional refiners: pass through if present
    hasTaxableBrokerage: persona.hasTaxableBrokerage,
    hasEmployerStock: persona.hasEmployerStockIn401k,
    hasRentalRealEstate: persona.realEstate === "Rental",

    enrolledInHDHP: persona.hasHSA,
    has529Account: persona.has529,
    educationFundingIntent: persona.has529,

    hasBusinessOwnership: persona.businessOwnerOrEquity,

    // defaults (unknown)
    hasTraditionalIRA: undefined,
    has401k: undefined,
    hasMultipleAccountTypes: undefined,
    incomeAboveRothLimits: undefined,
    hasLargePreTaxIRA: undefined,
    employer401kAllowsAfterTax: undefined,
    max401kContributions: undefined,
    separatedFromService: undefined,
    hasExecutiveCompensation: undefined,

    // conservative unknowns
    hasMarketVolatility: true,
    hasEmbeddedCapitalGains: persona.hasTaxableBrokerage,
    hasRealizedCapitalGains: undefined,
    highTaxBracket: undefined,
    hasTaxableFixedIncome: undefined,
    incomeSpike: undefined,
    highIncomeYear: undefined,

    intendsToSellProperty: undefined,
    sellingPrimaryResidence: undefined,
    ownsDepreciatedRealEstate: undefined,
    activeParticipationInRental: persona.rentalLossesLikely,

    charitableGiving: persona.charitableGivingIntent ? "5k-25k" : "none",

    estatePlanningConcern: undefined,
    longevityConcern: undefined,
    incomeReplacementNeed: undefined,

    multiGenerationalPlanningIntent: undefined,
    familyWealthTransferIntent: undefined,
  };
}
