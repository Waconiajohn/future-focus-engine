import { useState } from "react";
import { PersonaSelector } from "@/components/portfolio/PersonaSelector";
import { IntroStep } from "@/components/steps/IntroStep";
import { ResultsPage } from "@/components/portfolio/ResultsPage";
import { matchStrategies } from "@/data/strategies-v2";
import { personaToUserProfile } from "@/domain/tax/profileAdapter";
import type { Persona, MatchedStrategy } from "@/types/persona";
import { Shield } from "lucide-react";

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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tax Opportunity Explorer</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Answer a few questions to discover relevant strategies.
          </p>
        </div>
        <PersonaSelector onComplete={handlePersonaComplete} />
      </div>
    );
  }

  // Results view
  return (
    <ResultsPage 
      matchedStrategies={matchedStrategies} 
      persona={persona} 
      onRestart={resetFlow} 
    />
  );
};

export default Index;
