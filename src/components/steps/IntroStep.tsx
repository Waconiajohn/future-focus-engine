import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

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
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight opacity-0 animate-fade-up">
              Discover Tax Strategies<br />
              <span className="text-sage">Worth Exploring</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed opacity-0 animate-fade-up animation-delay-100">
              Answer a few simple questions to see which retirement tax planning 
              opportunities might be relevant to your situation.
            </p>

          </div>

          {/* What This Does / Doesn't Do */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12 opacity-0 animate-fade-up animation-delay-200">
            <div className="bg-sage-light/30 rounded-xl p-6">
              <h3 className="font-serif font-semibold text-lg mb-3 text-sage">What This Tool Does</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Identifies tax strategies that may be relevant based on your situation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Shows how people in similar circumstances approach these decisions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                  Helps you prepare informed questions for professional conversations
                </li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-serif font-semibold text-lg mb-3 text-muted-foreground">What This Tool Doesn't Do</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Provide tax, legal, or investment advice
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Calculate specific dollar amounts or savings
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-gray mt-2 shrink-0" />
                  Replace professional guidance for your specific circumstances
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-12 opacity-0 animate-fade-up animation-delay-250">
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

          {/* The Biggest Opportunity Section */}
          <div className="bg-card/60 rounded-2xl p-8 mb-12 opacity-0 animate-fade-up animation-delay-300">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-6 text-center">
              The Biggest Opportunity Most Retirement Plans Miss
            </h2>
            
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Improving long-term financial outcomes is often driven more by <span className="text-sage font-medium">reducing avoidable lifetime taxes</span> than by earning higher investment returns. Yet this lever rarely gets the attention it deserves.
              </p>
              
              <p>
                Taxes quietly compound across decades — through income changes, account growth, and required distributions. Small inefficiencies early on can become significant drains over a 20 or 30-year retirement.
              </p>
              
              <p>
                Most financial advisors focus on accumulation and portfolio management, not coordinated multi-year tax analysis. This isn't neglect — it's how the industry is structured and incentivized. Tax planning often falls between the cracks.
              </p>
              
              <div className="bg-sage-light/30 rounded-xl p-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> This tool does not provide tax, legal, or investment advice. It helps identify which tax strategies may be worth discussing with qualified professionals who can evaluate your specific situation.
                </p>
              </div>
              
              <p className="text-center font-serif text-lg text-sage mt-6 italic">
                "The goal isn't to do everything — it's to recognize which opportunities exist before timing removes them."
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="grid sm:grid-cols-3 gap-6 text-left opacity-0 animate-fade-up animation-delay-300">
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">1</span>
              </div>
              <h3 className="font-medium mb-1">Share Your Situation</h3>
              <p className="text-sm text-muted-foreground">
                Simple questions about your stage of life
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">2</span>
              </div>
              <h3 className="font-medium mb-1">See Similar Stories</h3>
              <p className="text-sm text-muted-foreground">
                Learn how others approach these decisions
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-3">
                <span className="text-sage font-serif font-bold">3</span>
              </div>
              <h3 className="font-medium mb-1">Explore Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Discover strategies worth discussing with a professional
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6">
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
          This tool provides educational information only. It does not constitute tax, legal, 
          or investment advice. Consult a qualified professional before making financial decisions.
        </p>
      </footer>
    </div>
  );
}
