
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, TrendingUp, DollarSign } from "lucide-react";

interface StoryCardProps {
  title: string;
  insight: string;
  type: "income" | "tax" | "growth";
  className?: string;
}

export function StoryCard({ title, insight, type, className }: StoryCardProps) {
  const icons = {
    income: DollarSign,
    tax: CheckCircle2,
    growth: TrendingUp,
  };

  const Icon = icons[type];

  const variants = {
    income: "bg-emerald-50 border-emerald-100 text-emerald-900",
    tax: "bg-blue-50 border-blue-100 text-blue-900",
    growth: "bg-amber-50 border-amber-100 text-amber-900",
  };

  const iconVariants = {
    income: "text-emerald-600 bg-emerald-100",
    tax: "text-blue-600 bg-blue-100",
    growth: "text-amber-600 bg-amber-100",
  };

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
        <div className={cn("p-2 rounded-full", iconVariants[type])}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="outline" className="font-normal text-textMuted uppercase tracking-wide text-[10px]">
          Insight
        </Badge>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
        <p className="text-textSecondary text-sm leading-relaxed">{insight}</p>
      </CardContent>
    </Card>
  );
}
