import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/StrategyCard";
import { RotateCcw, Shield, AlertCircle } from "lucide-react";
import { Strategy, UserProfile, computeTransitionFlags } from "@/types/persona";
import { getTransitionYearCautions } from "@/data/strategies";

interface ResultsStepProps {
  profile: UserProfile;
  strategies: Strategy[];
  onRestart: () => void;
}

function getTransitionMessage(profile: UserProfile): string {
  const flags = computeTransitionFlags(profile);
  
  if (flags.bothUnemployed) {
    return "With both of you in transition, this year represents an unusual planning window. Some opportunities available now may not exist once income returns to typical levels.";
  }
  
  if (flags.anyoneUnemployed && flags.incomeLowerThanTypical) {
    return "Income transitions can create rare planning windows. The goal isn't to act automatically — it's to recognize leverage when it appears and evaluate your options thoughtfully.";
  }
  
  if (flags.anyoneUnemployed && flags.shortTermTransition) {
    return "With an expected return to income on the horizon, this may be a limited window for certain strategies. Time-sensitive opportunities are worth understanding now.";
  }
  
  if (flags.anyoneUnemployed) {
    return "Career transitions bring uncertainty, but they also bring flexibility. This period may offer planning options that aren't available during typical earning years.";
  }
  
  const largeBalance = ['1m-2.5m', '2.5m-5m', '>5m'].includes(profile.retirementRange);
  if (largeBalance) {
    return "As balances grow, taxes stop being a background issue and start influencing outcomes directly. The window for certain planning moves narrows with time.";
  }
  
  const significantRealEstate = ['750k-2m', '>2m'].includes(profile.realEstateRange);
  if (significantRealEstate) {
    return "Real estate adds flexibility — and complexity. The question becomes how it fits into the broader tax picture alongside your other assets.";
  }
  
  return "People in situations like this often discover opportunities they didn't know existed — not because they missed something, but because timing matters.";
}

function TransitionYearBanner({ profile }: { profile: UserProfile }) {
  const flags = computeTransitionFlags(profile);
  
  if (!flags.isTransitionYear) return null;

  return (
    <div className="bg-gold-light border border-gold/20 rounded-xl p-6 mb-8 opacity-0 animate-fade-up animation-delay-100">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg mb-2">
            {flags.bothUnemployed 
              ? "Dual Transition Year Detected" 
              : "Transition Year Planning Window"}
          </h3>
          <p className="text-sm text-foreground/80">
            {flags.bothUnemployed
              ? "With both partners in transition, this year offers unusual planning flexibility. The strategies below are ordered to prioritize time-sensitive opportunities."
              : flags.incomeLowerThanTypical
                ? "Your lower-than-typical income this year may unlock planning strategies that aren't available during higher-earning years."
                : "Career transitions often create planning windows. The strategies below reflect opportunities that may be relevant to your current situation."
            }
          </p>
        </div>
      </div>
    </div>
  );
}

function CautionaryNotes({ profile }: { profile: UserProfile }) {
  const cautions = getTransitionYearCautions(profile);
  
  if (cautions.length === 0) return null;

  return (
    <div className="bg-muted/50 rounded-xl p-6 mb-8 opacity-0 animate-fade-up animation-delay-400">
      <h3 className="font-serif font-semibold text-lg mb-4">
        Important Considerations
      </h3>
      <ul className="space-y-3">
        {cautions.map((caution, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-warm-gray shrink-0 mt-2" />
            {caution}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultsStep({ profile, strategies, onRestart }: ResultsStepProps) {
  const transitionMessage = getTransitionMessage(profile);
  const flags = computeTransitionFlags(profile);

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
          <div className="text-center mb-8 opacity-0 animate-fade-up">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto italic mb-8">
              "{transitionMessage}"
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Strategies Worth Exploring
            </h1>
            <p className="text-muted-foreground">
              Based on what you shared, {profile.firstName}
              {flags.isTransitionYear && (
                <span className="text-gold font-medium"> • Transition year insights included</span>
              )}
            </p>
          </div>

          {/* Transition Year Banner */}
          <TransitionYearBanner profile={profile} />

          {/* Strategies Grid */}
          {strategies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {strategies.map((strategy, index) => (
                <StrategyCard key={strategy.id} strategy={strategy} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl shadow-card mb-8 opacity-0 animate-fade-up animation-delay-100">
              <p className="text-muted-foreground">
                Based on your inputs, we don't have specific strategies to highlight right now. 
                Consider speaking with a tax professional about your situation.
              </p>
            </div>
          )}

          {/* Cautionary Notes */}
          <CautionaryNotes profile={profile} />

          {/* CTA Section */}
          <div className="bg-sage-light/50 rounded-2xl p-8 text-center opacity-0 animate-fade-up animation-delay-500">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Ready to Take the Next Step?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              These strategies are educational starting points. A qualified tax professional 
              can help evaluate which approaches make sense for your specific situation
              {flags.isTransitionYear && " — especially given your current transition"}. 
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
