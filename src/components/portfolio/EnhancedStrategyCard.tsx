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
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactBadge } from "./ImpactBadge";
import type { Strategy } from "@/types/persona";
import { getStrategyExample, type StrategyExample } from "@/data/strategy-examples";
import { cn } from "@/lib/utils";

interface EnhancedStrategyCardProps {
  strategy: Strategy;
  defaultExpanded?: boolean;
}

export function EnhancedStrategyCard({ strategy, defaultExpanded = false }: EnhancedStrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const example = getStrategyExample(strategy.id);

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

            {/* Potential Savings Preview */}
            {example && !isExpanded && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Potential savings: {example.potentialSavings}
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
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        Why This Appeared For You
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">{whyForYou}</p>
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
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900">
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                      <span className="text-base">💡</span> Real-World Example
                    </h4>
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                      {example.scenario}
                    </p>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Potential Savings */}
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">
                          Potential Savings
                        </h4>
                      </div>
                      <p className="text-lg font-bold text-green-700 dark:text-green-400">
                        {example.potentialSavings}
                      </p>
                    </div>

                    {/* Best Timeframe */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                          Best Timeframe
                        </h4>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
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
