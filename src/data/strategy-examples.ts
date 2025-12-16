/**
 * Rich strategy examples with concrete dollar savings
 * Based on real-world scenarios for $250k-$5M portfolios
 */

export interface StrategyExample {
  scenario: string;
  potentialSavings: string;
  timeframe: string;
  whoShouldConsider: string[];
}

export const strategyExamples: Record<string, StrategyExample> = {
  'roth-conversion': {
    scenario: "A couple, age 60, retired with $1M in traditional IRAs, converts $80k/year for 10 years at 22% tax rate. Instead of facing 32%+ rates on forced RMDs in their 70s, they pay tax now at lower rates.",
    potentialSavings: "$120,000 - $200,000+ lifetime",
    timeframe: "Best done ages 60-72, before RMDs begin",
    whoShouldConsider: [
      "Those in lower-income years (early retirement, gap years)",
      "Anyone expecting higher future tax brackets",
      "Those wanting to reduce future RMD impact on Medicare premiums"
    ]
  },
  'backdoor-roth': {
    scenario: "High earner contributes $7,000 to non-deductible traditional IRA, then immediately converts to Roth. Done annually for 20 years with 7% growth.",
    potentialSavings: "$50,000 - $100,000+ in tax-free growth",
    timeframe: "Annual opportunity until retirement",
    whoShouldConsider: [
      "Income above Roth contribution limits ($161k single, $240k married)",
      "Those without large existing traditional IRA balances (pro-rata rule)",
      "High earners wanting Roth access"
    ]
  },
  'mega-backdoor-roth': {
    scenario: "Executive maxes 401(k) at $23,000, then adds $30,000 in after-tax contributions with immediate Roth conversion. Over 10 years: $300,000+ into Roth accounts.",
    potentialSavings: "$150,000 - $300,000+ in tax-free growth",
    timeframe: "While employed with eligible 401(k) plan",
    whoShouldConsider: [
      "Employees with 401(k) plans allowing after-tax contributions",
      "High earners already maxing regular 401(k)",
      "Those seeking to maximize Roth savings beyond normal limits"
    ]
  },
  'rmd-minimization': {
    scenario: "Retiree with $1M IRA faces $40,000 RMDs at 73. Through strategic Roth conversions and QCDs, they reduce RMDs by 30-40%, keeping income in lower brackets.",
    potentialSavings: "$100,000 - $300,000+ over retirement",
    timeframe: "Planning should begin 5-10 years before age 73",
    whoShouldConsider: [
      "Those with $500k+ in traditional retirement accounts",
      "Anyone concerned about future tax bracket creep",
      "Those wanting to avoid Medicare premium surcharges (IRMAA)"
    ]
  },
  'qcd': {
    scenario: "Retiree, age 73, has $40,000 RMD and normally gives $15,000/year to charity. By doing a QCD, the $15,000 goes directly to charity from IRA, satisfying RMD but excluded from taxable income.",
    potentialSavings: "$5,000 - $15,000+ annually",
    timeframe: "Available after age 70½, up to $105,000/year",
    whoShouldConsider: [
      "Charitably inclined individuals age 70½+",
      "Those who don't itemize (still get benefit)",
      "Anyone wanting to reduce AGI to avoid IRMAA/Social Security taxation"
    ]
  },
  'qlac': {
    scenario: "Investor uses $130,000 from IRA to purchase QLAC that begins payments at age 85. That amount is excluded from RMD calculations until payout begins.",
    potentialSavings: "$30,000 - $80,000 in deferred taxes",
    timeframe: "Best purchased in early 70s",
    whoShouldConsider: [
      "Those with longevity in their family history",
      "Anyone wanting to reduce RMDs in early retirement years",
      "Those seeking guaranteed late-life income"
    ]
  },
  'nua': {
    scenario: "Employee's 401(k) holds $500k of employer stock with $100k cost basis. Using NUA: pays ordinary income tax on $100k basis, then $400k appreciation is taxed at 15-20% capital gains rate instead of 32-37% ordinary income.",
    potentialSavings: "$60,000 - $100,000+",
    timeframe: "One-time opportunity at separation from service",
    whoShouldConsider: [
      "Those with highly appreciated employer stock in 401(k)",
      "Recent retirees or those changing jobs",
      "Anyone with $50k+ of NUA in employer stock"
    ]
  },
  'asset-location': {
    scenario: "Investor with $1.5M across taxable, IRA, and Roth accounts. Places bonds in IRA (sheltering interest), index funds in taxable (qualified dividends), and high-growth assets in Roth (tax-free growth).",
    potentialSavings: "0.2% - 0.5% additional return annually ($30,000 - $150,000+ over 20 years)",
    timeframe: "Ongoing optimization",
    whoShouldConsider: [
      "Anyone with investments in multiple account types",
      "Those with $250k+ in total investments",
      "Investors with mix of taxable and tax-advantaged accounts"
    ]
  },
  'tax-loss-harvesting': {
    scenario: "Investor harvests $50,000 of losses during market downturn by selling underperforming funds and reinvesting in similar (not identical) alternatives. Offsets $50,000 gain from property sale.",
    potentialSavings: "$7,500 - $12,000 per $50k harvested",
    timeframe: "Year-round, especially during market declines",
    whoShouldConsider: [
      "Those with taxable brokerage accounts",
      "Anyone with realized capital gains to offset",
      "Investors in higher tax brackets"
    ]
  },
  'cost-basis-planning': {
    scenario: "Selling 200 shares with mixed cost basis lots ($10 to $45). Choosing highest-basis lots ($45) instead of FIFO ($10) reduces taxable gain from $8,000 to $1,000.",
    potentialSavings: "$1,000 - $10,000+ per significant sale",
    timeframe: "At each investment sale decision",
    whoShouldConsider: [
      "Those with taxable investment accounts",
      "Anyone selling appreciated positions",
      "Investors who've bought shares at different times/prices"
    ]
  },
  'municipal-bonds': {
    scenario: "High-bracket investor (35% federal + 5% state) holds $500k in taxable bonds yielding 5%. Switching to high-quality munis yielding 3.8% provides higher after-tax income.",
    potentialSavings: "$5,000 - $15,000+ annually in tax-equivalent yield advantage",
    timeframe: "Ongoing for fixed-income allocation",
    whoShouldConsider: [
      "Investors in 32%+ tax brackets",
      "Those in high-tax states (CA, NY, NJ)",
      "Anyone with significant fixed-income in taxable accounts"
    ]
  },
  'hsa': {
    scenario: "Family contributes max (~$8,300/year) to HSA for 20 years, investing rather than spending. By age 65: $250k+ tax-free bucket for medical expenses, Medicare premiums, or long-term care.",
    potentialSavings: "$100,000 - $200,000+ in triple tax advantage",
    timeframe: "While enrolled in high-deductible health plan (before age 65)",
    whoShouldConsider: [
      "Those with high-deductible health plans",
      "Anyone under age 65 who can pay medical costs from other funds",
      "Those wanting additional tax-advantaged retirement savings"
    ]
  },
  '529-planning': {
    scenario: "Grandparents have $200k in 529 for grandchild. New FAFSA rules mean distributions won't hurt financial aid. Unused funds can roll to grandchild's Roth IRA (up to $35k lifetime).",
    potentialSavings: "$50,000 - $100,000+ in tax-free growth",
    timeframe: "Best started early for maximum compounding",
    whoShouldConsider: [
      "Parents/grandparents planning for education costs",
      "Those wanting tax-free growth for education",
      "Families wanting flexibility (new 529-to-Roth option)"
    ]
  },
  'daf': {
    scenario: "High-income year: donate $150k of appreciated stock (basis $50k) to DAF. Avoid $24k capital gains tax, get $150k deduction saving ~$55k in income tax. Grant to charities over 10+ years.",
    potentialSavings: "$20,000 - $80,000+ in combined tax benefits",
    timeframe: "Best in high-income years; grants spread over time",
    whoShouldConsider: [
      "Those who itemize deductions",
      "Anyone with appreciated stock or assets",
      "Those wanting to 'bunch' charitable giving"
    ]
  },
  'crt': {
    scenario: "Client with $1M stock (basis $100k) creates CRT. Trust sells stock tax-free, invests full $1M. Client receives 5%/year income (~$50k), gets ~$300k deduction, charity receives remainder.",
    potentialSavings: "$200,000 - $400,000+ (avoided capital gains + deduction)",
    timeframe: "Irrevocable; best with highly appreciated assets",
    whoShouldConsider: [
      "Those with $500k+ in highly appreciated assets",
      "Anyone wanting income plus charitable impact",
      "Investors reluctant to sell due to embedded gains"
    ]
  },
  '1031-exchange': {
    scenario: "Sell rental property with $500k gain. Instead of paying ~$100k+ in federal/state taxes, do 1031 exchange into $1.2M apartment building. Full equity continues working; tax deferred indefinitely.",
    potentialSavings: "$100,000 - $500,000+ deferred (or eliminated if held until death)",
    timeframe: "45-day identification, 180-day closing deadlines",
    whoShouldConsider: [
      "Investment real estate owners considering selling",
      "Those wanting to reposition real estate holdings",
      "Investors seeking to defer/eliminate capital gains"
    ]
  },
  'rental-loss-reps': {
    scenario: "Couple: one spouse is real estate professional (800+ hours/year). Rental properties generate $100k paper loss (depreciation). Loss fully offsets high-earning spouse's income, saving ~$37,000 in taxes.",
    potentialSavings: "$10,000 - $50,000+ annually",
    timeframe: "Annual qualification required",
    whoShouldConsider: [
      "Those with spouse able to spend 750+ hours on real estate",
      "Owners of multiple rental properties",
      "High earners with rental real estate"
    ]
  },
  'depreciation-recapture': {
    scenario: "Commercial building with $300k accumulated depreciation. Plan sale via 1031 exchange to defer the $75k depreciation recapture tax (25% rate), or hold until death for step-up basis.",
    potentialSavings: "$50,000 - $150,000+ in deferred/eliminated recapture",
    timeframe: "Planning before property sale",
    whoShouldConsider: [
      "Investment property owners considering sale",
      "Those with significant accumulated depreciation",
      "Anyone planning real estate exit strategy"
    ]
  },
  'primary-residence-exclusion': {
    scenario: "Couple sells home for $1M (bought for $400k). Of $600k gain, $500k is excluded tax-free. Only $100k is taxable (~$15k tax instead of ~$90k without exclusion).",
    potentialSavings: "$75,000 - $120,000 on typical home sale",
    timeframe: "Must own and live in home 2 of last 5 years",
    whoShouldConsider: [
      "Homeowners with significant appreciation",
      "Those planning to downsize",
      "Anyone who's lived in their home 2+ years"
    ]
  },
  'opportunity-zone': {
    scenario: "Investor rolls $500k capital gain into Qualified Opportunity Fund. Defers original gain until 2026, and if held 10+ years, pays zero tax on new appreciation in the OZ investment.",
    potentialSavings: "$100,000 - $200,000+ in deferred/excluded gains",
    timeframe: "Must invest within 180 days of gain realization",
    whoShouldConsider: [
      "Those with realized capital gains",
      "Long-term investors (10+ year horizon)",
      "Anyone interested in economic development investing"
    ]
  },
  'installment-sale': {
    scenario: "Sell business for $2M gain. Instead of 20%+ tax in one year (~$400k), structure as 10-year installment. Report $200k/year, staying in 15% bracket. Save ~$100k+ over the decade.",
    potentialSavings: "$50,000 - $200,000+ through bracket management",
    timeframe: "Structured at time of sale",
    whoShouldConsider: [
      "Business owners selling their company",
      "Those selling real estate privately",
      "Anyone with large gain that would spike their bracket"
    ]
  },
  'qsbs': {
    scenario: "Founder invests $200k in qualifying C-corp startup. After 5+ years, sells for $3M. The $2.8M gain is 100% excluded from federal tax (up to $10M limit). Saves ~$670,000 in taxes.",
    potentialSavings: "$100,000 - $1,000,000+ (up to $10M gain excluded)",
    timeframe: "Must hold stock 5+ years from issuance",
    whoShouldConsider: [
      "Startup founders and early employees",
      "Angel investors in qualifying small businesses",
      "Anyone with original-issue stock in active C-corps under $50M"
    ]
  },
  'nqdc': {
    scenario: "Executive in 37% bracket defers $100k/year for 5 years. In retirement, distributions taxed at 24%. Saves 13% on $500k = ~$65,000 in federal taxes plus tax-deferred growth.",
    potentialSavings: "$50,000 - $150,000+ through bracket arbitrage",
    timeframe: "Must elect before year income is earned",
    whoShouldConsider: [
      "Executives with access to deferred comp plans",
      "High earners expecting lower retirement tax bracket",
      "Those comfortable with employer credit risk"
    ]
  },
  'flp': {
    scenario: "Parents transfer $5M property portfolio into FLP. Gift 40% LP interests to trusts for children at discounted values (~$1.4M vs $2M). Future growth accrues outside parents' estate.",
    potentialSavings: "$500,000 - $2,000,000+ in estate taxes",
    timeframe: "Best implemented well before estate transfer",
    whoShouldConsider: [
      "Those with $5M+ in assets",
      "Families with operating businesses or real estate",
      "Anyone concerned about estate tax exposure"
    ]
  },
  'dynasty-trust': {
    scenario: "Family funds trust with $5M (using lifetime exemption). Assets grow to $20M over generations. Without trust: 40% estate tax at each generation. With trust: growth passes tax-free to descendants.",
    potentialSavings: "$2,000,000 - $10,000,000+ over multiple generations",
    timeframe: "Long-term (multi-generational)",
    whoShouldConsider: [
      "Those with estates above exemption amount ($13.61M in 2024)",
      "Families wanting to preserve wealth across generations",
      "Anyone in states with favorable trust laws"
    ]
  },
  'spousal-ira': {
    scenario: "One-earner couple contributes $7,000 to working spouse's IRA plus $7,000 to non-working spouse's spousal IRA. Double the retirement savings with same household income.",
    potentialSavings: "$3,000 - $5,000+ annually in tax benefits",
    timeframe: "Annual opportunity while one spouse has no earned income",
    whoShouldConsider: [
      "Married couples with one working spouse",
      "Families with a stay-at-home parent",
      "Those wanting to maximize household retirement savings"
    ]
  },
  'conservation-easement': {
    scenario: "Landowner places conservation easement on 100 acres, reducing value from $4M to $2.5M. Charitable deduction of $1.5M provides ~$500k+ in income tax savings over multiple years.",
    potentialSavings: "$200,000 - $1,000,000+ in income tax",
    timeframe: "Permanent restriction; deduction over up to 16 years",
    whoShouldConsider: [
      "Owners of significant land holdings",
      "Those with conservation or environmental goals",
      "High-income individuals seeking large deductions (note: IRS scrutiny is high)"
    ]
  }
};

export function getStrategyExample(strategyId: string): StrategyExample | null {
  return strategyExamples[strategyId] || null;
}
