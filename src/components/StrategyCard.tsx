import { Strategy } from "@/types/persona";
import { cn } from "@/lib/utils";
import { TrendingUp, Minus, TrendingDown, Clock } from "lucide-react";

interface StrategyCardProps {
  strategy: Strategy;
  index: number;
}

const impactConfig = {
  high: {
    label: "High Impact",
    icon: TrendingUp,
    className: "bg-sage/10 text-sage border-sage/20"
  },
  medium: {
    label: "Medium Impact",
    icon: Minus,
    className: "bg-gold/10 text-gold border-gold/20"
  },
  low: {
    label: "Lower Impact",
    icon: TrendingDown,
    className: "bg-muted text-muted-foreground border-border"
  }
};

const categoryLabels: Record<string, string> = {
  timing: "Timing-Sensitive",
  structure: "Account Structure",
  withdrawal: "Withdrawal Planning",
  giving: "Charitable Giving",
  general: "General Planning"
};

export function StrategyCard({ strategy, index }: StrategyCardProps) {
  const impact = impactConfig[strategy.impact];
  const Icon = impact.icon;
  const isTimingSensitive = strategy.category === 'timing' || (strategy.transitionYearPriority && strategy.transitionYearPriority > 50);

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300 opacity-0 animate-fade-up",
        isTimingSensitive && "ring-2 ring-gold/30"
      )}
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      {/* Why This Appears - FIRST */}
      <div className="mb-4 pb-4 border-b border-border/50">
        <p className="text-sm font-medium text-sage mb-1">
          Why this appears for you
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {strategy.whyForYou}
        </p>
      </div>

      {/* Title & Impact Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isTimingSensitive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium">
                <Clock className="w-3 h-3" />
                Time-Sensitive
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {categoryLabels[strategy.category] || strategy.category}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-xl text-foreground">
            {strategy.title}
          </h3>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shrink-0",
          impact.className
        )}>
          <Icon className="w-3 h-3" />
          {impact.label}
        </div>
      </div>
      
      {/* Plain-English Explanation */}
      <p className="text-foreground/80 leading-relaxed text-sm">
        {strategy.description}
      </p>
    </div>
  );
}
