/**
 * Strategy Scoring System
 * Instead of elimination gates, strategies are scored and shown if above threshold
 */

import type { UserProfile, RetirementRange, RealEstateRange } from '@/types/persona';

const RETIREMENT_TIER_ORDER: RetirementRange[] = ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'];
const REAL_ESTATE_TIER_ORDER: RealEstateRange[] = ['none', '<250k', '250k-750k', '750k-2m', '>2m'];

export function getRetirementTierIndex(tier: RetirementRange | undefined): number {
  if (!tier) return 1;
  return RETIREMENT_TIER_ORDER.indexOf(tier);
}

export function getRealEstateTierIndex(tier: RealEstateRange | undefined): number {
  if (!tier) return 0;
  return REAL_ESTATE_TIER_ORDER.indexOf(tier);
}

// Net worth tier determines baseline strategy relevance
export function getNetWorthScore(profile: UserProfile): number {
  const retirementIndex = getRetirementTierIndex(profile.retirementRange);
  const realEstateIndex = getRealEstateTierIndex(profile.realEstateRange);
  // Weight retirement slightly higher
  return retirementIndex * 15 + realEstateIndex * 10;
}

// Strategies that are ALWAYS relevant at certain net worth tiers
// These don't need specific triggers - they're worth discussing based on wealth alone
export const TIER_BASED_STRATEGIES: Record<string, RetirementRange[]> = {
  'roth-conversion': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'asset-location': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'tax-loss-harvesting': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'cost-basis-planning': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'municipal-bonds': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'daf': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'backdoor-roth': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'qcd': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'rmd-minimization': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'hsa': ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  '529-planning': ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'spousal-ira': ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  // Higher net worth strategies
  'mega-backdoor-roth': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'nua': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'qlac': ['1m-2.5m', '2.5m-5m', '>5m'],
  'crt': ['1m-2.5m', '2.5m-5m', '>5m'],
  'flp': ['2.5m-5m', '>5m'],
  'dynasty-trust': ['2.5m-5m', '>5m'],
  'nqdc': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'qsbs': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'opportunity-zone': ['500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'installment-sale': ['1m-2.5m', '2.5m-5m', '>5m'],
  // Real estate strategies
  '1031-exchange': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'rental-loss-reps': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'depreciation-recapture': ['250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'primary-residence-exclusion': ['<250k', '250k-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '>5m'],
  'conservation-easement': ['2.5m-5m', '>5m'],
};

// Check if strategy is relevant based on net worth tier
export function isTierRelevant(strategyId: string, retirementRange: RetirementRange): boolean {
  const relevantTiers = TIER_BASED_STRATEGIES[strategyId];
  if (!relevantTiers) return false;
  return relevantTiers.includes(retirementRange);
}

// Score bonuses for matching triggers (additive, not eliminative)
export interface TriggerScores {
  ageMatch: number;
  employmentMatch: number;
  accountTypeMatch: number;
  situationalMatch: number;
}

export function calculateTriggerScore(
  profile: UserProfile,
  triggers: Record<string, unknown> | undefined
): TriggerScores {
  if (!triggers) return { ageMatch: 10, employmentMatch: 10, accountTypeMatch: 10, situationalMatch: 10 };
  
  let ageMatch = 10; // base score
  let employmentMatch = 10;
  let accountTypeMatch = 10;
  let situationalMatch = 10;
  
  const age = profile.age;
  
  // Age scoring - bonus points for being in optimal range
  if (triggers.minAge && age >= (triggers.minAge as number)) ageMatch += 15;
  if (triggers.maxAge && age <= (triggers.maxAge as number)) ageMatch += 15;
  if (triggers.minAge && triggers.maxAge) {
    const minAge = triggers.minAge as number;
    const maxAge = triggers.maxAge as number;
    if (age >= minAge && age <= maxAge) ageMatch += 10; // bonus for being in range
  }
  
  // Employment scoring
  if (triggers.employmentStatus) {
    const statuses = triggers.employmentStatus as string[];
    if (statuses.includes(profile.employmentStatus.toLowerCase())) employmentMatch += 20;
  }
  
  // Account type scoring - each match adds points
  if (triggers.requiresPreTaxRetirement && hasPreTaxRetirement(profile)) accountTypeMatch += 15;
  if (triggers.requiresTraditionalIRA && profile.hasTraditionalIRA) accountTypeMatch += 15;
  if (triggers.requiresTaxableBrokerage && profile.hasTaxableBrokerage) accountTypeMatch += 15;
  if (triggers.requiresMultipleAccountTypes && profile.hasMultipleAccountTypes) accountTypeMatch += 10;
  if (triggers.requiresRentalRealEstate && profile.hasRentalRealEstate) accountTypeMatch += 15;
  if (triggers.requiresEmployerStock && profile.hasEmployerStock) accountTypeMatch += 15;
  if (triggers.requiresBusinessOwnership && profile.hasBusinessOwnership) accountTypeMatch += 15;
  
  // Situational scoring
  if (triggers.requiresCharitableIntent && hasCharitableIntent(profile)) situationalMatch += 20;
  if (triggers.requiresEducationFundingIntent && profile.educationFundingIntent) situationalMatch += 15;
  if (triggers.requiresHDHP && profile.enrolledInHDHP) situationalMatch += 15;
  
  return { ageMatch, employmentMatch, accountTypeMatch, situationalMatch };
}

function hasPreTaxRetirement(profile: UserProfile): boolean {
  return profile.hasTraditionalIRA === true || 
         profile.has401k === true || 
         getRetirementTierIndex(profile.retirementRange) >= 1; // $250k+ implies pre-tax
}

function hasCharitableIntent(profile: UserProfile): boolean {
  return profile.charitableGiving !== undefined && profile.charitableGiving !== 'none';
}

// Minimum score threshold for showing a strategy
export const SCORE_THRESHOLD = 40;

// Maximum number of strategies to show
export const MAX_STRATEGIES = 20;
