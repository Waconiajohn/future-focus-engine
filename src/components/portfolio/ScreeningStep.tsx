import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Filter, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScreeningFlags } from "@/types/persona";

interface ScreeningStepProps {
  onComplete: (flags: ScreeningFlags) => void;
  onBack: () => void;
}

const SCREENING_QUESTIONS = [
  {
    id: 'hasHighDeductibleHealthPlan',
    label: 'High-deductible health plan (HSA eligible)',
    description: 'Unlocks HSA triple-tax-advantage strategies',
    icon: '🏥',
  },
  {
    id: 'hasCharitableIntent',
    label: 'Donate $5,000+ to charity annually',
    description: 'Unlocks QCDs, DAFs, and charitable trust strategies',
    icon: '❤️',
  },
  {
    id: 'hasEmployerStockIn401k',
    label: 'Company stock in 401(k)',
    description: 'Unlocks Net Unrealized Appreciation (NUA) strategy',
    icon: '📈',
  },
  {
    id: 'hasBusinessOwnership',
    label: 'Business owner or 1099 income',
    description: 'Unlocks QSBS, solo 401(k), and business planning strategies',
    icon: '🏢',
  },
  {
    id: 'hasEducationGoals',
    label: 'Funding education for kids/grandkids',
    description: 'Unlocks 529 and education planning strategies',
    icon: '🎓',
  },
  {
    id: 'hasUnrealizedGains',
    label: 'Significant unrealized gains in taxable accounts',
    description: 'Unlocks tax-loss harvesting and cost basis strategies',
    icon: '💰',
  },
  {
    id: 'hasEstateAboveExemption',
    label: 'Estate may exceed $13M (single) / $26M (married)',
    description: 'Unlocks dynasty trust and advanced estate planning',
    icon: '🏦',
  },
] as const;

export function ScreeningStep({ onComplete, onBack }: ScreeningStepProps) {
  const [flags, setFlags] = useState<ScreeningFlags>({});

  const handleToggle = (id: keyof ScreeningFlags) => {
    setFlags(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(flags).filter(Boolean).length;

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="border-none shadow-card bg-surface">
        <CardContent className="pt-8 px-6 pb-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-primarySoft rounded-full text-primary mb-2">
                <Filter className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-textPrimary">
                Help Us Find YOUR Opportunities
              </h2>
              <p className="text-textSecondary text-sm">
                Check all that apply to you. Unchecked items will filter out specific strategies, 
                giving you a more focused list.
              </p>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg border border-border">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                Don't worry if you're unsure – you can skip this step and see all potentially relevant strategies.
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              {SCREENING_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    flags[q.id as keyof ScreeningFlags]
                      ? "border-primary bg-primarySoft/30"
                      : "border-transparent bg-surfaceMuted/50 hover:bg-surfaceMuted/80"
                  )}
                  onClick={() => handleToggle(q.id as keyof ScreeningFlags)}
                >
                  <Checkbox
                    id={q.id}
                    checked={!!flags[q.id as keyof ScreeningFlags]}
                    onCheckedChange={() => handleToggle(q.id as keyof ScreeningFlags)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={q.id} className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-textPrimary">
                      <span>{q.icon}</span>
                      <span>{q.label}</span>
                    </Label>
                    <p className="text-xs text-textMuted mt-0.5">{q.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Count */}
            {selectedCount > 0 && (
              <p className="text-center text-sm text-textSecondary">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-textMuted hover:text-textPrimary"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onComplete({})}
                className="text-textMuted"
              >
                Skip & See All
              </Button>
              <Button
                onClick={() => onComplete(flags)}
                className="px-6 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 shadow-lg"
              >
                Find Strategies
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
