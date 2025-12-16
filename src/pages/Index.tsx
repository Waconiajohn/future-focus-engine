
import { useState } from "react";
import { PersonaSelector } from "@/components/portfolio/PersonaSelector";
import { IntroStep } from "@/components/steps/IntroStep";
import { StoryCard } from "@/components/portfolio/StoryCard";
import { StrategyCard } from "@/components/portfolio/StrategyCard";
import { DisclosureFooter } from "@/components/portfolio/DisclosureFooter";
import { matchStrategies } from "@/data/strategies-v2";
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

  // Categorize strategies for distinct counting
  const categorizeStrategies = () => {
    const taxEfficiency = matchedStrategies.filter(s => 
      ['roth-conversion', 'backdoor-roth', 'mega-backdoor-roth', 'tax-loss-harvesting', 
       'cost-basis-planning', 'municipal-bonds', 'asset-location'].includes(s.id)
    );
    
    const retirement = matchedStrategies.filter(s => 
      ['rmd-minimization', 'qcd', 'qlac', 'nua', 'hsa', 'spousal-ira', 'nqdc'].includes(s.id)
    );
    
    const charitableGiving = matchedStrategies.filter(s => 
      ['daf', 'crt', 'qcd', 'conservation-easement'].includes(s.id)
    );
    
    const realEstate = matchedStrategies.filter(s => 
      ['1031-exchange', 'rental-loss-reps', 'depreciation-recapture', 
       'primary-residence-exclusion', 'opportunity-zone'].includes(s.id)
    );
    
    const business = matchedStrategies.filter(s => 
      ['qsbs', 'installment-sale', 'flp', 'dynasty-trust'].includes(s.id)
    );
    
    const education = matchedStrategies.filter(s => 
      ['529-planning'].includes(s.id)
    );
    
    return { taxEfficiency, retirement, charitableGiving, realEstate, business, education };
  };

  // Generate stories based on DISTINCT category counts
  const getTopStories = () => {
    const categories = categorizeStrategies();
    const stories: { title: string; insight: string; type: "tax" | "growth" | "income" }[] = [];
    
    // Tax efficiency story
    if (categories.taxEfficiency.length > 0) {
      stories.push({
        title: "Tax Efficiency",
        insight: `${categories.taxEfficiency.length} strategies to reduce your current and future tax burden.`,
        type: "tax"
      });
    }

    // Retirement story
    if (categories.retirement.length > 0) {
      stories.push({
        title: "Retirement Planning",
        insight: `${categories.retirement.length} strategies to optimize your retirement income and distributions.`,
        type: "income"
      });
    }

    // Real estate / Business / Giving combined if significant
    const advancedCount = categories.realEstate.length + categories.business.length + categories.charitableGiving.length;
    if (advancedCount > 0 && stories.length < 3) {
      stories.push({
        title: "Advanced Planning",
        insight: `${advancedCount} advanced strategies including real estate, business, and charitable planning.`,
        type: "growth"
      });
    }

    // Fallback if no specific categories
    if (stories.length === 0 && matchedStrategies.length > 0) {
      stories.push({
        title: "Planning Opportunities",
        insight: `We identified ${matchedStrategies.length} strategies worth exploring with a qualified professional.`,
        type: "growth"
      });
    }

    return stories.slice(0, 3);
  };

  // Group strategies by category for display
  const groupedStrategies = () => {
    const groups: Record<string, MatchedStrategy[]> = {
      'Tax Efficiency': [],
      'Retirement & Income': [],
      'Charitable Giving': [],
      'Real Estate': [],
      'Business & Estate': [],
      'Education': [],
    };
    
    matchedStrategies.forEach(s => {
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
        // Default bucket
        groups['Tax Efficiency'].push(s);
      }
    });
    
    // Filter out empty groups
    return Object.entries(groups).filter(([_, strategies]) => strategies.length > 0);
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

  const grouped = groupedStrategies();

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

        {/* Strategy Catalog Section - Grouped by Category */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-textPrimary">Recommended Strategies</h2>
            <span className="bg-primarySoft text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {matchedStrategies.length} Found
            </span>
          </div>
          
          {grouped.map(([groupName, strategies]) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-lg font-semibold text-textPrimary border-b border-border pb-2">
                {groupName}
                <span className="ml-2 text-sm font-normal text-textSecondary">
                  ({strategies.length})
                </span>
              </h3>
              <div className="grid gap-4">
                {strategies.map((strategy) => (
                  <StrategyCard 
                    key={strategy.id} 
                    strategy={strategy} 
                    onExplore={() => console.log("Explore", strategy.title)} 
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

      </main>

      <DisclosureFooter />
    </div>
  );
};

export default Index;
