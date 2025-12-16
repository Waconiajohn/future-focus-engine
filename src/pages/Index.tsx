
import { useState } from "react";
import { PersonaSelector } from "@/components/portfolio/PersonaSelector";
import { IntroStep } from "@/components/steps/IntroStep";
import { StoryCard } from "@/components/portfolio/StoryCard";
import { StrategyCard } from "@/components/portfolio/StrategyCard";
import { DisclosureFooter } from "@/components/portfolio/DisclosureFooter";
import { matchStrategies } from "@/data/strategies";
import { personaToUserProfile } from "@/domain/tax/profileAdapter";
import type { Persona, MatchedStrategy } from "@/types/persona";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [view, setView] = useState<"intro" | "onboarding" | "results">("intro");
  const [matchedStrategies, setMatchedStrategies] = useState<MatchedStrategy[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);

  const handlePersonaComplete = (newPersona: Persona) => {
    setPersona(newPersona);
    // Convert Persona to UserProfile and use the rich matchStrategies engine
    const userProfile = personaToUserProfile(newPersona);
    const strategies = matchStrategies(userProfile);
    setMatchedStrategies(strategies);
    setView("results");
    window.scrollTo(0, 0);
  };

  const resetFlow = () => {
    setView("intro");
    setMatchedStrategies([]);
    setPersona(null);
  };

  // Helper to get 3 top stories based on matched strategies
  const getTopStories = () => {
    const stories: { title: string; insight: string; type: "tax" | "growth" | "income" }[] = [];
    
    // Check for high-impact tax strategies
    const highImpactStrategies = matchedStrategies.filter(s => s.computedImpact === "high");
    const taxStrategies = matchedStrategies.filter(s => 
      s.category === "timing" || s.category === "withdrawal" || s.title?.toLowerCase().includes("tax") || s.title?.toLowerCase().includes("roth")
    );
    
    if (taxStrategies.length > 0) {
      stories.push({
        title: "Tax Efficiency Opportunity",
        insight: `Based on your profile, you have ${taxStrategies.length} strategies to potentially reduce your lifetime tax burden.`,
        type: "tax"
      });
    }

    // Check for income/retirement strategies
    const incomeStrategies = matchedStrategies.filter(s => 
      s.category === "withdrawal" || s.category === "structure" || 
      s.title?.toLowerCase().includes("retirement") || s.title?.toLowerCase().includes("income")
    );
    if (incomeStrategies.length > 0) {
      stories.push({
        title: "Income & Retirement Security",
        insight: `You have ${incomeStrategies.length} strategies available to strengthen your retirement income stream.`,
        type: "income"
      });
    }

    // High-impact general
    if (highImpactStrategies.length > 0 && stories.length < 2) {
      stories.push({
        title: "High-Impact Opportunities",
        insight: `We identified ${highImpactStrategies.length} high-impact strategies relevant to your situation.`,
        type: "growth"
      });
    }

    // Fallback if we have strategies but no specific matches
    if (stories.length === 0 && matchedStrategies.length > 0) {
      stories.push({
        title: "Comprehensive Planning",
        insight: `We identified ${matchedStrategies.length} strategies worth exploring with a qualified professional.`,
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
              {matchedStrategies.length} Found
            </span>
          </div>
          
          <div className="grid gap-4">
            {matchedStrategies.map((strategy) => (
              <StrategyCard 
                key={strategy.id} 
                strategy={strategy} 
                onExplore={() => console.log("Explore", strategy.title)} 
              />
            ))}
          </div>
        </section>

      </main>

      <DisclosureFooter />
    </div>
  );
};

export default Index;
