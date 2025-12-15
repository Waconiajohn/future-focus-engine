import { PersonaStory } from "@/types/persona";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  story: PersonaStory;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  return (
    <div
      className={cn(
        "group gradient-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300 opacity-0 animate-fade-up",
        index === 0 && "animation-delay-100",
        index === 1 && "animation-delay-200",
        index === 2 && "animation-delay-300"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
          <span className="text-sage font-serif font-semibold text-lg">
            {story.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground">
            {story.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Age {story.age}, {story.maritalStatus === 'married' ? 'Married' : 'Single'}
          </p>
        </div>
      </div>
      
      <p className="text-foreground/80 leading-relaxed mb-4">
        {story.narrative}
      </p>
      
      <div className="pt-4 border-t border-border/50">
        <p className="text-sm font-medium text-sage">
          Why this matters
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {story.whyItMatters}
        </p>
      </div>
    </div>
  );
}
