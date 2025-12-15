import { PersonaStory } from '@/types/persona';

export const personaStories: PersonaStory[] = [
  // Mid-40s (45-49)
  {
    id: 'alex-46',
    name: 'Alex',
    age: 46,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: ['<250k', '250k-500k'],
    realEstateTier: ['none', '<250k'],
    narrative: 'Alex was focused on stabilizing income after a job disruption. What they didn\'t realize was that early decisions about where savings live — not just how much — quietly shape future tax flexibility.',
    whyItMatters: 'Even modest balances benefit from intentional structure.',
    unlocksStrategies: ['asset-location', 'roth-awareness', 'savers-credit']
  },
  {
    id: 'jenna-mark-47',
    name: 'Jenna & Mark',
    age: 47,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: ['500k-1m'],
    realEstateTier: ['<250k', '250k-750k'],
    narrative: 'They were saving consistently but hadn\'t connected today\'s decisions to tomorrow\'s taxes. Small structural changes in their late 40s helped avoid future bottlenecks — without changing risk.',
    whyItMatters: 'Early optimization compounds over decades.',
    unlocksStrategies: ['asset-location', 'roth-prioritization', 'charitable-awareness']
  },

  // Early 50s (50-54)
  {
    id: 'priya-52',
    name: 'Priya',
    age: 52,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: ['500k-1m', '1m-2.5m'],
    realEstateTier: ['none', '<250k'],
    narrative: 'Priya\'s income fluctuated year to year. What mattered wasn\'t optimizing every year — it was recognizing which years were unusually powerful for tax planning and acting intentionally during those windows.',
    whyItMatters: 'Timing matters more than perfection.',
    unlocksStrategies: ['roth-conversion', 'tax-loss-harvesting', 'bracket-management']
  },
  {
    id: 'luis-hannah-53',
    name: 'Luis & Hannah',
    age: 53,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: ['500k-1m', '1m-2.5m'],
    realEstateTier: ['250k-750k', '750k-2m'],
    narrative: 'When Hannah stepped away from work, household income dropped sharply. That pause created clarity. Instead of waiting for "normal" to return, they used the transition to evaluate long-term tax exposure before it hardened.',
    whyItMatters: 'Income transitions can be strategic opportunities.',
    unlocksStrategies: ['lower-income-planning', 'partial-roth-conversions', 'hsa-optimization']
  },

  // Late 50s (55-59)
  {
    id: 'daniel-58',
    name: 'Daniel',
    age: 58,
    maritalStatus: 'single',
    ageBand: '55-59',
    retirementTier: ['1m-2.5m'],
    realEstateTier: ['none', '<250k', '250k-750k'],
    narrative: 'Daniel assumed tax planning started at retirement. What changed his thinking was realizing the most flexible years often end before retirement begins.',
    whyItMatters: 'The window for action narrows faster than expected.',
    unlocksStrategies: ['roth-conversion-urgency', 'rmd-modeling', 'asset-sequencing']
  },
  {
    id: 'karen-steve-57',
    name: 'Karen & Steve',
    age: 57,
    maritalStatus: 'married',
    ageBand: '55-59',
    retirementTier: ['1m-2.5m', '2.5m-5m'],
    realEstateTier: ['750k-2m'],
    narrative: 'With income peaking and obligations declining, Karen and Steve had a narrowing window to shape future taxes. The key wasn\'t doing everything — it was choosing the right order.',
    whyItMatters: 'Sequencing decisions matters as much as the decisions themselves.',
    unlocksStrategies: ['roth-conversion', 'charitable-bunching', 'asset-location-refinement']
  },

  // 60-69
  {
    id: 'carla-andre-63',
    name: 'Carla & Andre',
    age: 63,
    maritalStatus: 'married',
    ageBand: '60-69',
    retirementTier: ['2.5m-5m', '>5m'],
    realEstateTier: ['750k-2m', '>2m'],
    narrative: 'They assumed taxes were unavoidable. What surprised them was how source selection — not spending less — materially changed outcomes.',
    whyItMatters: 'Where you draw from changes everything.',
    unlocksStrategies: ['rmd-minimization', 'qcd-education', 'nua-flag']
  },

  // 70+
  {
    id: 'robert-72',
    name: 'Robert',
    age: 72,
    maritalStatus: 'single',
    ageBand: '70+',
    retirementTier: ['1m-2.5m', '2.5m-5m', '>5m'],
    realEstateTier: ['none', '<250k', '250k-750k', '750k-2m', '>2m'],
    narrative: 'Robert didn\'t need more income — he needed fewer forced decisions. Understanding what triggered taxes gave him back control.',
    whyItMatters: 'Control over timing is the ultimate flexibility.',
    unlocksStrategies: ['rmd-qcd-logic', 'qlac-awareness', 'estate-sequencing']
  },
  {
    id: 'margaret-75',
    name: 'Margaret & Tom',
    age: 75,
    maritalStatus: 'married',
    ageBand: '70+',
    retirementTier: ['1m-2.5m', '2.5m-5m'],
    realEstateTier: ['250k-750k', '750k-2m'],
    narrative: 'They had done well saving but realized RMDs were pushing them into higher brackets. Learning about strategic giving and withdrawal sequencing opened new possibilities.',
    whyItMatters: 'It\'s never too late to optimize.',
    unlocksStrategies: ['rmd-qcd-logic', 'charitable-bunching', 'asset-location']
  }
];

export function getAgeBand(age: number): PersonaStory['ageBand'] {
  if (age >= 70) return '70+';
  if (age >= 60) return '60-69';
  if (age >= 55) return '55-59';
  if (age >= 50) return '50-54';
  return '45-49';
}

export function matchStories(profile: {
  age: number;
  maritalStatus: 'single' | 'married';
  retirementRange: string;
  realEstateRange: string;
}): PersonaStory[] {
  const ageBand = getAgeBand(profile.age);
  
  return personaStories.filter(story => {
    const ageBandMatch = story.ageBand === ageBand;
    const maritalMatch = story.maritalStatus === profile.maritalStatus;
    const retirementMatch = story.retirementTier.includes(profile.retirementRange as any);
    const realEstateMatch = story.realEstateTier.includes(profile.realEstateRange as any);
    
    // Require age band and marital status match, plus at least one financial match
    return ageBandMatch && maritalMatch && (retirementMatch || realEstateMatch);
  }).slice(0, 3); // Return max 3 stories
}
