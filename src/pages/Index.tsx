
import { useState } from "react";
import { PersonaSelector } from "@/components/portfolio/PersonaSelector";
import { IntroStep } from "@/components/steps/IntroStep";
import { StoryCard } from "@/components/portfolio/StoryCard";
import { StrategyCard } from "@/components/portfolio/StrategyCard";
import { DisclosureFooter } from "@/components/portfolio/DisclosureFooter";
import { evaluateStrategies, STRATEGIES } from "@/data/strategyCatalog";
import type { Persona, TriggerResult } from "@/types/persona";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [view, setView] = useState<"intro" | "onboarding" | "results">("intro");
  const [results, setResults] = useState<TriggerResult[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);

  const handlePersonaComplete = (newPersona: Persona) => {
    setPersona(newPersona);
    const matches = evaluateStrategies(newPersona);
    
    // Sort matches: High confidence -> Medium -> Low
    const sorted = matches.sort((a, b) => {
      const weight = { High: 3, Medium: 2, Low: 1 };
      return weight[b.confidence] - weight[a.confidence];
    });

    setResults(sorted);
    setView("results");
    window.scrollTo(0, 0);
  };

  const resetFlow = () => {
    setView("intro");
    setResults([]);
    setPersona(null);
  };

  // Helper to get 3 top stories
  const getTopStories = () => {
    // Ideally we pick 2-3 distint types of stories (tax, growth, income) based on high impact matches
    const stories: { title: string; insight: string; type: "tax" | "growth" | "income" }[] = [];
    
    // Check for tax heavy strategies
    const taxStrats = results.filter(r => 
      STRATEGIES[r.strategyId]?.whyThisMayApply?.toLowerCase().includes("tax") && r.confidence === "High"
    );
    if (taxStrats.length > 0) {
      stories.push({
        title: "Tax Efficiency Opportunity",
        insight: "Based on your profile, you have significant opportunities to reduce your lifetime tax burden through strategic planning.",
        type: "tax"
      });
    }

    // Check for income/growth
    const incomeStrats = results.filter(r => 
      (STRATEGIES[r.strategyId]?.whyThisMayApply?.toLowerCase().includes("income") || 
       STRATEGIES[r.strategyId]?.whyThisMayApply?.toLowerCase().includes("retirement")) && 
       r.confidence === "High"
    );
    if (incomeStrats.length > 0) {
      stories.push({
        title: "Income & Retirement Security",
        insight: `You have ${incomeStrats.length} high-impact strategies available to strengthen your retirement income stream and longevity protection.`,
        type: "income" // or growth
      });
    }

    // If we need more, check matched count overall
    if (stories.length < 2 && results.length > 5) {
      stories.push({
        title: "Comprehensive Growth Strategy",
        insight: `We identified ${results.length} total strategies relevant to your situation that could optimize your wealth accumulation.`,
        type: "growth"
      });
    }

    return stories.slice(0, 3);
  };

  if (view === "intro") {
    return <IntroStep onStart={() => setView("onboarding")} />;
  }

  if (view === "onboarding") {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primarySoft mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Tax Opportunity Explorer</h1>
          <p className="mt-2 text-lg text-textSecondary">
            Answer a few questions to discover relevant strategies.
          </p>
        </div>
        <PersonaSelector onComplete={handlePersonaComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-textPrimary">PortfolioGuard Results</span>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFlow} className="text-textSecondary hover:text-textPrimary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Story Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-textPrimary">Your Financial Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTopStories().map((story, i) => (
              <StoryCard key={i} {...story} />
            ))}
          </div>
        </section>

        {/* Strategy Catalog Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-textPrimary">Recommended Strategies</h2>
            <span className="bg-primarySoft text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {results.length} Found
            </span>
          </div>
          
          <div className="grid gap-4">
            {results.map((result) => {
              const strategy = STRATEGIES[result.strategyId];
              return (
                <StrategyCard 
                  key={result.strategyId} 
                  strategy={strategy} 
                  onExplore={() => console.log("Explore", strategy.title)} 
                />
              );
            })}
          </div>
        </section>

      </main>

      <DisclosureFooter />
    </div>
  );
};

export default Index;
