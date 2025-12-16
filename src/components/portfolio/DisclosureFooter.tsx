
import { cn } from "@/lib/utils";

interface DisclosureFooterProps {
  className?: string;
}

export function DisclosureFooter({ className }: DisclosureFooterProps) {
  return (
    <footer
      className={cn(
        "py-6 text-xs text-textMuted border-t border-border mt-12",
        className
      )}
    >
      <div className="max-w-4xl mx-auto px-4 space-y-2 text-center">
        <p>
          <strong>Disclaimer:</strong> This application is for informational purposes only and does
          not constitute financial, tax, or legal advice. Strategies presented are based on
          general rules and may not apply to your specific situation.
        </p>
        <p>
          Always consult with a qualified professional (CPA, CFP, Estate Attorney) before making
          any financial decisions.
        </p>
      </div>
    </footer>
  );
}
