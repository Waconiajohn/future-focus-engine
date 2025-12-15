
import { cn } from "@/lib/utils";
import type { ImpactLabel } from "@/types/persona";

interface ImpactBadgeProps {
  impact: ImpactLabel;
}

export function ImpactBadge({ impact }: ImpactBadgeProps) {
  // Normalize impact to display format
  const normalizedImpact = impact.toLowerCase();
  
  const styles: Record<string, string> = {
    potential: "bg-blue-100 text-blue-700 border-blue-200",
    material: "bg-emerald-100 text-emerald-700 border-emerald-200",
    advanced: "bg-purple-100 text-purple-700 border-purple-200",
    high: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const labels: Record<string, string> = {
    potential: "Potential",
    material: "Material",
    advanced: "Advanced",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[normalizedImpact] || styles.medium
      )}
    >
      {labels[normalizedImpact] || impact} Impact
    </span>
  );
}
