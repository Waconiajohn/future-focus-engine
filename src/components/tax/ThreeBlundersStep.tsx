import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Shield, AlertTriangle, Clock, TrendingUp } from "lucide-react";

interface ThreeBlundersStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export function ThreeBlundersStep({ onContinue, onBack }: ThreeBlundersStepProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif font-semibold text-lg">Tax Opportunity Explorer</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Three Costly Blunders Section */}
          <div className="bg-card/80 rounded-2xl p-6 sm:p-8 mb-12 border border-border/50 opacity-0 animate-fade-up">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-base font-medium mb-4">
                <AlertTriangle className="h-5 w-5" />
                Common Retirement Tax Mistakes
              </span>
              <h1 className="font-serif font-semibold text-foreground text-3xl md:text-4xl lg:text-5xl">
                Three Costly Blunders That Can Spoil Your Retirement
              </h1>
              <p className="text-muted-foreground mt-4 text-lg md:text-xl">
                Most retirees are shocked to learn that taxes can be their largest expense in retirement.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Blunder 1 */}
              <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-xl md:text-2xl">No Withdrawal Plan</h3>
                  <p className="text-muted-foreground text-lg md:text-xl">
                    You had a strategy to save, but no plan for tax-efficient withdrawals. Without one,
                    you could pay significantly more in taxes than necessary once RMDs and large withdrawals kick in.
                  </p>
                  <p className="text-primary font-medium mt-3 text-base md:text-lg">
                    💡 One couple saved ~$790,000 in lifetime taxes by implementing Roth conversions and timing distributions strategically.
                  </p>
                </div>
              </div>

              {/* Blunder 2 */}
              <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-xl md:text-2xl">Ignoring RMD "Tax Bombs"</h3>
                  <p className="text-muted-foreground text-lg md:text-xl">
                    At age 73, the IRS forces Required Minimum Distributions from traditional retirement accounts.
                    These can push you into higher brackets and spike taxes on Social Security and Medicare premiums.
                  </p>
                  <p className="text-primary font-medium mt-3 text-base md:text-lg">
                    💡 One couple avoided ~$490,000 in taxes using QCDs and partial Roth conversions to manage RMDs.
                  </p>
                </div>
              </div>

              {/* Blunder 3 */}
              <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-xl md:text-2xl">Failing to Plan for Higher Rates</h3>
                  <p className="text-muted-foreground text-lg md:text-xl">
                    We are in a historically low tax regime scheduled to sunset. Many experts anticipate higher
                    tax rates ahead. Without preparation, future hikes could delay retirement or force lifestyle cuts.
                  </p>
                  <p className="text-primary font-medium mt-3 text-base md:text-lg">
                    💡 One family saved ~$225,000 through proactive tax optimization, allowing them to retire on time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-foreground/80 font-medium text-lg">
                The good news? <span className="text-sage font-semibold">It's not too late.</span> By avoiding these mistakes, 
                you can potentially save tens or even hundreds of thousands over your retirement.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 opacity-0 animate-fade-up animation-delay-150">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onBack}
              className="group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
            <Button 
              variant="sage" 
              size="xl" 
              onClick={onContinue}
              className="group"
            >
              Continue
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6">
        <p className="text-xs text-muted-foreground font-medium mb-1 text-center">Important Notice</p>
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
          This tool provides educational information only. It does not constitute tax, legal, 
          or investment advice. Always consult a qualified professional before making financial decisions.
        </p>
      </footer>
    </div>
  );
}
