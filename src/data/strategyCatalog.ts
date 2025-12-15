
import { Persona, Strategy, StrategyId, TriggerResult } from "@/types/persona";

export const STRATEGIES: Record<StrategyId, Strategy> = {
  rothConversions: {
    id: "rothConversions",
    title: "Roth Conversions",
    whyThisMayApply: "Low income years are ideal for locking in low tax rates.",
    scenario: "Pay taxes now at a lower rate to enjoy tax-free growth forever.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Evaluate Roth conversion opportunities given current marginal tax bracket vs. future expectations.",
  },
  backdoorRoth: {
    id: "backdoorRoth",
    title: "Backdoor Roth IRA",
    whyThisMayApply: "High income prevents direct Roth contributions, but this loophole works.",
    scenario: "Contribute to a Traditional IRA, then convert to Roth immediately.",
    decisionWindow: "Tax deadline (April 15)",
    professional: "CPA + CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Confirm no pro-rata rule issues (existing pre-tax IRA balances) before executing Backdoor Roth.",
  },
  megaBackdoorRoth: {
    id: "megaBackdoorRoth",
    title: "Mega Backdoor Roth",
    whyThisMayApply: "Your 401(k) plan allows substantial extra after-tax contributions.",
    scenario: "Supercharge your Roth savings beyond standard limits.",
    decisionWindow: "Year-round",
    professional: "CPA + CFP",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Review 401(k) plan document for after-tax contribution and in-service withdrawal/conversion features.",
  },
  rmdQcd: {
    id: "rmdQcd",
    title: "RMDs & QCDs",
    whyThisMayApply: "You are approaching or past RMD age with charitable intent.",
    scenario: "Donate directly from your IRA to satisfy RMDs without raising taxable income.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Utilize Qualified Charitable Distributions (QCDs) to satisfy RMDs and lower AGI.",
  },
  qlac: {
    id: "qlac",
    title: "QLAC",
    whyThisMayApply: "You want to defer RMDs and ensure longevity protection.",
    scenario: "Move IRA funds to a longevity annuity to delay taxes until age 85.",
    decisionWindow: "Year-round",
    professional: "CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Consider QLAC purchase to reduce current RMD obligation and provide longevity insurance.",
  },
  nua: {
    id: "nua",
    title: "Net Unrealized Appreciation (NUA)",
    whyThisMayApply: "You have highly appreciated company stock in your 401(k).",
    scenario: "Pay lower capital gains rates on stock appreciation instead of income tax.",
    decisionWindow: "Upon distribution",
    professional: "CPA + CFP",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Evaluate NUA treatment for employer stock distribution vs. rollover to IRA.",
  },
  assetLocation: {
    id: "assetLocation",
    title: "Asset Location",
    whyThisMayApply: "You have a mix of taxable and tax-advantaged accounts.",
    scenario: "Place bonds in IRAs and stocks in brokerage to minimize tax drag.",
    decisionWindow: "Year-round",
    professional: "CFP",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Optimize asset location: high-yield assets in tax-deferred, high-growth in Roth/Taxable.",
  },
  taxLossHarvesting: {
    id: "taxLossHarvesting",
    title: "Tax-Loss Harvesting",
    whyThisMayApply: "You have a taxable brokerage account with market exposure.",
    scenario: "Sell losing investments to offset gains and up to $3,000 of income.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Harvest capital losses to offset gains and up to $3k of ordinary income annually.",
  },
  costBasisPlanning: {
    id: "costBasisPlanning",
    title: "Cost Basis Planning",
    whyThisMayApply: "You intend to leave assets to heirs.",
    scenario: "Hold appreciated assets until death to reset their tax basis.",
    decisionWindow: "Lifetime",
    professional: "Estate Attorney",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Preserve low-basis assets for step-up in basis at death.",
  },
  muniBonds: {
    id: "muniBonds",
    title: "Municipal Bonds",
    whyThisMayApply: "You are in a high tax bracket.",
    scenario: "Earn tax-free income from state and local government bonds.",
    decisionWindow: "Year-round",
    professional: "CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Compare tax-equivalent yield of munis vs. taxable bonds given marginal tax rate.",
  },
  hsa: {
    id: "hsa",
    title: "HSA Optimization",
    whyThisMayApply: "You have access to a High Deductible Health Plan.",
    scenario: "Triple tax advantage: tax-free in, growth, and out for health.",
    decisionWindow: "Tax deadline (April 15)",
    professional: "CFP",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Maximize HSA contribution; invest funds for long-term tax-free growth.",
  },
  plan529: {
    id: "plan529",
    title: "529 Education Planning",
    whyThisMayApply: "You want to support education costs tax-efficiently.",
    scenario: "Grow funds tax-free for tuition, or roll over to a Roth IRA later.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Utilize 529 plans for state tax deductions (if applicable) and tax-free education growth.",
  },
  daf: {
    id: "daf",
    title: "Donor Advised Fund (DAF)",
    whyThisMayApply: "You have a high income year and charitable intent.",
    scenario: "Front-load donations now for a big deduction, distribute later.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Bunch charitable contributions via DAF to exceed standard deduction threshold.",
  },
  crt: {
    id: "crt",
    title: "Charitable Remainder Trust (CRT)",
    whyThisMayApply: "You have highly appreciated assets and want income.",
    scenario: "Sell assets tax-free, receive income for life, donate the rest.",
    decisionWindow: "Transaction-specific",
    professional: "Estate Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Model CRT benefits: immediate deduction, tax-deferral on sale, and income stream.",
  },
  exchange1031: {
    id: "exchange1031",
    title: "1031 Exchange",
    whyThisMayApply: "You own investment real estate.",
    scenario: "Swap one property for another to defer capital gains taxes indefinitely.",
    decisionWindow: "45 days post-sale",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Defer capital gains on real estate via like-kind exchange.",
  },
  rentalLossRules: {
    id: "rentalLossRules",
    title: "Rental Loss Rules (PAL)",
    whyThisMayApply: "You have rental properties generating losses.",
    scenario: "Active participation may allow you to deduct up to $25k against income.",
    decisionWindow: "Tax filing",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Review Passive Activity Loss rules; check active participation or real estate professional status.",
  },
  conservationEasement: {
    id: "conservationEasement",
    title: "Conservation Easement",
    whyThisMayApply: "You own land with development potential.",
    scenario: "Restrict development to generate a significant charitable deduction.",
    decisionWindow: "Year-end (Dec 31)",
    professional: "Estate Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Evaluate charitable deduction from conservation easement (ensure compliance with scrutiny).",
  },
  opportunityZones: {
    id: "opportunityZones",
    title: "Opportunity Zones",
    whyThisMayApply: "You have significant capital gains.",
    scenario: "Reinvest gains into distressed areas to defer and reduce taxes.",
    decisionWindow: "180 days post-sale",
    professional: "CPA + CFP",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Defer and reduce capital gains tax by investing in Qualified Opportunity Funds.",
  },
  installmentSales: {
    id: "installmentSales",
    title: "Installment Sales",
    whyThisMayApply: "You are selling a business or property.",
    scenario: "Receive payments over time to spread out tax liability.",
    decisionWindow: "Transaction-specific",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Spread gain recognition over multiple years via installment sale method.",
  },
  qsbs1202: {
    id: "qsbs1202",
    title: "QSBS (Section 1202)",
    whyThisMayApply: "You significantly invested in a small business.",
    scenario: "Ideally, enjoy 100% tax-free gain on the sale of qualified stock.",
    decisionWindow: "At investment & sale",
    professional: "CPA",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Verify criteria for Qualified Small Business Stock exclusion (up to 100% gain exclusion).",
  },
  nqdc: {
    id: "nqdc",
    title: "Deferred Compensation (NQDC)",
    whyThisMayApply: "You are a high-earning executive.",
    scenario: "Defer salary/bonus to future years to lower current tax bracket.",
    decisionWindow: "Prior year election",
    professional: "CPA + CFP",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Analyze benefit of deferring income vs. risk of unsecured creditor status.",
  },
  flpIncomeShift: {
    id: "flpIncomeShift",
    title: "Family Limited Partnership (FLP)",
    whyThisMayApply: "You own a business and want to involve family.",
    scenario: "Shift business income to family members in lower tax brackets.",
    decisionWindow: "Lifetime",
    professional: "Estate Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Utilize FLP for valuation discounts and income shifting to lower-bracket family members.",
  },
  homeSaleExclusion: {
    id: "homeSaleExclusion",
    title: "Home Sale Exclusion",
    whyThisMayApply: "You are selling your primary residence.",
    scenario: "Exclude up to $500k of gain from taxes tax-free.",
    decisionWindow: "Transaction-specific",
    professional: "CPA",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Ensure Section 121 exclusion eligibility (2 out of 5 years ownership/use test).",
  },
  depreciationRecapture: {
    id: "depreciationRecapture",
    title: "Depreciation Recapture",
    whyThisMayApply: "You are selling a rental property.",
    scenario: "Plan ahead to avoid a surprise tax bill on prior depreciation claims.",
    decisionWindow: "Transaction-specific",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Calculate potential unrecaptured Section 1250 gain tax liability on sale.",
  },
  spousalIra: {
    id: "spousalIra",
    title: "Spousal IRA",
    whyThisMayApply: "One spouse has little to no earned income.",
    scenario: "Working spouse contributes to a non-working spouse's retirement.",
    decisionWindow: "Tax deadline (April 15)",
    professional: "CFP",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Fund Spousal IRA to double household tax-advantaged savings space.",
  },
  saversCredit: {
    id: "saversCredit",
    title: "Saver's Credit",
    whyThisMayApply: "Your income is in the moderate range.",
    scenario: "Get a tax credit just for contributing to your retirement account.",
    decisionWindow: "Tax deadline (April 15)",
    professional: "CPA",
    impact: "Potential",
    cta: "Worth discussing",
    cpaSummary: "Check AGI thresholds for Retirement Savings Contributions Credit eligibility.",
  },
  lifeInsurancePlanning: {
    id: "lifeInsurancePlanning",
    title: "Life Insurance Planning",
    whyThisMayApply: "You have dependents or estate tax concerns.",
    scenario: "Provide liquidity and protection tax-free to beneficiaries.",
    decisionWindow: "Lifetime",
    professional: "CFP + Insurance",
    impact: "Material",
    cta: "Worth discussing",
    cpaSummary: "Review policy needs regarding income replacement and estate liquidity.",
  },
  dynastyTrust: {
    id: "dynastyTrust",
    title: "Dynasty Trust",
    whyThisMayApply: "You want to pass significant wealth for generations.",
    scenario: "Avoid estate taxes for multiple generations.",
    decisionWindow: "Lifetime",
    professional: "Estate Attorney",
    impact: "Advanced",
    cta: "Worth discussing",
    cpaSummary: "Establish trust to minimize transfer taxes across multiple generations (GST tax planning).",
  },
};

