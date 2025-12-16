
import { Persona, Strategy, StrategyId, TriggerResult } from "@/types/persona";

export const STRATEGIES: Strategy[] = [
  {
    id: "rothConversions",
    title: "Roth Conversion Planning",
    whyThisMayApply: "Income gaps can create bracket opportunities",
    scenario:
      "Periods between roles or early retirement can temporarily reduce taxable income.\nThat window may support multi-year tax-bucket planning.",
    decisionWindow: "Often strongest before RMD years and Medicare thresholds.",
    professional: "CPA/CFP",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Evaluate multi-year partial conversions to manage future RMD exposure and bracket compression; model interactions with Medicare IRMAA and Social Security taxation where applicable.",
  },
  {
    id: "backdoorRoth",
    title: "Backdoor Roth IRA",
    whyThisMayApply: "Roth access despite income limits",
    scenario:
      "Some households exceed direct Roth contribution limits.\nA structured nondeductible IRA + conversion may be relevant.",
    decisionWindow: "Best when pro-rata IRA aggregation is manageable.",
    professional: "CPA/CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm IRA aggregation/pro-rata exposure and document basis using Form 8606; avoid wash issues with pre-tax IRA balances.",
  },
  {
    id: "megaBackdoorRoth",
    title: "Mega Backdoor Roth",
    whyThisMayApply: "401(k) plan may allow large Roth funding",
    scenario:
      "Some employer plans allow after-tax contributions above deferral limits.\nIn-plan conversion or rollover may shift growth to Roth treatment.",
    decisionWindow: "Requires specific plan features (after-tax + conversion).",
    professional: "CPA/CFP",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Validate plan provisions, annual limits, and conversion mechanics; confirm payroll execution and basis tracking for after-tax contributions.",
  },
  {
    id: "rmdQcd",
    title: "RMD & QCD Coordination",
    whyThisMayApply: "Charitable intent can reduce taxable RMD impact",
    scenario:
      "For IRA owners with charitable giving, directing gifts as QCDs can reduce AGI.\nThat may affect brackets, IRMAA exposure, and deductions.",
    decisionWindow: "After eligibility age; must be executed correctly each year.",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm QCD eligibility and execution (direct to charity); coordinate with RMD calculations and ensure gifts are not also claimed as itemized deductions.",
  },
  {
    id: "qlac",
    title: "QLAC Review",
    whyThisMayApply: "May reduce RMD base in some cases",
    scenario:
      "Certain IRA/plan assets may be allocated to a QLAC structure.\nThis can shift timing of required distributions within allowed limits.",
    decisionWindow: "Before/around RMD age; product and limit rules apply.",
    professional: "CPA/CFP",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm statutory limits and plan eligibility; model tradeoffs between deferral, liquidity, and overall distribution strategy.",
  },
  {
    id: "nua",
    title: "NUA for Employer Stock",
    whyThisMayApply: "Employer stock in a 401(k) may be taxed inefficiently",
    scenario:
      "Company stock held in a qualified plan can sometimes be distributed with NUA treatment.\nThis can change ordinary vs capital-gain character.",
    decisionWindow: "Requires lump-sum distribution timing rules.",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Assess eligibility triggers and distribution structure; quantify ordinary income on basis vs LTCG on NUA and evaluate concentration/risk controls.",
  },
  {
    id: "assetLocation",
    title: "Asset Location Review",
    whyThisMayApply: "Account type mix can reduce ongoing tax drag",
    scenario:
      "Holding certain assets in taxable vs retirement accounts can change tax friction.\nLocation choices can matter over long horizons.",
    decisionWindow: "Anytime; revisit during major allocation or life changes.",
    professional: "CPA/CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Review interest/dividend character and turnover; coordinate with client’s bracket, state taxes, and distribution planning.",
  },
  {
    id: "taxLossHarvesting",
    title: "Tax-Loss Harvesting",
    whyThisMayApply: "Market volatility can create usable losses",
    scenario:
      "Down markets can generate capital losses in taxable accounts.\nLosses may offset gains and potentially reduce future taxes.",
    decisionWindow: "Most relevant during drawdowns and rebalancing cycles.",
    professional: "CPA/CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm wash-sale constraints, tracking across accounts, and capital gain planning; document lot selection and replacement securities.",
  },
  {
    id: "costBasisPlanning",
    title: "Cost Basis & Lot Selection",
    whyThisMayApply: "Lot selection can change realized gains",
    scenario:
      "Selling specific lots can materially change taxable capital gains.\nBasis strategy matters in concentrated positions.",
    decisionWindow: "At every sale/rebalance in taxable accounts.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Ensure specific-lot selection is enabled at custodian; coordinate with gain targets and charitable gifting of low-basis shares where appropriate.",
  },
  {
    id: "muniBonds",
    title: "Municipal Bond Fit Check",
    whyThisMayApply: "Taxable interest may be avoidable",
    scenario:
      "For some brackets and states, municipal bonds may improve after-tax income.\nSuitability depends on yield, risk, and state rules.",
    decisionWindow: "When building or revising fixed income allocations.",
    professional: "CPA/CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Compare taxable-equivalent yield; confirm AMT considerations where relevant and evaluate credit risk and diversification.",
  },
  {
    id: "hsa",
    title: "Health Savings Account Strategy",
    whyThisMayApply: "HSA rules can create tax-advantaged capacity",
    scenario:
      "For eligible households, HSA contributions and reimbursements can be structured to reduce taxes.\nReceipts and timing matter.",
    decisionWindow: "During HDHP coverage years and prior to Medicare enrollment.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm HDHP eligibility and contribution limits; evaluate reimbursement strategy and recordkeeping; coordinate with Medicare enrollment timing.",
  },
  {
    id: "plan529",
    title: "529 Planning & 529-to-Roth Rules",
    whyThisMayApply: "Education funding may overlap tax planning",
    scenario:
      "529 plans can support education goals and may offer additional planning flexibility.\nRules vary by state and beneficiary history.",
    decisionWindow: "When funding education or multi-generation planning.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Validate state tax treatment, beneficiary rules, and eligibility for any rollover provisions; coordinate with financial-aid considerations.",
  },
  {
    id: "daf",
    title: "Donor-Advised Fund",
    whyThisMayApply: "Bunched giving can increase deduction efficiency",
    scenario:
      "Some households prefer to front-load charitable deductions in high-income years.\nA DAF can separate deduction timing from grant timing.",
    decisionWindow: "High income years, liquidity events, large gains.",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Coordinate AGI limits, substantiation, and gifting of appreciated assets; plan grant schedule and investment policy within the DAF.",
  },
  {
    id: "crt",
    title: "Charitable Remainder Trust",
    whyThisMayApply: "Appreciated assets + income goals",
    scenario:
      "Some donors use CRT structures to diversify appreciated assets and create income.\nThis requires careful legal and tax coordination.",
    decisionWindow: "Before a concentrated sale; requires trust setup.",
    professional: "CPA/Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Model payout, deduction, and tier accounting; coordinate with attorney on trust drafting and compliance; evaluate suitability vs alternatives.",
  },
  {
    id: "exchange1031",
    title: "1031 Exchange",
    whyThisMayApply: "Real estate gain deferral may be relevant",
    scenario:
      "Investment real estate sales can potentially defer gain via like-kind exchange.\nTiming rules are strict.",
    decisionWindow: "At sale; requires qualified intermediary and deadlines.",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm property eligibility, deadlines, and intermediary requirements; model depreciation recapture and replacement property basis implications.",
  },
  {
    id: "rentalLossRules",
    title: "Rental Loss Rules Review",
    whyThisMayApply: "Rental losses may be limited or unlocked",
    scenario:
      "Rental losses can be restricted under passive activity rules.\nSome circumstances change deductibility and carryforwards.",
    decisionWindow: "Annually; especially with rental growth or role changes.",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Evaluate active participation thresholds, MAGI phaseouts, and real estate professional/material participation tests; track suspended losses.",
  },
  {
    id: "conservationEasement",
    title: "Conservation Easement",
    whyThisMayApply: "Land assets may support conservation planning",
    scenario:
      "Certain property owners explore conservation easements for charitable objectives.\nCompliance and valuation standards are strict.",
    decisionWindow: "Before development decisions; requires specialized counsel.",
    professional: "CPA/Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Engage qualified appraisal and legal review; assess IRS scrutiny and avoid syndicated abusive structures; ensure substantiation is robust.",
  },
  {
    id: "opportunityZones",
    title: "Opportunity Zone Review",
    whyThisMayApply: "Large capital gains may prompt deferral discussions",
    scenario:
      "Some investors reinvest eligible gains through Qualified Opportunity Funds.\nRules and outcomes depend on structure and holding period.",
    decisionWindow: "Within statutory reinvestment deadlines after a gain event.",
    professional: "CPA",
    impact: "Advanced",
    cpaSummary:
      "Confirm gain eligibility, deadlines, fund documentation, and exit planning; evaluate concentration and underlying investment risk.",
    cta: "Worth discussing",
  },
  {
    id: "installmentSales",
    title: "Installment Sale Planning",
    whyThisMayApply: "Spreading gain may reduce bracket spikes",
    scenario:
      "Business or property sales may be structured to recognize gains over time.\nThis can alter bracket exposure and surtaxes.",
    decisionWindow: "Before sale terms are finalized.",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Model interest component, basis recovery, and credit risk; coordinate contract terms and consider interaction with NIIT and state taxes.",
  },
  {
    id: "qsbs1202",
    title: "QSBS (Section 1202) Check",
    whyThisMayApply: "Qualified C-corp equity may allow exclusion",
    scenario:
      "Some founders/investors hold stock that may qualify for Section 1202 treatment.\nEligibility is technical and time-based.",
    decisionWindow: "Before liquidation or secondary sale events.",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm original issuance, active business tests, holding period, and limitations; document corporate records supporting qualification.",
  },
  {
    id: "nqdc",
    title: "Nonqualified Deferred Compensation",
    whyThisMayApply: "Income timing may be controllable through employer plans",
    scenario:
      "Some executives can defer compensation into future years.\nThis can shift taxable income across retirement or lower-income periods.",
    decisionWindow: "Elections must be made before the earning period.",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm plan election timing, payout schedule, and risk of employer credit exposure; model bracket effects and state residency considerations.",
  },
  {
    id: "flpIncomeShift",
    title: "Family Entity & Income Shifting",
    whyThisMayApply: "Business or family assets may need structure review",
    scenario:
      "Some families use entities to coordinate control, gifting, and administration.\nTax and estate outcomes depend on details and valuation.",
    decisionWindow: "Before large gifts, liquidity events, or restructuring.",
    professional: "CPA/Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Coordinate valuation, documentation, and gifting strategy; confirm governance and economic substance to reduce audit risk.",
  },
  {
    id: "homeSaleExclusion",
    title: "Primary Home Sale Exclusion",
    whyThisMayApply: "Home sale gains may be partially excludable",
    scenario:
      "Selling a primary residence can allow gain exclusion if tests are met.\nTiming and use rules drive eligibility.",
    decisionWindow: "Before listing or changing residency status.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm ownership/use tests and partial exclusion eligibility; coordinate with relocation, divorce, or care facility transitions.",
  },
  {
    id: "depreciationRecapture",
    title: "Depreciation & Recapture Planning",
    whyThisMayApply: "Real estate sales may trigger recapture",
    scenario:
      "Depreciation lowers taxable income but can be recaptured at sale.\nPlanning can reduce surprise tax bills.",
    decisionWindow: "Before selling rental or business property.",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary:
      "Quantify depreciation history, recapture exposure, and options (timing, exchange, offsetting losses); coordinate with transaction structure.",
  },
  {
    id: "spousalIra",
    title: "Spousal IRA Contribution",
    whyThisMayApply: "One-earner households may have additional capacity",
    scenario:
      "In some cases, a nonworking spouse may still be eligible for IRA contributions.\nEligibility depends on income and filing status.",
    decisionWindow: "Each tax year before contribution deadlines.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm earned income requirements and contribution limits; coordinate deductibility rules and Roth eligibility.",
  },
  {
    id: "saversCredit",
    title: "Saver’s Credit Check",
    whyThisMayApply: "Some incomes qualify for retirement contribution credits",
    scenario:
      "Certain taxpayers may qualify for a retirement savings credit.\nEligibility is income-based and time-sensitive.",
    decisionWindow: "Each tax year; best identified during tax planning.",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary:
      "Confirm filing status thresholds and qualifying contributions; coordinate to maximize credit eligibility where appropriate.",
  },
  {
    id: "lifeInsurancePlanning",
    title: "Life Insurance Planning Review",
    whyThisMayApply: "Some estate or liquidity plans involve insurance structures",
    scenario:
      "Insurance can be used for risk management and estate liquidity in certain plans.\nSuitability depends on objectives and costs.",
    decisionWindow: "Before major estate decisions; requires underwriting lead time.",
    professional: "CPA/Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Assess need, ownership structure (incl. trust ownership), premium schedule, and MEC risk; coordinate estate inclusion and liquidity objectives.",
  },
  {
    id: "dynastyTrust",
    title: "Dynasty Trust Consideration",
    whyThisMayApply: "Multi-generation planning may be relevant",
    scenario:
      "Some families plan for multi-generation wealth transfer structures.\nImplementation depends on exemptions, state law, and objectives.",
    decisionWindow: "Best evaluated during estate planning cycles.",
    professional: "CPA/Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary:
      "Coordinate GST/exemption planning, situs selection, trustee design, and distribution standards; align with family governance goals.",
  },
];

