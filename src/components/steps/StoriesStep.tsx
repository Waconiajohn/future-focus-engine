import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/StoryCard";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PersonaStory } from "@/types/persona";

interface StoriesStepProps {
  firstName: string;
  stories: PersonaStory[];
  onContinue: () => void;
  onBack: () => void;
}

export function StoriesStep({ firstName, stories, onContinue, onBack }: StoriesStepProps) {
  return (
    <div className="min-h-screen gradient-hero">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ProgressIndicator currentStep={6} totalSteps={7} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              People in a Similar Stage Often<br />
              <span className="text-sage">Think About Tax Planning Like This</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {firstName}, here are stories from people whose situations may resonate with yours.
            </p>
          </div>

          {stories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {stories.map((story, index) => (
                <StoryCard key={story.id} story={story} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-0 animate-fade-up animation-delay-100">
              <p className="text-muted-foreground">
                We're building more stories for situations like yours. 
                Let's continue to explore strategies that may apply.
              </p>
            </div>
          )}

          <div className="bg-card/80 rounded-2xl p-8 text-center shadow-card opacity-0 animate-fade-up animation-delay-300">
            <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto">
              "People in situations like this often discover opportunities they didn't know 
              existed — not because they missed something, but because <strong>timing matters</strong>."
            </p>
            <Button variant="sage" size="lg" onClick={onContinue} className="group">
              See Which Strategies May Apply to Me
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
