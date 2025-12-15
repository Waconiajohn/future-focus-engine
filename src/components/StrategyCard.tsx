import { MatchedStrategy } from "@/types/persona";
import { cn } from "@/lib/utils";
import { TrendingUp, Minus, TrendingDown, Clock, User } from "lucide-react";

interface StrategyCardProps {
  strategy: MatchedStrategy;
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

const urgencyLabels: Record<string, { label: string; className: string }> = {
  'worth-deeper-review': {
    label: 'Worth Deeper Review',
    className: 'text-sage font-medium'
  },
  'worth-considering': {
    label: 'Worth Considering',
    className: 'text-gold font-medium'
  },
  'worth-noting': {
    label: 'Worth Noting',
    className: 'text-muted-foreground'
  }
};

const evaluatorLabels: Record<string, string> = {
  'CPA': 'CPA',
  'CFP': 'CFP',
  'Attorney': 'Attorney',
  'CPA/CFP': 'CPA or CFP',
  'CPA/Attorney': 'CPA or Attorney',
  'CFP/Attorney': 'CFP or Attorney',
  'CPA/CFP/Attorney': 'CPA, CFP, or Attorney'
};

export function StrategyCard({ strategy, index }: StrategyCardProps) {
  const impact = impactConfig[strategy.computedImpact];
  const Icon = impact.icon;
  const isTimingSensitive = strategy.category === 'timing' || (strategy.transitionYearPriority && strategy.transitionYearPriority > 50);
  const urgency = urgencyLabels[strategy.urgencyLevel];

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300 opacity-0 animate-fade-up",
        isTimingSensitive && "ring-2 ring-gold/30"
      )}
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      {/* Why This Appears */}
      <div className="mb-4 pb-4 border-b border-border/50">
        <p className="text-sm font-medium text-sage mb-1">
          Why this appears for you
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {strategy.whyForYou}
        </p>
        
        {/* Condition Triggered */}
        <div className="mt-3 p-2 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Condition met:</span> {strategy.triggerReason}
          </p>
        </div>
        
        {/* Urgency level indicator */}
        <p className={cn("text-xs mt-2", urgency.className)}>
          {urgency.label}
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
      <p className="text-foreground/80 leading-relaxed text-sm mb-4">
        {strategy.description}
      </p>

      {/* Evaluator & Coordination Footer */}
      <div className="pt-3 border-t border-border/30 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span>
            <span className="font-medium">Who should evaluate:</span>{' '}
            {evaluatorLabels[strategy.evaluator] || strategy.evaluator}
          </span>
        </div>
        <p className="text-xs text-muted-foreground/70 italic">
          Professional coordination required. This is not tax advice.
        </p>
      </div>
    </div>
  );
}
