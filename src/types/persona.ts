export type MaritalStatus = 'single' | 'married';

export type RetirementRange = 
  | '<250k' 
  | '250k-500k' 
  | '500k-1m' 
  | '1m-2.5m' 
  | '2.5m-5m'
  | '>5m';

export type RealEstateRange = 
  | 'none' 
  | '<250k' 
  | '250k-750k' 
  | '750k-2m' 
  | '>2m';

export type EmploymentStatus = 'employed' | 'unemployed' | 'retired';

export type AgeBand = '45-49' | '50-54' | '55-59' | '60-69' | '70+';

export interface UserProfile {
  firstName: string;
  age: number;
  maritalStatus: MaritalStatus;
  retirementRange: RetirementRange;
  realEstateRange: RealEstateRange;
  employmentStatus?: EmploymentStatus;
  spouseEmploymentStatus?: EmploymentStatus;
  unemploymentDuration?: string;
  expectReturnToWork?: 'yes' | 'no' | 'not-sure';
}

export interface PersonaStory {
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
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  whyForYou: string;
  impact: 'high' | 'medium' | 'low';
  requiredConditions: StrategyConditions;
}

export interface StrategyConditions {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: MaritalStatus[];
  retirementRanges?: RetirementRange[];
  realEstateRanges?: RealEstateRange[];
  employmentStatus?: EmploymentStatus[];
  requiresCharitable?: boolean;
  requiresEmployerStock?: boolean;
}
