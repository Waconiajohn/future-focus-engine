
import { useState } from "react";
import { Persona } from "@/types/persona";
import { PersonaSelector } from "@/components/portfolio/PersonaSelector";
import { ProgressStepper } from "@/components/portfolio/ProgressStepper";
import { StoryCard } from "@/components/portfolio/StoryCard";
import { StrategyCard } from "@/components/portfolio/StrategyCard";
import { DisclosureFooter } from "@/components/portfolio/DisclosureFooter";
import { FrontPageIntro } from "@/components/tax/FrontPageIntro";
import { evaluateStrategies, STRATEGIES } from "@/data/strategyCatalog";
import type { TriggerResult } from "@/types/persona";

const steps = ["Overview", "Your profile", "Results"];

const defaultPersona: Persona = {
  ageBand: "50-54",
  maritalStatus: "Married",
  employment: "Unemployed",
  retirementRange: "500k-1M",
  realEstate: "Primary",
};

export function TaxOnboarding() {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<Persona>(defaultPersona);
  const [results, setResults] = useState<TriggerResult[]>([]);

  // When persona is complete (Step 1 -> 2), evaluate strategies
  const handlePersonaComplete = (newPersona: Persona) => {
    setPersona(newPersona);
    const matches = evaluateStrategies(newPersona);
    
    // Sort matches: High confidence -> Medium -> Low
    const sorted = matches.sort((a, b) => {
      const weight = { High: 3, Medium: 2, Low: 1 };
      return weight[b.confidence] - weight[a.confidence];
    });

    setResults(sorted);
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Helper to get top stories (simplified version of filtering)
  const getTopStories = () => {
    const stories: { title: string; insight: string; type: "tax" | "growth" | "income" }[] = [];
    
    // Tax story if high confidence tax strategy exists
    const taxStrats = results.filter(r => 
      STRATEGIES.find(s => s.id === r.strategyId)?.whyThisMayApply.toLowerCase().includes("tax") && r.confidence === "High"
    );
    if (taxStrats.length > 0) {
      stories.push({
        title: "Tax Efficiency Opportunity",
        insight: "Based on your profile, you have significant opportunities to reduce your lifetime tax burden through strategic planning.",
        type: "tax"
      });
    }

    // Income story
    const incomeStrats = results.filter(r => 
      STRATEGIES.find(s => s.id === r.strategyId)?.whyThisMayApply.toLowerCase().includes("income") && r.confidence === "High"
    );
    if (incomeStrats.length > 0) {
      stories.push({
        title: "Income Security",
        insight: `You have ${incomeStrats.length} high-impact strategies available to strengthen your income stream.`,
        type: "income"
      });
    }

    // Growth story fallback
    if (stories.length < 2 && results.length > 0) {
      stories.push({
        title: "Growth Strategy",
        insight: `We identified ${results.length} total strategies relevant to your situation that could optimize your wealth accumulation.`,
        type: "growth"
      });
    }

    return stories.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ProgressStepper currentStep={step + 1} totalSteps={steps.length} labels={steps} />

        {/* STEP 0: Marketing / What is this */}
        {step === 0 && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <FrontPageIntro />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-white hover:opacity-95 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Persona selections */}
        {step === 1 && (
          <div className="mt-8 animate-fade-in">
            <div className="rounded-lg bg-surface border border-border p-8 shadow-subtle mb-8">
              <div className="text-xs font-semibold tracking-wide text-textMuted">PROFILE</div>
              <h2 className="mt-2 font-semibold leading-tight text-textPrimary text-[clamp(2rem,3.2vw,3.25rem)]">
                Pick the options that best match your situation
              </h2>
              <p className="mt-3 leading-normal text-textSecondary text-[clamp(1.125rem,1.4vw,1.35rem)]">
                These inputs help show stories and strategies that may be worth discussing.
              </p>
            </div>

            {/* Reusing PersonaSelector but overriding its internal navigation for this parent flow if needed, 
                or just passed handlePersonaComplete as onComplete */}
            <PersonaSelector onComplete={handlePersonaComplete} />
            
            {/* Note: PersonaSelector has its own internal stepper and navigation buttons. 
                Ideally we refactor PersonaSelector to be controlled or handle the "Back" to step 0 here. 
                For now, let's allow PersonaSelector to drive the persona completion. */}
            
            <div className="mt-4">
               <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-sm text-textMuted hover:text-textPrimary"
                >
                  ← Back to Overview
                </button>
            </div>
          </div>
        )}

        {/* STEP 2: Results */}
        {step === 2 && (
          <div className="mt-8 space-y-12 animate-fade-in">
            
            {/* Stories */}
            <section className="space-y-6">
              <div className="rounded-lg bg-surface border border-border p-8 shadow-subtle">
                <div className="text-xs font-semibold tracking-wide text-textMuted">RESULTS</div>
                <h1 className="mt-2 font-semibold leading-tight text-textPrimary text-[clamp(2rem,3.2vw,3.25rem)]">
                  Stories and opportunities worth discussing
                </h1>
                <p className="mt-3 leading-normal text-textSecondary text-[clamp(1.125rem,1.4vw,1.35rem)]">
                  This view highlights tax-planning topics that may be relevant based on your situation.
                  It does not provide advice or savings estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTopStories().map((story, i) => (
                  <StoryCard key={i} {...story} />
                ))}
              </div>
            </section>

            {/* Opportunities */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-textPrimary text-[clamp(1.5rem,2vw,2rem)]">Opportunities</h2>
                  <p className="mt-1 text-textSecondary text-[clamp(1rem,1.15vw,1.125rem)]">
                    Educational signals to prepare for professional conversations.
                  </p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  {results.length} Found
                </span>
              </div>

              <div className="grid gap-4">
                {results.map((result) => {
                  const strategy = STRATEGIES.find(s => s.id === result.strategyId);
                  if (!strategy) return null;
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

            <div className="flex items-center justify-start pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-border bg-surface px-5 py-3 text-base font-semibold text-textPrimary hover:bg-surfaceMuted transition"
              >
                Edit selections
              </button>
            </div>

            <DisclosureFooter />
          </div>
        )}
      </div>
    </div>
  );
}
