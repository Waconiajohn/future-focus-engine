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

      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight opacity-0 animate-fade-up">
            Discover Tax Strategies<br />
            <span className="text-sage">Worth Exploring</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed opacity-0 animate-fade-up animation-delay-100">
            Answer a few simple questions to see which retirement tax planning 
            opportunities might be relevant to your situation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 animate-fade-up animation-delay-200">
            <Button 
              variant="sage" 
              size="xl" 
              onClick={onStart}
              className="group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Takes about 2 minutes
            </p>
          </div>

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