export function evaluateStrategies(persona: Persona): TriggerResult[] {
  const results: TriggerResult[] = [];

  // Helper to add a match
  const addMatch = (id: StrategyId, reasons: string[], confidence: "Low" | "Medium" | "High" = "Medium") => {
    results.push({
      strategyId: id,
      matched: true,
      reasons,
      confidence,
    });
  };

  const isHighNetWorth =
    persona.retirementRange === "2.5M-5M" || persona.retirementRange === "5M+";
  const isMidNetWorth =
    persona.retirementRange === "1M-2.5M" || isHighNetWorth;
  
  const isOlder = persona.ageBand === "55-59" || persona.ageBand === "60-65";
  const isYounger = !isOlder;

  // 1. Roth Conversions
  // Trigger: Lower income years (consulting, severance, unemployed) or early retirement gap
  if (
    persona.employment === "Unemployed" ||
    persona.employment === "Severance" ||
    persona.employment === "Consulting"
  ) {
    addMatch("rothConversions", ["Income may be temporarily lower due to employment status."], "High");
  } else if (isOlder && isHighNetWorth) {
    addMatch("rothConversions", ["Potential to fill lower tax brackets before RMDs begin."], "Medium");
  }

  // 2. Backdoor Roth
  // Trigger: High income (implied by high retirement savings usually)
  if (isHighNetWorth && persona.employment === "Employed") {
    addMatch(
      "backdoorRoth",
      ["High income likely limits direct Roth contributions.", "High savings rate suggests extra cash flow."],
      "High"
    );
  }

  // 3. Mega Backdoor Roth
  if (persona.hasEmployerStockIn401k || (isHighNetWorth && persona.employment === "Employed")) {
    addMatch(
      "megaBackdoorRoth",
      ["Likely access to robust 401(k) plans.", "Capacity to save beyond standard limits."],
      "Medium"
    );
  }

  // 4. RMDs & QCDs
  if (isOlder && persona.charitableGivingIntent) {
    addMatch(
      "rmdQcd",
      ["Approaching RMD age.", "Interest in charitable giving."],
      "High"
    );
  }

  // 5. QLAC
  if (isOlder && isHighNetWorth) {
    addMatch("qlac", ["Desire to defer RMD taxes further.", "Longevity protection needs."], "Medium");
  }

  // 6. NUA
  if (persona.hasEmployerStockIn401k && isOlder) {
    addMatch("nua", ["Employer stock in 401(k).", "Approaching distribution age."], "High");
  }

  // 7. Asset Location
  if (persona.hasTaxableBrokerage) {
    addMatch("assetLocation", ["Mix of taxable and tax-advantaged accounts."], "Medium");
  }

  // 8. Tax Loss Harvesting
  if (persona.hasTaxableBrokerage) {
    addMatch("taxLossHarvesting", ["Taxable account exposure."], "Medium");
  }

  // 9. Cost Basis Planning
  if (isOlder && isMidNetWorth) {
    addMatch("costBasisPlanning", ["Estate planning considerations.", "Appreciated assets over time."], "Medium");
  }

  // 10. Muni Bonds
  if (isHighNetWorth && persona.hasTaxableBrokerage) {
    addMatch("muniBonds", ["High tax bracket likely.", "Taxable account present."], "Medium");
  }

  // 11. HSA
  if (persona.hasHSA) {
    addMatch("hsa", ["Existing HSA account."], "High");
  }

  // 12. 529 Plans
  if (persona.has529) {
    addMatch("plan529", ["Existing education savings."], "High");
  } else if (isMidNetWorth && isYounger) {
    addMatch("plan529", ["Likely optimal for education saving goals."], "Low");
  }

  // 13. DAF
  if (persona.charitableGivingIntent && (isMidNetWorth || persona.employment === "Severance")) {
    // Severance often means a high income year spike
    addMatch("daf", ["Charitable intent with potential high income year."], "High");
  }

  // 14. CRT
  if (isHighNetWorth && persona.charitableGivingIntent && isOlder) {
    addMatch("crt", ["High net worth with charitable intent.", "Need for income stream."], "Medium");
  }

  // 15. 1031 Exchange
  if (persona.realEstate === "Rental") {
    addMatch("exchange1031", ["Investment real estate ownership."], "High");
  }

  // 16. Rental Loss Rules
  if (persona.realEstate === "Rental") {
    addMatch("rentalLossRules", ["Potential rental losses to manage."], "Medium");
  }

  // 17. Conservation Easement
  if (isHighNetWorth && persona.realEstate !== "None") {
    addMatch("conservationEasement", ["High income/assets.", "Potential land ownership."], "Low");
  }

  // 18. Opportunity Zones
  if (isHighNetWorth && persona.hasTaxableBrokerage) {
    addMatch("opportunityZones", ["Potential significant capital gains."], "Low");
  }

  // 19. Installment Sales
  if (persona.businessOwnerOrEquity && isOlder) {
    addMatch("installmentSales", ["Potential business exit planning."], "Medium");
  }

  // 20. QSBS
  if (persona.businessOwnerOrEquity) {
    addMatch("qsbs1202", ["Business equity ownership."], "High");
  }

  // 21. NQDC
  if (isHighNetWorth && persona.employment === "Employed") {
    addMatch("nqdc", ["Executive level income likely."], "Medium");
  }

  // 22. FLP Income Shifting
  if (persona.businessOwnerOrEquity && isHighNetWorth) {
    addMatch("flpIncomeShift", ["Business asset protection.", "Family wealth transfer."], "Medium");
  }

  // 23. Home Sale Exclusion
  if (persona.realEstate === "Primary" || persona.realEstate === "Rental") {
    addMatch("homeSaleExclusion", ["Property ownership."], "Low");
  }

  // 24. Depreciation Recapture
  if (persona.realEstate === "Rental") {
    addMatch("depreciationRecapture", ["Rental property sale planning."], "Medium");
  }

  // 25. Spousal IRA
  if (persona.maritalStatus === "Married" && (persona.employment === "Employed" || persona.employment === "Consulting")) {
    addMatch("spousalIra", ["Married with earned income.", "Potential non-working spouse."], "Medium");
  }

  // 26. Savers Credit
  if (persona.retirementRange === "<250k" && persona.employment !== "Unemployed") {
    addMatch("saversCredit", ["Lower asset base suggests income eligibility."], "Medium");
  }

  // 27. Life Insurance
  if (persona.maritalStatus === "Married" || isHighNetWorth) {
    addMatch("lifeInsurancePlanning", ["Estate protection needs."], "Medium");
  }

  // 28. Dynasty Trust
  if (isHighNetWorth && persona.planningHorizonYears && persona.planningHorizonYears > 20) {
    addMatch("dynastyTrust", ["Multi-generational wealth goals."], "Medium");
  }

  return results;
}
