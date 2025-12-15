
import { cn } from "@/lib/utils";

interface ImpactBadgeProps {
  impact: "Potential" | "Material" | "Advanced";
}

export function ImpactBadge({ impact }: ImpactBadgeProps) {
  const styles = {
    Potential: "bg-blue-100 text-blue-700 border-blue-200",
    Material: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Advanced: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[impact]
      )}
    >
      {impact} Impact
    </span>
  );
}
