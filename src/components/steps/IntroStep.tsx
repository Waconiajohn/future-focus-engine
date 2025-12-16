import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, AlertTriangle, Clock, TrendingUp } from "lucide-react";

interface IntroStepProps {
  onStart: () => void;
}

export function IntroStep({ onStart }: IntroStepProps) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif font-semibold text-lg">Tax Opportunity Explorer</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight opacity-0 animate-fade-up">
              Discover Tax Strategies<br />
              <span className="text-sage">Worth Exploring</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed opacity-0 animate-fade-up animation-delay-100">
              Answer a few simple questions to see which retirement tax planning 
              opportunities might be relevant to your situation.
            </p>
          </div>

          {/* Three Costly Blunders Section */}
          <div className="bg-card/80 rounded-2xl p-6 sm:p-8 mb-12 border border-border/50 opacity-0 animate-fade-up animation-delay-150">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-3">
                <AlertTriangle className="h-4 w-4" />
                Common Retirement Tax Mistakes
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Three Costly Blunders That Can Spoil Your Retirement
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Most retirees are shocked to learn that taxes can be their largest expense in retirement.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Blunder 1 */}
              <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">No Withdrawal Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    You had a strategy to save, but no plan for tax-efficient withdrawals. Without one, 
                    you could pay significantly more in taxes than necessary once RMDs and large withdrawals kick in.
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">
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
                  <h3 className="font-semibold text-foreground mb-1">Ignoring RMD "Tax Bombs"</h3>
                  <p className="text-sm text-muted-foreground">
                    At age 73, the IRS forces Required Minimum Distributions from traditional retirement accounts. 
                    These can push you into higher brackets and spike taxes on Social Security and Medicare premiums.
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">
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
                  <h3 className="font-semibold text-foreground mb-1">Failing to Plan for Higher Rates</h3>
                  <p className="text-sm text-muted-foreground">
                    We are in a historically low tax regime scheduled to sunset. Many experts anticipate higher 
                    tax rates ahead. Without preparation, future hikes could delay retirement or force lifestyle cuts.
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">
                    💡 One family saved ~$225,000 through proactive tax optimization, allowing them to retire on time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-foreground/80 font-medium">
                The good news? <span className="text-sage">It's not too late.</span> By avoiding these mistakes, 
                you can potentially save tens or even hundreds of thousands over your retirement.
              </p>
            </div>
          </div>

          {/* Why This Is Often Overlooked */}
          <div className="bg-card/50 rounded-2xl p-6 mb-12 text-left opacity-0 animate-fade-up animation-delay-200">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Why This Is Often Overlooked
            </h2>
            <div className="space-y-3 text-foreground/80 text-sm leading-relaxed">
              <p>
                Most financial advisory relationships are built around investment management, not coordinated, multi-year tax planning. That isn't a failure—it's how the industry is structured.
              </p>
              <p>
                Effective tax planning often requires collaboration between financial advisors, CPAs, and sometimes attorneys. Many professionals intentionally stay within their defined roles to avoid overstepping or creating liability.
              </p>
              <p>
                As a result, important timing windows—such as unemployment, early retirement, business sales, or account transitions—can be easy to miss without a deliberate process in place.
              </p>
              <p>
                This tool exists to help surface those moments and highlight which planning ideas may be worth discussing with qualified professionals who can evaluate your full situation.
              </p>
              <p className="text-muted-foreground italic pt-2 border-t border-border/50">
                This tool does not provide tax advice. It helps you ask better questions at the right time.
              </p>
            </div>
          </div>

          {/* What This Does / Doesn't Do */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12 opacity-0 animate-fade-up animation-delay-200">
            <div className="bg-sage-light/30 rounded-xl p-6">
              <h2 className="font-serif font-semibold text-lg mb-3 text-sage">What This Tool Does</h2>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Identifies tax-planning concepts that may be relevant based on your situation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Shows how people in similar stages of life think about these decisions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Helps you prepare more informed conversations with tax and financial professionals
                </li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-xl p-6">
              <h2 className="font-serif font-semibold text-lg mb-3 text-muted-foreground">What This Tool Doesn't Do</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Provide tax, legal, or investment advice
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Calculate specific dollar outcomes or guaranteed savings
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Replace professional judgment or individualized planning
                </li>
              </ul>
            </div>
          </div>

          {/* The Biggest Opportunity Section */}
          <div className="bg-card/60 rounded-2xl p-8 mb-12 opacity-0 animate-fade-up animation-delay-250">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-6 text-center">
              The Biggest Opportunity Many Retirement Plans Miss
            </h2>
            
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Long-term financial outcomes are often influenced more by <span className="text-sage font-medium">reducing avoidable lifetime taxes</span> than by trying to earn higher investment returns.
              </p>
              
              <p>
                Taxes compound quietly over decades—through income changes, account growth, and required distributions. Small inefficiencies early on can turn into meaningful drags over a 20- or 30-year retirement.
              </p>
              
              <p>
                Because tax planning sits between disciplines, it often receives less attention than it deserves. This tool is designed to bring those considerations forward—before timing removes the opportunity.
              </p>
              
              <blockquote className="border-l-4 border-sage pl-4 py-2 mt-6 italic text-sage">
                The goal isn't to do everything. It's to recognize which opportunities exist while they're still available.
              </blockquote>
            </div>
          </div>

          {/* How It Works */}
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 text-center opacity-0 animate-fade-up animation-delay-300">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left mb-12 opacity-0 animate-fade-up animation-delay-300">
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">1</span>
              </div>
              <h3 className="font-medium mb-1">1. Share Your Situation</h3>
              <p className="text-sm text-muted-foreground">
                Answer a few simple questions about your stage of life and what you own. Takes about two minutes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">2</span>
              </div>
              <h3 className="font-medium mb-1">2. See Similar Stories</h3>
              <p className="text-sm text-muted-foreground">
                View examples of how people in comparable situations think about these decisions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">3</span>
              </div>
              <h3 className="font-medium mb-1">3. Explore Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Identify strategies that may be worth discussing with a qualified professional.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-12 opacity-0 animate-fade-up animation-delay-350">
            <Button 
              variant="sage" 
              size="xl" 
              onClick={onStart}
              className="group"
            >
              Start with a Few Simple Questions
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Takes about 2 minutes
            </p>
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
