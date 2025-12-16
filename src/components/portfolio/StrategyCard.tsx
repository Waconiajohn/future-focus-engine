
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactBadge } from "./ImpactBadge";
import type { Strategy } from "@/types/persona";
import { cn } from "@/lib/utils";

function getStrategySummary(strategy: Strategy): {
  why: string;
  scenario: string;
  window: string;
  professional: string;
  cpaSummary: string;
  cta: string;
} {
  // Support both “catalog” shape (whyThisMayApply/scenario/decisionWindow) and
  // “engine” shape (whatThisIs/description/whyForYou/triggerReason).
  const why =
    strategy.whyThisMayApply ||
    strategy.whyForYou ||
    strategy.whyItAppears ||
    strategy.triggerReason ||
    "Relevant based on your profile.";

  const scenario =
    strategy.scenario ||
    strategy.description ||
    strategy.whatThisIs ||
    strategy.whyOftenExplored ||
    "";

  const window =
    strategy.decisionWindow ||
    (strategy.category ? `Category: ${strategy.category}` : "") ||
    "";

  const professional = strategy.professional || strategy.evaluator || "";

  const cpaSummary =
    strategy.cpaSummary ||
    (strategy.triggerReason ? `Trigger: ${strategy.triggerReason}` : "") ||
    "";

  const cta = strategy.cta || "Worth discussing";

  return { why, scenario, window, professional, cpaSummary, cta };
}

interface StrategyCardProps {
  strategy: Strategy;
  onExplore?: () => void;
}

export function StrategyCard({ strategy, onExplore }: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { why, scenario, window, professional, cpaSummary, cta } = getStrategySummary(strategy);

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className={cn(
          "p-5 cursor-pointer relative group",
          isExpanded ? "bg-muted/10" : "bg-card"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {strategy.title}
              </h3>
              <ImpactBadge impact={strategy.impact} />
            </div>
            {!isExpanded && (
              <p className="text-sm text-textSecondary line-clamp-1">{why}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {professional ? (
              <span className="text-xs font-medium text-textMuted bg-surfaceMuted px-2 py-1 rounded hidden sm:inline-block">
                {professional}
              </span>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-textMuted group-hover:text-foreground transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="px-5 pb-5 pt-0 space-y-6">
              <div className="pt-2 space-y-4">
                {/* Why this matters */}
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
                    Why It Matters
                  </h4>
                  <p className="text-sm text-blue-900">{why}</p>
                </div>

                {/* The Concept */}
                {scenario ? (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">The Strategy</h4>
                    <p className="text-sm text-textSecondary leading-relaxed">{scenario}</p>
                  </div>
                ) : null}

                {/* Professional Context */}
                {cpaSummary ? (
                  <div className="flex items-start gap-3 pt-2">
                    <div className="p-2 bg-surfaceMuted rounded-full">
                      <User className="h-4 w-4 text-textSecondary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-textMuted mb-0.5">
                        Professional Context{professional ? ` (${professional})` : ""}
                      </h4>
                      <p className="text-xs text-textSecondary italic">"{cpaSummary}"</p>
                    </div>
                  </div>
                ) : null}

                {/* Meta details */}
                {window ? (
                  <div className="flex items-center gap-4 text-xs text-textMuted pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {window.startsWith("Category") ? window : `Window: ${window}`}
                    </div>
                  </div>
                ) : null}

                <div className="pt-2">
                  <Button
                    className="w-full sm:w-auto gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplore?.();
                    }}
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
