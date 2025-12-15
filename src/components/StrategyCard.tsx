import { MatchedStrategy } from "@/types/persona";
import { cn } from "@/lib/utils";
import { Clock, User, BarChart3 } from "lucide-react";

interface StrategyCardProps {
  strategy: MatchedStrategy;
  index: number;
}

const categoryLabels: Record<string, string> = {
  timing: "Timing-Sensitive",
  structure: "Account Structure",
  withdrawal: "Withdrawal Planning",
  giving: "Charitable Giving",
  general: "General Planning",
  'real-estate': "Real Estate",
  business: "Business Planning",
  investment: "Investment Planning"
};

const evaluatorLabels: Record<string, string> = {
  'CPA': 'CPA',
  'CFP': 'CFP',
  'Attorney': 'Estate Attorney',
  'CPA/CFP': 'CPA or CFP',
  'CPA/Attorney': 'CPA or Estate Attorney',
  'CFP/Attorney': 'CFP or Estate Attorney',
  'CPA/CFP/Attorney': 'CPA, CFP, or Estate Attorney'
};

// Impact displayed as guidance, not conclusions
const impactConfig: Record<string, { label: string; description: string; className: string }> = {
  high: {
    label: 'Higher Relevance',
    description: 'Aligns strongly with your inputs',
    className: 'bg-sage/10 text-sage border-sage/20'
  },
  medium: {
    label: 'Moderate Relevance',
    description: 'Aligns with assets and timing',
    className: 'bg-gold/10 text-gold border-gold/20'
  },
  low: {
    label: 'Lower Relevance',
    description: 'Applies, but scope may be limited',
    className: 'bg-muted text-muted-foreground border-border'
  }
};

export function StrategyCard({ strategy, index }: StrategyCardProps) {
  const isTimingSensitive = strategy.category === 'timing' || (strategy.transitionYearPriority && strategy.transitionYearPriority > 50);
  const impact = impactConfig[strategy.computedImpact];

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300 opacity-0 animate-fade-up",
        isTimingSensitive && "ring-2 ring-gold/30"
      )}
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      {/* Header with Category & Impact */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
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
        {/* Impact Indicator - displayed as guidance */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border shrink-0",
          impact.className
        )} title={impact.description}>
          <BarChart3 className="w-3 h-3" />
          <span>{impact.label}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif font-semibold text-xl text-foreground mb-4">
        {strategy.title}
      </h3>

      {/* What This Is */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          What This Is
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {strategy.whatThisIs}
        </p>
      </div>

      {/* Why It Appears Here */}
      <div className="mb-4 p-3 rounded-lg bg-sage/5 border border-sage/10">
        <p className="text-xs font-medium text-sage uppercase tracking-wide mb-1">
          Why It Appears Here
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {strategy.whyItAppears}
        </p>
      </div>

      {/* Why It's Often Explored */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Why It's Often Explored
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {strategy.whyOftenExplored}
        </p>
      </div>

      {/* Who Typically Reviews This */}
      <div className="mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Who Typically Reviews This
          </p>
          <p className="text-sm text-foreground/90">
            {evaluatorLabels[strategy.evaluator] || strategy.evaluator}
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Important Notes
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Educational only</li>
          <li>• Tax outcomes depend on full return details</li>
          <li>• Requires professional review before implementation</li>
        </ul>
      </div>

      {/* Compliance Footer */}
      <div className="pt-3 border-t border-border/30">
        <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
          This tool highlights planning concepts that may warrant further discussion with a qualified tax or legal professional. It does not provide tax advice or individualized recommendations.
        </p>
      </div>
    </div>
  );
}
