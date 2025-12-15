import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            index < currentStep
              ? "w-8 bg-sage"
              : index === currentStep
              ? "w-8 bg-sage/50"
              : "w-4 bg-border"
          )}
        />
      ))}
    </div>
  );
}
