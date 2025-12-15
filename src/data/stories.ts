import { PersonaStory, RetirementRange, RealEstateRange } from '@/types/persona';

// Retirement tier groupings for matching
const lowRetirement: RetirementRange[] = ['<250k', '250k-500k'];
const midRetirement: RetirementRange[] = ['500k-1m'];
const highRetirement: RetirementRange[] = ['1m-2.5m', '2.5m-5m', '>5m'];

// Real estate tier groupings
const noRealEstate: RealEstateRange[] = ['none'];
const modestRealEstate: RealEstateRange[] = ['<250k', '250k-750k'];
const significantRealEstate: RealEstateRange[] = ['750k-2m', '>2m'];

export const personaStories: PersonaStory[] = [
  // ========================================
  // AGE BAND: 45-49
  // ========================================
  
  // Single | Low Retirement | No/Modest Real Estate
  {
    id: 'alex-46-single-low',
    name: 'Alex',
    age: 46,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Alex was focused on stabilizing income after a career shift. What became clear over time was that early decisions about where savings are held — not just how much — quietly shape future flexibility.',
    whyItMatters: 'Building the right structure now creates options later.',
    unlocksStrategies: ['asset-location', 'roth-awareness']
  },
  {
    id: 'sam-48-single-low',
    name: 'Sam',
    age: 48,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Sam had always prioritized paying down debt over aggressive saving. Approaching 50, the question shifted from "how much" to "where" — understanding that account types matter as much as balances.',
    whyItMatters: 'The right foundation supports everything that follows.',
    unlocksStrategies: ['asset-location', 'contribution-strategy']
  },

  // Single | Low Retirement | Significant Real Estate
  {
    id: 'taylor-47-single-low-re',
    name: 'Taylor',
    age: 47,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Taylor had built equity in property but hadn\'t focused as much on retirement accounts. The interplay between real estate and retirement savings added layers to consider — not complications, but dimensions.',
    whyItMatters: 'Different asset types create different planning considerations.',
    unlocksStrategies: ['asset-location', 'real-estate-awareness']
  },

  // Single | Mid Retirement | Any Real Estate
  {
    id: 'jordan-46-single-mid',
    name: 'Jordan',
    age: 46,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: midRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Jordan had been consistent with contributions for years. The realization came that the next decade would shape not just how much was saved, but how efficiently it could be accessed later.',
    whyItMatters: 'Consistency creates opportunity for optimization.',
    unlocksStrategies: ['asset-location', 'roth-awareness', 'bracket-management']
  },

  // Single | High Retirement | No/Modest Real Estate
  {
    id: 'casey-48-single-high',
    name: 'Casey',
    age: 48,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Casey had accumulated significant retirement savings through consistent discipline. What wasn\'t obvious was that the flexibility to make certain moves would narrow over the coming years.',
    whyItMatters: 'Larger balances benefit from earlier attention.',
    unlocksStrategies: ['roth-conversion', 'asset-location', 'bracket-management']
  },

  // Single | High Retirement | Significant Real Estate
  {
    id: 'morgan-47-single-high-re',
    name: 'Morgan',
    age: 47,
    maritalStatus: 'single',
    ageBand: '45-49',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Morgan had built wealth across both retirement accounts and property. The complexity wasn\'t a problem to solve but a landscape to understand — each piece affecting the others.',
    whyItMatters: 'Multiple asset types require coordinated thinking.',
    unlocksStrategies: ['roth-conversion', 'asset-location', 'real-estate-awareness']
  },

  // Married | Low Retirement | No/Modest Real Estate
  {
    id: 'jenna-mark-47-low',
    name: 'Jenna & Mark',
    age: 47,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Jenna and Mark were saving when they could, balancing competing priorities. What they discovered was that even modest balances benefit from thoughtful structure — small decisions compound.',
    whyItMatters: 'Starting with intention beats waiting for "enough."',
    unlocksStrategies: ['asset-location', 'spousal-ira', 'contribution-strategy']
  },
  {
    id: 'david-lisa-46-low',
    name: 'David & Lisa',
    age: 46,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'With one income currently supporting the household, David and Lisa focused on stability first. The insight was that their current situation actually opened doors that wouldn\'t exist later.',
    whyItMatters: 'Transitions can be planning opportunities.',
    unlocksStrategies: ['spousal-ira', 'lower-income-planning']
  },

  // Married | Low Retirement | Significant Real Estate
  {
    id: 'chris-pat-48-low-re',
    name: 'Chris & Pat',
    age: 48,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: lowRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Chris and Pat had prioritized their home over retirement savings — a choice that made sense at the time. Now the question was how these different pieces fit together going forward.',
    whyItMatters: 'Real estate equity is part of the broader picture.',
    unlocksStrategies: ['asset-location', 'real-estate-awareness']
  },

  // Married | Mid Retirement | Any Real Estate
  {
    id: 'mike-sarah-47-mid',
    name: 'Mike & Sarah',
    age: 47,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: midRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Mike and Sarah had reached a comfortable rhythm with saving. The next phase wasn\'t about saving more, but thinking about how their different account types would work together.',
    whyItMatters: 'Coordination between accounts matters.',
    unlocksStrategies: ['asset-location', 'roth-awareness', 'bracket-management']
  },
  {
    id: 'ben-amy-48-mid-re',
    name: 'Ben & Amy',
    age: 48,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: midRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Between retirement accounts and home equity, Ben and Amy had built a meaningful foundation. Understanding how these assets interrelate — and when timing matters — became the focus.',
    whyItMatters: 'Different assets create different tax considerations.',
    unlocksStrategies: ['asset-location', 'real-estate-awareness', 'bracket-management']
  },

  // Married | High Retirement | Any Real Estate
  {
    id: 'robert-jennifer-46-high',
    name: 'Robert & Jennifer',
    age: 46,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Robert and Jennifer had been diligent savers for two decades. What they hadn\'t fully considered was that their window for certain planning moves was already beginning to narrow.',
    whyItMatters: 'The flexibility to act diminishes over time.',
    unlocksStrategies: ['roth-conversion', 'asset-location', 'charitable-awareness']
  },
  {
    id: 'james-emily-48-high-re',
    name: 'James & Emily',
    age: 48,
    maritalStatus: 'married',
    ageBand: '45-49',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'James and Emily had accumulated wealth across retirement accounts and property. The complexity of their situation wasn\'t a burden — it was an opportunity to be intentional about what came next.',
    whyItMatters: 'Wealth across categories requires integrated thinking.',
    unlocksStrategies: ['roth-conversion', 'real-estate-awareness', 'charitable-awareness']
  },

  // ========================================
  // AGE BAND: 50-54
  // ========================================

  // Single | Low Retirement
  {
    id: 'priya-52-single-low',
    name: 'Priya',
    age: 52,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Priya\'s savings had grown steadily but not dramatically. What mattered now wasn\'t comparing to benchmarks — it was understanding which decisions in the coming years would have the most impact.',
    whyItMatters: 'Structure matters as much as amounts.',
    unlocksStrategies: ['asset-location', 'catch-up-contributions', 'bracket-management']
  },

  // Single | Mid Retirement
  {
    id: 'marcus-53-single-mid',
    name: 'Marcus',
    age: 53,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: midRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Marcus had reached a point where the balance felt meaningful. The question shifted from accumulation to optimization — not changing risk, but improving efficiency.',
    whyItMatters: 'Mid-career is when structure decisions compound.',
    unlocksStrategies: ['asset-location', 'roth-awareness', 'tax-loss-harvesting']
  },
  {
    id: 'andrea-51-single-mid-re',
    name: 'Andrea',
    age: 51,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: midRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Andrea\'s wealth was split between retirement accounts and property. Each had its own tax characteristics — understanding the interplay became increasingly relevant.',
    whyItMatters: 'Different assets create different planning considerations.',
    unlocksStrategies: ['asset-location', 'real-estate-awareness', 'bracket-management']
  },

  // Single | High Retirement
  {
    id: 'daniel-54-single-high',
    name: 'Daniel',
    age: 54,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Daniel had accumulated more than he once imagined. What became clear was that larger balances meant future required distributions would be significant — and the window to address this was limited.',
    whyItMatters: 'Flexibility narrows faster than expected.',
    unlocksStrategies: ['roth-conversion', 'rmd-modeling', 'bracket-management']
  },
  {
    id: 'nina-52-single-high-re',
    name: 'Nina',
    age: 52,
    maritalStatus: 'single',
    ageBand: '50-54',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Nina had built substantial wealth across multiple asset types. The complexity wasn\'t overwhelming — but it did require thinking about how each piece affected the others.',
    whyItMatters: 'Significant assets require coordinated planning.',
    unlocksStrategies: ['roth-conversion', 'real-estate-awareness', 'asset-location']
  },

  // Married | Low Retirement
  {
    id: 'luis-hannah-53-low',
    name: 'Luis & Hannah',
    age: 53,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: lowRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'When Hannah stepped away from work, household income dropped. Rather than seeing this as a setback, they recognized it as a moment to evaluate their structure and timing.',
    whyItMatters: 'Income transitions can create planning windows.',
    unlocksStrategies: ['lower-income-planning', 'spousal-ira', 'asset-location']
  },

  // Married | Mid Retirement
  {
    id: 'kevin-maria-52-mid',
    name: 'Kevin & Maria',
    age: 52,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: midRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Kevin and Maria had reached a comfortable balance between saving and living. The next phase was about being intentional — not saving more, but saving smarter.',
    whyItMatters: 'Optimization becomes possible with meaningful balances.',
    unlocksStrategies: ['asset-location', 'roth-awareness', 'hsa-optimization']
  },
  {
    id: 'tom-rachel-54-mid-re',
    name: 'Tom & Rachel',
    age: 54,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: midRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Between their retirement accounts and home equity, Tom and Rachel had built a solid foundation. How these different pieces would work together in retirement required forward thinking.',
    whyItMatters: 'Multiple asset types add dimensions to planning.',
    unlocksStrategies: ['asset-location', 'real-estate-awareness', 'bracket-management']
  },

  // Married | High Retirement
  {
    id: 'richard-susan-51-high',
    name: 'Richard & Susan',
    age: 51,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Richard and Susan had been aggressive savers for years. The realization that their future required distributions would be substantial prompted a shift in thinking — from accumulation to positioning.',
    whyItMatters: 'Large balances mean large future obligations.',
    unlocksStrategies: ['roth-conversion', 'rmd-modeling', 'charitable-awareness']
  },
  {
    id: 'paul-linda-53-high-re',
    name: 'Paul & Linda',
    age: 53,
    maritalStatus: 'married',
    ageBand: '50-54',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Paul and Linda\'s wealth spanned retirement accounts, taxable investments, and property. The interplay between these assets — and their tax implications — required careful consideration.',
    whyItMatters: 'Wealth across categories requires integrated thinking.',
    unlocksStrategies: ['roth-conversion', 'real-estate-awareness', 'asset-location']
  },

  // ========================================
  // AGE BAND: 55-59
  // ========================================

  // Single | Low/Mid Retirement
  {
    id: 'karen-57-single-low',
    name: 'Karen',
    age: 57,
    maritalStatus: 'single',
    ageBand: '55-59',
    retirementTier: [...lowRetirement, ...midRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Karen had prioritized other life goals over aggressive saving. Now, with retirement on the horizon, the focus was on making the most of her current position.',
    whyItMatters: 'Where you are is the only place to start from.',
    unlocksStrategies: ['asset-location', 'catch-up-contributions', 'bracket-management']
  },

  // Single | High Retirement
  {
    id: 'daniel-58-single-high',
    name: 'Daniel',
    age: 58,
    maritalStatus: 'single',
    ageBand: '55-59',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'Daniel assumed tax planning started at retirement. What changed his thinking was realizing the most flexible years often end before retirement begins.',
    whyItMatters: 'The window for action narrows faster than expected.',
    unlocksStrategies: ['roth-conversion', 'rmd-modeling', 'asset-sequencing']
  },
  {
    id: 'victoria-56-single-high-re',
    name: 'Victoria',
    age: 56,
    maritalStatus: 'single',
    ageBand: '55-59',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Victoria\'s wealth was diversified across retirement accounts and real estate. The question wasn\'t whether she had enough — it was how to position everything for efficiency.',
    whyItMatters: 'Positioning matters as much as accumulation.',
    unlocksStrategies: ['roth-conversion', 'real-estate-awareness', 'rmd-modeling']
  },

  // Married | Low/Mid Retirement
  {
    id: 'frank-diane-56-low',
    name: 'Frank & Diane',
    age: 56,
    maritalStatus: 'married',
    ageBand: '55-59',
    retirementTier: [...lowRetirement, ...midRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Frank and Diane had focused on raising their family before maximizing savings. With that chapter closing, their attention turned to making intentional choices with what they had.',
    whyItMatters: 'The next decade shapes everything that follows.',
    unlocksStrategies: ['catch-up-contributions', 'asset-location', 'hsa-optimization']
  },

  // Married | High Retirement
  {
    id: 'karen-steve-57-high',
    name: 'Karen & Steve',
    age: 57,
    maritalStatus: 'married',
    ageBand: '55-59',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'With income peaking and obligations declining, Karen and Steve had a narrowing window to shape future taxes. The key wasn\'t doing everything — it was choosing the right order.',
    whyItMatters: 'Sequencing decisions matters as much as the decisions themselves.',
    unlocksStrategies: ['roth-conversion', 'charitable-bunching', 'rmd-modeling']
  },
  {
    id: 'michael-jennifer-58-high-re',
    name: 'Michael & Jennifer',
    age: 58,
    maritalStatus: 'married',
    ageBand: '55-59',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Michael and Jennifer\'s balance sheet was substantial and complex. With retirement approaching, the question became how to draw from different sources in a way that made sense.',
    whyItMatters: 'Complexity requires intentional coordination.',
    unlocksStrategies: ['roth-conversion', 'real-estate-awareness', 'asset-sequencing']
  },

  // ========================================
  // AGE BAND: 60-69
  // ========================================

  // Single | Any Retirement
  {
    id: 'patricia-63-single',
    name: 'Patricia',
    age: 63,
    maritalStatus: 'single',
    ageBand: '60-69',
    retirementTier: [...lowRetirement, ...midRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Patricia was transitioning from full-time work to something more flexible. The shift in income created questions about timing — when to draw from which sources, and in what order.',
    whyItMatters: 'Transition years offer unique planning windows.',
    unlocksStrategies: ['bracket-management', 'asset-sequencing', 'medicare-planning']
  },
  {
    id: 'george-65-single-high',
    name: 'George',
    age: 65,
    maritalStatus: 'single',
    ageBand: '60-69',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'George had reached 65 with more saved than he once thought possible. The focus shifted from growth to sustainability — and understanding how withdrawals would be taxed.',
    whyItMatters: 'Withdrawal strategy shapes after-tax income.',
    unlocksStrategies: ['rmd-minimization', 'roth-conversion', 'medicare-planning']
  },
  {
    id: 'helen-64-single-high-re',
    name: 'Helen',
    age: 64,
    maritalStatus: 'single',
    ageBand: '60-69',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Helen\'s wealth was distributed across accounts and property. Each had different tax characteristics — understanding how they\'d work together in retirement became essential.',
    whyItMatters: 'Source selection changes everything.',
    unlocksStrategies: ['rmd-minimization', 'real-estate-awareness', 'asset-sequencing']
  },

  // Married | Any Retirement
  {
    id: 'bill-nancy-62',
    name: 'Bill & Nancy',
    age: 62,
    maritalStatus: 'married',
    ageBand: '60-69',
    retirementTier: [...lowRetirement, ...midRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Bill and Nancy were planning for Nancy\'s retirement while Bill continued working. The income gap between now and later created questions worth examining.',
    whyItMatters: 'Staggered retirements create planning opportunities.',
    unlocksStrategies: ['bracket-management', 'asset-sequencing', 'hsa-optimization']
  },
  {
    id: 'carla-andre-63-high',
    name: 'Carla & Andre',
    age: 63,
    maritalStatus: 'married',
    ageBand: '60-69',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate],
    narrative: 'They assumed taxes were unavoidable. What surprised them was how source selection — not spending less — materially changed outcomes.',
    whyItMatters: 'Where you draw from changes everything.',
    unlocksStrategies: ['rmd-minimization', 'qcd-education', 'roth-conversion']
  },
  {
    id: 'edward-margaret-66-high-re',
    name: 'Edward & Margaret',
    age: 66,
    maritalStatus: 'married',
    ageBand: '60-69',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Edward and Margaret had accumulated wealth across retirement accounts, taxable investments, and property. The question wasn\'t having enough — it was being efficient with what they had.',
    whyItMatters: 'Efficiency compounds over a long retirement.',
    unlocksStrategies: ['rmd-minimization', 'real-estate-awareness', 'charitable-bunching']
  },

  // ========================================
  // AGE BAND: 70+
  // ========================================

  // Single | Any Retirement
  {
    id: 'robert-72-single',
    name: 'Robert',
    age: 72,
    maritalStatus: 'single',
    ageBand: '70+',
    retirementTier: [...lowRetirement, ...midRetirement, ...highRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Robert didn\'t need more income — he needed fewer forced decisions. Understanding what triggered taxes gave him back control.',
    whyItMatters: 'Control over timing is the ultimate flexibility.',
    unlocksStrategies: ['rmd-qcd-logic', 'qlac-awareness', 'estate-sequencing']
  },
  {
    id: 'dorothy-75-single',
    name: 'Dorothy',
    age: 75,
    maritalStatus: 'single',
    ageBand: '70+',
    retirementTier: highRetirement,
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'Dorothy had more than she needed for her own lifetime. The question became how to be thoughtful about what would eventually pass to the next generation.',
    whyItMatters: 'Legacy planning is part of tax planning.',
    unlocksStrategies: ['qcd-education', 'estate-sequencing', 'charitable-bunching']
  },

  // Married | Any Retirement
  {
    id: 'margaret-tom-75',
    name: 'Margaret & Tom',
    age: 75,
    maritalStatus: 'married',
    ageBand: '70+',
    retirementTier: [...lowRetirement, ...midRetirement, ...highRetirement],
    realEstateTier: [...noRealEstate, ...modestRealEstate, ...significantRealEstate],
    narrative: 'They had done well saving but realized RMDs were pushing them into higher brackets. Learning about strategic giving and withdrawal sequencing opened new possibilities.',
    whyItMatters: 'It\'s never too late to optimize.',
    unlocksStrategies: ['rmd-qcd-logic', 'charitable-bunching', 'asset-sequencing']
  },
  {
    id: 'harold-betty-78',
    name: 'Harold & Betty',
    age: 78,
    maritalStatus: 'married',
    ageBand: '70+',
    retirementTier: highRetirement,
    realEstateTier: significantRealEstate,
    narrative: 'Harold and Betty had spent decades building wealth. Now their focus was on managing it efficiently — minimizing forced withdrawals and being intentional about their legacy.',
    whyItMatters: 'Wealth management continues into retirement.',
    unlocksStrategies: ['qcd-education', 'estate-sequencing', 'real-estate-awareness']
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
  retirementRange: RetirementRange;
  realEstateRange: RealEstateRange;
}): PersonaStory[] {
  const ageBand = getAgeBand(profile.age);
  
  // Filter stories that match ALL criteria
  const matchingStories = personaStories.filter(story => {
    // Must match age band
    if (story.ageBand !== ageBand) return false;
    
    // Must match marital status exactly
    if (story.maritalStatus !== profile.maritalStatus) return false;
    
    // Must include the retirement range
    if (!story.retirementTier.includes(profile.retirementRange)) return false;
    
    // Must include the real estate range
    if (!story.realEstateTier.includes(profile.realEstateRange)) return false;
    
    return true;
  });

  // If we have matches, return 2-3 of them
  if (matchingStories.length >= 2) {
    // Shuffle and return 2-3
    const shuffled = matchingStories.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  // Fallback: relax matching slightly if no exact matches
  // Try matching age band + marital status + at least retirement OR real estate
  const fallbackStories = personaStories.filter(story => {
    if (story.ageBand !== ageBand) return false;
    if (story.maritalStatus !== profile.maritalStatus) return false;
    
    const retirementMatch = story.retirementTier.includes(profile.retirementRange);
    const realEstateMatch = story.realEstateTier.includes(profile.realEstateRange);
    
    return retirementMatch || realEstateMatch;
  });

  if (fallbackStories.length >= 2) {
    const shuffled = fallbackStories.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  // Last resort: just age band + marital status
  const lastResort = personaStories.filter(story => 
    story.ageBand === ageBand && story.maritalStatus === profile.maritalStatus
  );

  const shuffled = lastResort.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(3, Math.max(2, shuffled.length)));
}
