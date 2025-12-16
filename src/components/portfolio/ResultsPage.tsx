import { useState } from "react";
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
  ChevronDown,
  Sparkles
} from "lucide-react";
import { EnhancedStrategyCard } from "./EnhancedStrategyCard";
import { SuccessStoryCards } from "./SuccessStoryCards";
import { DisclosureFooter } from "./DisclosureFooter";
import type { MatchedStrategy, Persona } from "@/types/persona";

interface ResultsPageProps {
  matchedStrategies: MatchedStrategy[];
  persona: Persona | null;
  onRestart: () => void;
}

const MAX_INITIAL_STRATEGIES = 7;

const CATEGORY_INFO: Record<string, { 
  icon: React.ReactNode; 
  description: string;
  color: string;
}> = {
  'Tax Efficiency': {
    icon: <TrendingDown className="h-5 w-5" />,
    description: 'Reduce tax burden through smart timing and account structures.',
    color: 'text-blue-600'
  },
  'Retirement & Income': {
    icon: <Wallet className="h-5 w-5" />,
    description: 'Optimize distributions and minimize RMD impact.',
    color: 'text-purple-600'
  },
  'Charitable Giving': {
    icon: <Heart className="h-5 w-5" />,
    description: 'Tax-efficient giving strategies.',
    color: 'text-pink-600'
  },
  'Real Estate': {
    icon: <Building2 className="h-5 w-5" />,
    description: 'Defer or eliminate capital gains on properties.',
    color: 'text-amber-600'
  },
  'Business & Estate': {
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Business and wealth transfer strategies.',
    color: 'text-emerald-600'
  },
  'Education': {
    icon: <GraduationCap className="h-5 w-5" />,
    description: 'Tax-advantaged education savings.',
    color: 'text-cyan-600'
  }
};

function getTopStrategies(strategies: MatchedStrategy[], limit: number): MatchedStrategy[] {
  return [...strategies]
    .sort((a, b) => {
      // Sort by impact first (high > medium > low)
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const aImpact = impactOrder[a.computedImpact || 'low'];
      const bImpact = impactOrder[b.computedImpact || 'low'];
      if (bImpact !== aImpact) return bImpact - aImpact;
      // Then by priority score
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    })
    .slice(0, limit);
}

export function ResultsPage({ matchedStrategies, persona, onRestart }: ResultsPageProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Get user's details for personalized estimates
  const retirementRange = persona?.retirementRange || "500k-1M";
  const ageBandMidpoint: Record<string, number> = {
    "45-49": 47, "50-54": 52, "55-59": 57, "60-65": 62, "60-69": 65, "70+": 72,
  };
  const age = ageBandMidpoint[String(persona?.ageBand)] ?? 55;
  
  // Get top strategies (limited or all based on showAll)
  const displayedStrategies = showAll 
    ? matchedStrategies 
    : getTopStrategies(matchedStrategies, MAX_INITIAL_STRATEGIES);
  
  const hasMore = matchedStrategies.length > MAX_INITIAL_STRATEGIES;
  const remainingCount = matchedStrategies.length - MAX_INITIAL_STRATEGIES;
  
  // Get top 3 high-impact for hero section
  const topHighImpact = displayedStrategies
    .filter(s => s.computedImpact === 'high')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Summary */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {matchedStrategies.length} opportunities identified
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your Personalized Tax Strategy Review
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We've prioritized the {Math.min(matchedStrategies.length, MAX_INITIAL_STRATEGIES)} most relevant strategies based on your profile.
          </p>
        </section>

        {/* Warning Banner */}
        <Card className="border-border bg-muted">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <strong>Educational only.</strong>{" "}
              Consult a CPA or CFP before implementing any strategy.
            </p>
          </CardContent>
        </Card>

        {/* Top High Impact Section */}
        {topHighImpact.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="text-lg font-bold text-foreground">
                Highest Impact Opportunities
              </h2>
            </div>
            <div className="space-y-3">
              {topHighImpact.map((strategy) => (
                <EnhancedStrategyCard 
                  key={strategy.id} 
                  strategy={strategy}
                  defaultExpanded={true}
                  retirementRange={retirementRange}
                  age={age}
                />
              ))}
            </div>
          </section>
        )}

        {/* Remaining Strategies */}
        {displayedStrategies.filter(s => !topHighImpact.find(t => t.id === s.id)).length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-muted-foreground/50 rounded-full" />
              <h2 className="text-lg font-bold text-foreground">
                Additional Opportunities
              </h2>
            </div>
            <div className="space-y-3">
              {displayedStrategies
                .filter(s => !topHighImpact.find(t => t.id === s.id))
                .map((strategy) => (
                  <EnhancedStrategyCard 
                    key={strategy.id} 
                    strategy={strategy}
                    defaultExpanded={false}
                    retirementRange={retirementRange}
                    age={age}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Show More Button */}
        {hasMore && !showAll && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Show {remainingCount} More Strategies
            </Button>
          </div>
        )}

        {/* Success Stories */}
        <div className="pt-8 border-t border-border">
          <SuccessStoryCards />
        </div>

        {/* CTA Section */}
        <section className="text-center py-6 space-y-4 border-t border-border mt-8">
          <h2 className="text-lg font-bold text-foreground">Ready to Take Action?</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Discuss these opportunities with a qualified tax professional for personalized recommendations.
          </p>
          <Button size="lg" className="mt-2">
            Find a Tax Professional
          </Button>
        </section>

      </main>

      <DisclosureFooter />
    </div>
  );
}
