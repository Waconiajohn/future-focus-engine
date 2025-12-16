import { useState, useMemo } from "react";
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
  Sparkles,
  FileText,
  CheckSquare,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedStrategyCard } from "./EnhancedStrategyCard";
import { SuccessStoryCards } from "./SuccessStoryCards";
import { DisclosureFooter } from "./DisclosureFooter";
import { MultiStrategyBriefingWizard } from "./MultiStrategyBriefingWizard";
import type { MatchedStrategy, Persona, Strategy } from "@/types/persona";

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
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [wizardOpen, setWizardOpen] = useState(false);
  
  // Get user's details for personalized estimates
  const retirementRange = persona?.retirementRange || "500k-1M";
  const ageBand = persona?.ageBand;
  const ageBandMidpoint: Record<string, number> = {
    "45-49": 47, "50-54": 52, "55-59": 57, "60-65": 62, "60-69": 65, "70+": 72,
  };
  const age = ageBandMidpoint[String(persona?.ageBand)] ?? 55;
  const maritalStatus = persona?.maritalStatus;
  const employmentStatus = persona?.employment;
  
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

  // Selection mode is active when at least one strategy is selected
  const selectionMode = selectedStrategies.size > 0;

  // Toggle strategy selection
  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies(prev => {
      const next = new Set(prev);
      if (next.has(strategyId)) {
        next.delete(strategyId);
      } else {
        next.add(strategyId);
      }
      return next;
    });
  };

  // Select all displayed strategies
  const selectAll = () => {
    setSelectedStrategies(new Set(displayedStrategies.map(s => s.id)));
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedStrategies(new Set());
  };

  // Remove a strategy from selection (from wizard)
  const removeFromSelection = (strategyId: string) => {
    setSelectedStrategies(prev => {
      const next = new Set(prev);
      next.delete(strategyId);
      return next;
    });
  };

  // Get selected strategy objects
  const selectedStrategyObjects = useMemo(() => {
    return matchedStrategies.filter(s => selectedStrategies.has(s.id)) as Strategy[];
  }, [matchedStrategies, selectedStrategies]);

  // Client profile for the wizard
  const clientProfile = {
    age,
    ageBand,
    retirementRange,
    maritalStatus,
    employmentStatus,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Your Tax Opportunities</span>
          </div>
          <div className="flex items-center gap-2">
            {selectionMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={onRestart}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
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
            {selectionMode 
              ? `Select the strategies you want to discuss with your advisor, then create a consolidated briefing.`
              : `We've prioritized the ${Math.min(matchedStrategies.length, MAX_INITIAL_STRATEGIES)} most relevant strategies based on your profile. Tap to select strategies for your advisor meeting.`
            }
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

        {/* Selection Hint - only show when not in selection mode */}
        {!selectionMode && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4" />
            <span>Tap the checkbox on any strategy to start selecting</span>
          </div>
        )}

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
                  defaultExpanded={!selectionMode}
                  retirementRange={retirementRange}
                  age={age}
                  ageBand={ageBand}
                  maritalStatus={maritalStatus}
                  employmentStatus={employmentStatus}
                  isSelected={selectedStrategies.has(strategy.id)}
                  onToggleSelect={toggleStrategy}
                  selectionMode={true}
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
                    ageBand={ageBand}
                    maritalStatus={maritalStatus}
                    employmentStatus={employmentStatus}
                    isSelected={selectedStrategies.has(strategy.id)}
                    onToggleSelect={toggleStrategy}
                    selectionMode={true}
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

      {/* Sticky Selection Action Bar */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {selectedStrategies.size}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {selectedStrategies.size === 1 ? 'strategy' : 'strategies'} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={() => setWizardOpen(true)}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Create Briefing
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Strategy Briefing Wizard */}
      <MultiStrategyBriefingWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        strategies={selectedStrategyObjects}
        clientProfile={clientProfile}
        onRemoveStrategy={removeFromSelection}
      />
    </div>
  );
}
