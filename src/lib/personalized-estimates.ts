/**
 * Calculate personalized savings estimates based on user profile
 */

import type { RetirementRange } from "@/types/persona";

// Get approximate asset value from retirement range
export function getAssetValueFromRange(range: RetirementRange): number {
  const rangeMap: Record<string, number> = {
    "<250k": 175000,
    "250k-500k": 375000,
    "500k-1M": 750000,
    "500k-1m": 750000,
    "1M-2.5M": 1750000,
    "1m-2.5m": 1750000,
    "2.5M-5M": 3750000,
    "2.5m-5m": 3750000,
    "5M+": 6000000,
    ">5m": 6000000,
  };
  return rangeMap[range] || 500000;
}

export interface PersonalizedEstimate {
  lowEstimate: number;
  highEstimate: number;
  explanation: string;
}

/**
 * Calculate personalized savings estimate for a strategy based on user's assets
 */
export function calculatePersonalizedEstimate(
  strategyId: string, 
  retirementRange: RetirementRange,
  age: number
): PersonalizedEstimate {
  const assets = getAssetValueFromRange(retirementRange);
  
  // Strategy-specific calculations
  switch (strategyId) {
    case 'roth-conversion': {
      // Assume converting 8% of assets per year for 10 years
      // Tax savings of 10-15% on converted amount (bracket arbitrage)
      const convertible = assets * 0.7; // Assume 70% is in pre-tax
      const annualConversion = convertible / 10;
      const taxSavingsRate = 0.10; // 10% bracket arbitrage
      const yearsToConvert = Math.min(10, 73 - age); // Until RMDs
      const lowEstimate = annualConversion * taxSavingsRate * yearsToConvert * 0.7;
      const highEstimate = annualConversion * 0.15 * yearsToConvert * 1.2;
      return {
        lowEstimate: Math.round(lowEstimate / 1000) * 1000,
        highEstimate: Math.round(highEstimate / 1000) * 1000,
        explanation: `Converting ~$${(annualConversion / 1000).toFixed(0)}k/year at lower rates before RMDs`
      };
    }
    
    case 'rmd-minimization': {
      // RMDs at 4% growing to 8% over retirement
      // Strategies can reduce effective tax by 15-25%
      const rmdBase = assets * 0.04;
      const yearsOfRmds = 20;
      const taxSaved = rmdBase * yearsOfRmds * 0.15;
      return {
        lowEstimate: Math.round(taxSaved * 0.6 / 1000) * 1000,
        highEstimate: Math.round(taxSaved * 1.5 / 1000) * 1000,
        explanation: `Reducing taxable RMDs through strategic planning over ${yearsOfRmds} years`
      };
    }
    
    case 'qcd': {
      // Assume 2% of assets annually to charity
      // Tax savings at 22-32% bracket
      const annualQcd = Math.min(assets * 0.02, 105000);
      const taxRate = assets > 1000000 ? 0.28 : 0.22;
      const lowEstimate = annualQcd * taxRate * 10;
      const highEstimate = annualQcd * 0.32 * 15;
      return {
        lowEstimate: Math.round(lowEstimate / 1000) * 1000,
        highEstimate: Math.round(highEstimate / 1000) * 1000,
        explanation: `QCDs of ~$${(annualQcd / 1000).toFixed(0)}k/year excluded from taxable income`
      };
    }
    
    case 'asset-location': {
      // 0.2-0.5% annual benefit
      const lowEstimate = assets * 0.002 * 15;
      const highEstimate = assets * 0.005 * 20;
      return {
        lowEstimate: Math.round(lowEstimate / 1000) * 1000,
        highEstimate: Math.round(highEstimate / 1000) * 1000,
        explanation: `0.2-0.5% annual after-tax return improvement on $${(assets / 1000000).toFixed(1)}M`
      };
    }
    
    case 'tax-loss-harvesting': {
      // Assume 5% of taxable assets can be harvested annually
      const taxableAssets = assets * 0.4; // 40% in taxable
      const harvestable = taxableAssets * 0.05;
      const lowEstimate = harvestable * 0.15 * 10;
      const highEstimate = harvestable * 0.238 * 15;
      return {
        lowEstimate: Math.round(lowEstimate / 1000) * 1000,
        highEstimate: Math.round(highEstimate / 1000) * 1000,
        explanation: `Harvesting ~$${(harvestable / 1000).toFixed(0)}k in losses annually to offset gains`
      };
    }
    
    case 'hsa': {
      // Max contribution ($8,300 family) for years until 65
      const yearsToContribute = Math.max(0, 65 - age);
      const contribution = 8300;
      const totalContributed = contribution * yearsToContribute;
      const taxSavings = totalContributed * 0.30; // Tax savings rate
      const growth = totalContributed * 0.5; // Estimated growth
      return {
        lowEstimate: Math.round(taxSavings / 1000) * 1000,
        highEstimate: Math.round((taxSavings + growth) / 1000) * 1000,
        explanation: `${yearsToContribute} years of max HSA contributions with triple tax advantage`
      };
    }
    
    case '1031-exchange': {
      // Assume real estate = 30% of assets with 50% gain
      const realEstateValue = assets * 0.3;
      const embeddedGain = realEstateValue * 0.5;
      const taxDeferred = embeddedGain * 0.238;
      return {
        lowEstimate: Math.round(taxDeferred * 0.6 / 1000) * 1000,
        highEstimate: Math.round(taxDeferred * 1.2 / 1000) * 1000,
        explanation: `Deferring tax on ~$${(embeddedGain / 1000).toFixed(0)}k in property gains`
      };
    }
    
    case 'backdoor-roth': {
      const years = Math.max(0, 70 - age);
      const annualContribution = 7000;
      const growth = annualContribution * years * 0.5; // Estimated growth
      const taxFreeGrowth = growth * 0.24;
      return {
        lowEstimate: Math.round(taxFreeGrowth * 0.7 / 1000) * 1000,
        highEstimate: Math.round(taxFreeGrowth * 1.5 / 1000) * 1000,
        explanation: `${years} years of $7,000 annual contributions growing tax-free`
      };
    }
    
    default: {
      // Generic estimate based on assets
      const baseEstimate = assets * 0.02;
      return {
        lowEstimate: Math.round(baseEstimate * 0.5 / 1000) * 1000,
        highEstimate: Math.round(baseEstimate * 2 / 1000) * 1000,
        explanation: `Estimated based on your asset level`
      };
    }
  }
}

export function formatEstimate(estimate: PersonalizedEstimate): string {
  const formatNum = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
    return `$${n}`;
  };
  
  return `${formatNum(estimate.lowEstimate)} - ${formatNum(estimate.highEstimate)}`;
}
