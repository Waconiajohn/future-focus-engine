import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Clock, 
  CalendarClock, 
  Building2, 
  Home,
  ChevronRight,
  UserX
} from "lucide-react";

export type PersonaType = 
  | "pre-retiree-transition" 
  | "pre-retiree-employed" 
  | "early-retiree" 
  | "rmd-age" 
  | "business-owner" 
  | "real-estate";

interface PersonaOption {
  id: PersonaType;
  title: string;
  description: string;
  ageHint: string;
  icon: React.ReactNode;
  color: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: "pre-retiree-transition",
    title: "Pre-Retiree (In Transition)",
    description: "Unemployed, job searching, or recently separated from employer",
    ageHint: "Typically 45-62",
    icon: <UserX className="h-6 w-6" />,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    id: "pre-retiree-employed",
    title: "Pre-Retiree (Employed)",
    description: "Still working, planning ahead for retirement",
    ageHint: "Typically 45-62",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    id: "early-retiree",
    title: "Early Retiree",
    description: "Recently retired or retiring soon, before RMDs begin",
    ageHint: "Typically 60-72",
    icon: <Clock className="h-6 w-6" />,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    id: "rmd-age",
    title: "RMD-Age Retiree",
    description: "Managing required distributions and retirement income",
    ageHint: "73 and older",
    icon: <CalendarClock className="h-6 w-6" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    id: "business-owner",
    title: "Business Owner",
    description: "Active business interests, self-employed, or 1099 income",
    ageHint: "Any age",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    id: "real-estate",
    title: "Real Estate Investor",
    description: "Investment properties, rental income, or planning to sell",
    ageHint: "Any age",
    icon: <Home className="h-6 w-6" />,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
];

interface PersonaPreSelectorProps {
  onSelect: (persona: PersonaType) => void;
}

export function PersonaPreSelector({ onSelect }: PersonaPreSelectorProps) {
  const [selected, setSelected] = useState<PersonaType | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-card bg-surface">
        <CardContent className="pt-8 px-6 pb-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-textPrimary">
                Which best describes you?
              </h2>
              <p className="text-textSecondary">
                This helps us prioritize the most relevant strategies for your situation.
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid gap-3">
              {PERSONA_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    selected === option.id
                      ? "border-primary bg-primarySoft/30"
                      : "border-transparent bg-surfaceMuted/50 hover:bg-surfaceMuted/80"
                  )}
                  onClick={() => setSelected(option.id)}
                >
                  <div className={cn("p-3 rounded-xl shrink-0", option.color)}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-textPrimary">
                        {option.title}
                      </h3>
                      <span className="text-xs text-textMuted bg-surfaceMuted px-2 py-0.5 rounded-full">
                        {option.ageHint}
                      </span>
                    </div>
                    <p className="text-sm text-textSecondary mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  {selected === option.id && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <ChevronRight className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-border/50">
            <Button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              className="px-8 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