type TriggerRule = {
  id: StrategyId;
  any?: Array<(p: Persona) => boolean>;
  all?: Array<(p: Persona) => boolean>;
  reasons: Array<(p: Persona) => string | null>;
  confidence: (p: Persona) => TriggerResult["confidence"];
};

const inRetirementRange = (p: Persona, ...ranges: Persona["retirementRange"][]) =>
  ranges.includes(p.retirementRange);

const RULES: TriggerRule[] = [
  {
    id: "rothConversions",
    any: [
      (p) => p.employment === "Unemployed",
      (p) => p.employment === "Consulting",
      (p) => p.ageBand === "55-59" || p.ageBand === "60-65",
    ],
    all: [(p) => inRetirementRange(p, "250k-500k", "500k-1M", "1M-2.5M", "2.5M-5M", "5M+")],
    reasons: [
      (p) => (p.employment === "Unemployed" ? "Income timing may be temporarily lower." : null),
      (p) => (p.employment === "Consulting" ? "Variable income can create planning windows." : null),
      (p) => ((p.ageBand === "55-59" || p.ageBand === "60-65") ? "Approaching distribution years increases timing sensitivity." : null),
    ],
    confidence: (p) =>
      p.employment === "Unemployed" ? "High" : p.employment === "Consulting" ? "Medium" : "Low",
  },
  {
    id: "nua",
    all: [(p) => !!p.hasEmployerStockIn401k],
    reasons: [(p) => (p.hasEmployerStockIn401k ? "Employer stock inside a qualified plan may have special tax treatment." : null)],
    confidence: () => "High",
  },
  {
    id: "taxLossHarvesting",
    all: [(p) => !!p.hasTaxableBrokerage],
    reasons: [(p) => (p.hasTaxableBrokerage ? "Taxable accounts may allow loss harvesting during volatility." : null)],
    confidence: () => "Medium",
  },
  {
    id: "exchange1031",
    all: [(p) => p.realEstate === "Rental"],
    reasons: [(p) => (p.realEstate === "Rental" ? "Selling investment property can raise gain-deferral questions." : null)],
    confidence: () => "Medium",
  },
];

export function evaluateStrategies(persona: Persona): TriggerResult[] {
  const results: TriggerResult[] = [];
  const seen = new Set<StrategyId>();

  for (const rule of RULES) {
    const anyOk = rule.any ? rule.any.some((fn) => fn(persona)) : true;
    const allOk = rule.all ? rule.all.every((fn) => fn(persona)) : true;

    const matched = anyOk && allOk;
    const reasons = rule.reasons.map((fn) => fn(persona)).filter((x): x is string => !!x);

    if (matched) {
      results.push({
        strategyId: rule.id,
        matched,
        reasons,
        confidence: rule.confidence(persona),
      });
      seen.add(rule.id);
    }
  }

  return results;
}
