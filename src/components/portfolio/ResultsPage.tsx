import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  RefreshCw, 
  TrendingDown, 
  Wallet, 
  Heart, 
  Building2, 
  Briefcase,
  GraduationCap,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { EnhancedStrategyCard } from "./EnhancedStrategyCard";
import { DisclosureFooter } from "./DisclosureFooter";
import type { MatchedStrategy, Persona } from "@/types/persona";

interface ResultsPageProps {
  matchedStrategies: MatchedStrategy[];
  persona: Persona | null;
  onRestart: () => void;
}

const CATEGORY_INFO: Record<string, { 
  icon: React.ReactNode; 
  description: string;
  color: string;
}> = {
  'Tax Efficiency': {
    icon: <TrendingDown className="h-5 w-5" />,
    description: 'Strategies to reduce your current and future tax burden through smart account structures and timing.',
    color: 'text-blue-600'
  },
  'Retirement & Income': {
    icon: <Wallet className="h-5 w-5" />,
    description: 'Optimize your retirement account distributions and minimize required minimum distribution (RMD) impact.',
    color: 'text-purple-600'
  },
  'Charitable Giving': {
    icon: <Heart className="h-5 w-5" />,
    description: 'Tax-efficient ways to support causes you care about while reducing your tax liability.',
    color: 'text-pink-600'
  },
  'Real Estate': {
    icon: <Building2 className="h-5 w-5" />,
    description: 'Defer or eliminate capital gains on investment properties and optimize rental income treatment.',
    color: 'text-amber-600'
  },
  'Business & Estate': {
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Strategies for business owners and those planning wealth transfer to future generations.',
    color: 'text-emerald-600'
  },
  'Education': {
    icon: <GraduationCap className="h-5 w-5" />,
    description: 'Tax-advantaged ways to save for education expenses with new flexibility options.',
    color: 'text-cyan-600'
  }
};

function groupStrategies(strategies: MatchedStrategy[]): Record<string, MatchedStrategy[]> {
  const groups: Record<string, MatchedStrategy[]> = {
    'Tax Efficiency': [],
    'Retirement & Income': [],
    'Charitable Giving': [],
    'Real Estate': [],
    'Business & Estate': [],
    'Education': [],
  };

  strategies.forEach(s => {
    if (['roth-conversion', 'backdoor-roth', 'mega-backdoor-roth', 'tax-loss-harvesting', 
         'cost-basis-planning', 'municipal-bonds', 'asset-location'].includes(s.id)) {
      groups['Tax Efficiency'].push(s);
    } else if (['rmd-minimization', 'qcd', 'qlac', 'nua', 'hsa', 'spousal-ira', 'nqdc'].includes(s.id)) {
      groups['Retirement & Income'].push(s);
    } else if (['daf', 'crt', 'conservation-easement'].includes(s.id)) {
      groups['Charitable Giving'].push(s);
    } else if (['1031-exchange', 'rental-loss-reps', 'depreciation-recapture', 
                'primary-residence-exclusion', 'opportunity-zone'].includes(s.id)) {
      groups['Real Estate'].push(s);
    } else if (['qsbs', 'installment-sale', 'flp', 'dynasty-trust'].includes(s.id)) {
      groups['Business & Estate'].push(s);
    } else if (['529-planning'].includes(s.id)) {
      groups['Education'].push(s);
    } else {
      groups['Tax Efficiency'].push(s);
    }
  });

  // Return only non-empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, strategies]) => strategies.length > 0)
  );
}

function getTopPriorityStrategies(strategies: MatchedStrategy[]): MatchedStrategy[] {
  return strategies
    .filter(s => s.impact === 'high')
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 3);
}

export function ResultsPage({ matchedStrategies, persona, onRestart }: ResultsPageProps) {
  const grouped = groupStrategies(matchedStrategies);
  const topPriority = getTopPriorityStrategies(matchedStrategies);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Your Tax Opportunities</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Summary */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            We Found{" "}
            <span className="text-primary">{matchedStrategies.length} Tax-Saving Opportunities</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your profile, these strategies could help reduce your lifetime tax burden. 
            Each requires review with a qualified professional before implementation.
          </p>
        </section>

        {/* Warning Banner */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-300">
                These are educational suggestions, not personalized advice.
              </p>
              <p className="text-amber-700 dark:text-amber-400 mt-1">
                Tax strategies depend on your complete financial picture. Always consult a CPA or CFP before implementing any strategy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Priority Section */}
        {topPriority.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold text-foreground">
                Highest Impact Opportunities
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              These strategies typically offer the greatest potential tax savings for profiles like yours.
            </p>
            <div className="space-y-4">
              {topPriority.map((strategy) => (
                <EnhancedStrategyCard 
                  key={strategy.id} 
                  strategy={strategy}
                  defaultExpanded={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Categorized Strategies */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold text-foreground">All Opportunities by Category</h2>
          
          {Object.entries(grouped).map(([groupName, strategies]) => {
            const info = CATEGORY_INFO[groupName];
            // Don't show strategies already in top priority as expanded
            const topPriorityIds = topPriority.map(s => s.id);
            
            return (
              <div key={groupName} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className={`${info?.color || 'text-primary'} mt-0.5`}>
                    {info?.icon || <ArrowRight className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {groupName}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({strategies.length} {strategies.length === 1 ? 'strategy' : 'strategies'})
                      </span>
                    </h3>
                    {info?.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {info.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Strategy Cards */}
                <div className="space-y-3 pl-4 border-l-2 border-muted">
                  {strategies.map((strategy) => (
                    <EnhancedStrategyCard 
                      key={strategy.id} 
                      strategy={strategy}
                      defaultExpanded={topPriorityIds.includes(strategy.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA Section */}
        <section className="text-center py-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Ready to Take Action?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The next step is discussing these opportunities with a qualified tax professional who can 
            evaluate your complete situation and provide personalized recommendations.
          </p>
          <Button size="lg" className="mt-4">
            Find a Tax Professional
          </Button>
        </section>

      </main>

      <DisclosureFooter />
    </div>
  );
}
