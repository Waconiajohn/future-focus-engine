import { useState, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ListTodo, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recommendation } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ActionPlanPanelProps {
  actionPlan: Recommendation[];
  onSelectCategory?: (categoryKey: string) => void;
}

export interface ActionPlanPanelRef {
  expand: () => void;
  toggle: () => void;
}

function priorityVariant(p: number): "destructive" | "default" | "secondary" {
  if (p <= 2) return "destructive";
  if (p === 3) return "default";
  return "secondary";
}

function priorityLabel(p: number): string {
  if (p <= 2) return "Critical";
  if (p === 3) return "Important";
  return "Quick Win";
}

// Map category to verb-first action title
function getVerbTitle(rec: Recommendation): string {
  const verbMap: Record<string, string> = {
    riskDiversification: "Reduce concentration risk",
    downsideResilience: "Strengthen downside protection",
    performanceOptimization: "Optimize portfolio performance",
    costAnalysis: "Cut investment fees",
    taxEfficiency: "Improve tax efficiency",
    riskAdjusted: "Boost risk-adjusted returns",
    planningGaps: "Complete planning checklist",
    lifetimeIncomeSecurity: "Secure retirement income",
    performanceMetrics: "Review performance metrics",
  };
  
  // If the original title already starts with a verb, use it
  const firstWord = rec.title.split(' ')[0]?.toLowerCase() || '';
  const actionVerbs = ['reduce', 'cut', 'improve', 'boost', 'fix', 'add', 'review', 'secure', 'complete', 'optimize', 'strengthen', 'diversify', 'rebalance', 'consider'];
  
  if (actionVerbs.includes(firstWord)) {
    return rec.title;
  }
  
  return verbMap[rec.category] || `Address ${rec.title.toLowerCase()}`;
}

// Map category to "why this matters" text
function getWhyItMatters(rec: Recommendation): string {
  const whyMap: Record<string, string> = {
    riskDiversification: "One bad investment shouldn't derail your plan",
    downsideResilience: "Protect yourself from market surprises",
    performanceOptimization: "Make your money work harder",
    costAnalysis: "Fees eat into your returns over time",
    taxEfficiency: "Keep more of what you earn",
    riskAdjusted: "Get better returns for the risk you take",
    planningGaps: "Small gaps can become big problems",
    lifetimeIncomeSecurity: "Never worry about outliving your money",
    performanceMetrics: "Know how your portfolio is really doing",
  };
  
  // Use impact if available, otherwise use mapped text
  if (rec.impact) {
    return rec.impact;
  }
  
  return whyMap[rec.category] || "This can improve your financial position";
}

export const ActionPlanPanel = forwardRef<ActionPlanPanelRef, ActionPlanPanelProps>(
  function ActionPlanPanel({ actionPlan, onSelectCategory }, ref) {
  const [isExpanded, setIsExpanded] = useState(false);

  useImperativeHandle(ref, () => ({
    expand: () => setIsExpanded(true),
    toggle: () => setIsExpanded(prev => !prev),
  }));

  if (actionPlan.length === 0) {
    return null;
  }

  // Group actions
  const fixFirst = actionPlan.filter(r => r.priority <= 2);
  const optimizeNext = actionPlan.filter(r => r.priority > 2);

  return (
    <Card className="border-none shadow-soft-lg bg-card/80 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-colors hover:bg-muted/10 group"
      >
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="p-2.5 rounded-full bg-primary/10 text-primary mt-0.5 group-hover:scale-110 transition-transform">
                <ListTodo className="h-6 w-6" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg text-foreground">Action Plan</span>
                  <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {actionPlan.length} Items
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {!isExpanded 
                    ? (fixFirst.length > 0 
                        ? `${fixFirst.length} high priority item${fixFirst.length > 1 ? 's' : ''} require your attention.`
                        : "Optimization opportunities available to improve your strategy.")
                    : "Prioritized steps to strengthen your portfolio."}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 p-1 rounded-full bg-muted/20 group-hover:bg-muted/40 transition-colors"
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </CardContent>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0 px-5 sm:px-6 pb-6 sm:pb-8 space-y-8">
              
              {/* Fix First Section */}
              {fixFirst.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-destructive">
                    <Zap className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Critical Actions
                    </h4>
                  </div>
                  <div className="grid gap-3">
                    {fixFirst.map((rec) => (
                      <ActionItem
                        key={rec.id}
                        recommendation={rec}
                        onSelectCategory={onSelectCategory}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Optimize Next Section */}
              {optimizeNext.length > 0 && (
                <div className="space-y-4 animate-fade-in delay-100">
                  <div className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Optimization Opportunities
                    </h4>
                  </div>
                  <div className="grid gap-3">
                    {optimizeNext.map((rec) => (
                      <ActionItem
                        key={rec.id}
                        recommendation={rec}
                        onSelectCategory={onSelectCategory}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Collapse button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 border-t border-border/40 mt-4"
              >
                <ChevronUp className="h-4 w-4" />
                Collapse Plan
              </button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
});

interface ActionItemProps {
  recommendation: Recommendation;
  onSelectCategory?: (categoryKey: string) => void;
}

function ActionItem({ recommendation, onSelectCategory }: ActionItemProps) {
  const verbTitle = getVerbTitle(recommendation);
  const whyItMatters = getWhyItMatters(recommendation);

  return (
    <div 
      onClick={(e) => {
        if (recommendation.category && onSelectCategory) {
          e.stopPropagation();
          onSelectCategory(recommendation.category);
        }
      }}
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        "p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/20 hover:border-border/80 hover:shadow-sm",
        "transition-all duration-200 cursor-pointer"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-3">
          <Badge 
            variant={priorityVariant(recommendation.priority)} 
            className="text-[10px] sm:text-xs font-bold px-2 py-0.5 uppercase tracking-wide shrink-0 rounded-md"
          >
            {priorityLabel(recommendation.priority)}
          </Badge>
          <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {verbTitle}
          </span>
        </div>
        <p className="text-sm text-muted-foreground pl-0 sm:pl-[calc(theme(spacing.2)+6ch)] line-clamp-2 sm:line-clamp-1">
          {whyItMatters}
        </p>
      </div>
      
      {recommendation.category && onSelectCategory && (
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-none border-border/30">
          <span className="text-xs font-medium text-primary sm:hidden">Tap to view</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors ml-auto sm:ml-0">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
}
