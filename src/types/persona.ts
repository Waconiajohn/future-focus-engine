
export type ImpactLabel = "Potential" | "Material" | "Advanced";

export type ProfessionalTag =
  | "CPA"
  | "CFP"
  | "CPA + CFP"
  | "Estate Attorney"
  | "CPA + Estate Attorney"
  | "Advisor / CPA";

export type EmploymentStatus = "Employed" | "Unemployed" | "Severance" | "Consulting";

export type AgeBand = "45-49" | "50-54" | "55-59" | "60-65";

export type MaritalStatus = "Single" | "Married";

export type RetirementRange =
  | "<250k"
  | "250k-500k"
  | "500k-1M"
  | "1M-2.5M"
  | "2.5M-5M"
  | "5M+";

export type RealEstateProfile = "None" | "Primary" | "Rental";

export type Persona = {
  ageBand: AgeBand;
  maritalStatus: MaritalStatus;
  employment: EmploymentStatus;
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
  planningHorizonYears?: number; // optional
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
  | "dynastyTrust";

export type Strategy = {
  id: StrategyId;
  title: string;
  whyThisMayApply: string; // <= 12 words enforced in UI lint
  scenario: string; // 2–3 lines
  decisionWindow: string; // short
  professional: ProfessionalTag;
  impact: ImpactLabel;
  cta: "Worth discussing";
  cpaSummary: string; // CPA-friendly, neutral
};

export type TriggerResult = {
  strategyId: StrategyId;
  matched: boolean;
  reasons: string[];
  confidence: "Low" | "Medium" | "High";
};
