import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Clock, 
  Users, 
  Lightbulb,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactBadge } from "./ImpactBadge";
import type { Strategy, RetirementRange } from "@/types/persona";
import { getStrategyExample, type StrategyExample } from "@/data/strategy-examples";
import { calculatePersonalizedEstimate, formatEstimate } from "@/lib/personalized-estimates";
import { cn } from "@/lib/utils";

interface EnhancedStrategyCardProps {
  strategy: Strategy;
  defaultExpanded?: boolean;
  retirementRange?: RetirementRange;
  age?: number;
}

export function EnhancedStrategyCard({ 
  strategy, 
  defaultExpanded = false,
  retirementRange = "500k-1M",
  age = 55
}: EnhancedStrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const example = getStrategyExample(strategy.id);
  const personalizedEstimate = calculatePersonalizedEstimate(strategy.id, retirementRange, age);

  const whatItIs = strategy.whatThisIs || strategy.description || "";
  const whyForYou = strategy.whyItAppears || strategy.whyForYou || strategy.triggerReason || "";

  return (
    <Card className={cn(
      "overflow-hidden border transition-all duration-300",
      isExpanded 
        ? "border-primary/30 shadow-lg ring-1 ring-primary/10" 
        : "border-border/50 shadow-sm hover:shadow-md hover:border-border"
    )}>
      {/* Header - Always Visible */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-semibold text-lg text-foreground">
                {strategy.title}
              </h3>
              <ImpactBadge impact={strategy.impact} />
              {strategy.evaluator && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {strategy.evaluator}
                </span>
              )}
            </div>
            
            {/* What it is - brief version always shown */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {whatItIs.length > 150 ? whatItIs.slice(0, 150) + "..." : whatItIs}
            </p>

            {/* Personalized Savings Preview */}
            {!isExpanded && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Your estimated savings: {formatEstimate(personalizedEstimate)}
                </span>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardContent className="px-5 pb-6 pt-0 space-y-5">
              
              {/* Why It Appears For You */}
              {whyForYou && (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Why This Appeared For You
                      </h4>
                      <p className="text-sm text-muted-foreground">{whyForYou}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Description */}
              {whatItIs.length > 150 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">How It Works</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{whatItIs}</p>
                </div>
              )}

              {/* Example Scenario */}
              {example && (
                <>
                  <div className="p-4 bg-accent/50 rounded-lg border border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="text-base">💡</span> Real-World Example
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {example.scenario}
                    </p>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Personalized Savings */}
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold text-foreground">
                          Your Estimated Savings
                        </h4>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatEstimate(personalizedEstimate)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {personalizedEstimate.explanation}
                      </p>
                    </div>

                    {/* Best Timeframe */}
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold text-foreground">
                          Best Timeframe
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {example.timeframe}
                      </p>
                    </div>
                  </div>

                  {/* Who Should Consider */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-semibold text-foreground">Who Should Consider This</h4>
                    </div>
                    <ul className="space-y-2">
                      {example.whoShouldConsider.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* CTA */}
              <div className="pt-2 flex items-center gap-3">
                <Button className="gap-2">
                  Discuss With Advisor
                </Button>
                <span className="text-xs text-muted-foreground">
                  Consult {strategy.evaluator || "a tax professional"} before implementing
                </span>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
