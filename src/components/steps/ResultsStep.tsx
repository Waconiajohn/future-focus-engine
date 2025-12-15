import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/StrategyCard";
import { RotateCcw, Shield } from "lucide-react";
import { Strategy, UserProfile } from "@/types/persona";

interface ResultsStepProps {
  profile: UserProfile;
  strategies: Strategy[];
  onRestart: () => void;
}

function getTransitionMessage(profile: UserProfile): string {
  if (profile.employmentStatus === 'unemployed') {
    return "Income changes can create rare planning windows. The goal isn't to act automatically — it's to recognize leverage when it appears.";
  }
  
  const largeBalance = ['1m-2.5m', '2.5m-5m', '>5m'].includes(profile.retirementRange);
  if (largeBalance) {
    return "As balances grow, taxes stop being a background issue and start influencing outcomes directly.";
  }
  
  const significantRealEstate = ['750k-2m', '>2m'].includes(profile.realEstateRange);
  if (significantRealEstate) {
    return "Real estate adds flexibility — and complexity. The question becomes how it fits into the broader tax picture.";
  }
  
  return "People in situations like this often discover opportunities they didn't know existed — not because they missed something, but because timing matters.";
}

export function ResultsStep({ profile, strategies, onRestart }: ResultsStepProps) {
  const transitionMessage = getTransitionMessage(profile);
  
  // Sort strategies by impact
  const sortedStrategies = [...strategies].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return (
    <div className="min-h-screen gradient-hero">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-lg">Tax Opportunity Explorer</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Transition Message */}
          <div className="text-center mb-12 opacity-0 animate-fade-up">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto italic mb-8">
              "{transitionMessage}"
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Strategies Worth Exploring
            </h1>
            <p className="text-muted-foreground">
              Based on what you shared, {profile.firstName}
            </p>
          </div>

          {/* Strategies Grid */}
          {sortedStrategies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {sortedStrategies.map((strategy, index) => (
                <StrategyCard key={strategy.id} strategy={strategy} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl shadow-card mb-12 opacity-0 animate-fade-up animation-delay-100">
              <p className="text-muted-foreground">
                Based on your inputs, we don't have specific strategies to highlight right now. 
                Consider speaking with a tax professional about your situation.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-sage-light/50 rounded-2xl p-8 text-center opacity-0 animate-fade-up animation-delay-300">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Ready to Take the Next Step?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              These strategies are educational starting points. A qualified tax professional 
              can help evaluate which approaches make sense for your specific situation.
            </p>
            <Button variant="sage-outline" size="lg">
              Find a Tax Professional
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
              <strong>Important Disclaimer:</strong> This tool provides educational estimates only. 
              It does not provide tax, legal, or investment advice. Tax laws are complex and change frequently. 
              Individual circumstances vary significantly. Consult a CPA, tax attorney, or qualified 
              financial professional before making any decisions based on this information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
