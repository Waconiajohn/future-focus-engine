import { Button } from "@/components/ui/button";

interface FrontPageIntroProps {
  onStart?: () => void;
}

export function FrontPageIntro({ onStart }: FrontPageIntroProps) {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg bg-surface border border-border p-8 shadow-subtle">
          <div className="flex flex-col gap-8">
            {/* Hero */}
            <div>
              <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                TAX OPPORTUNITY FINDER
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground">
                Most people miss tax opportunities because nobody owns the conversation.
              </h1>

              <p className="mt-4 text-xl md:text-2xl leading-relaxed text-muted-foreground">
                Long-term outcomes are often improved less by "beating the market" and more by
                reducing avoidable lifetime taxes — especially across income changes, account growth,
                and retirement distributions.
              </p>
            </div>

            {/* Why overlooked */}
            <div className="rounded-lg bg-muted/50 border border-border p-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Why this is often overlooked
              </h2>

              <ul className="mt-4 space-y-3 text-lg md:text-xl leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Most advisor relationships</span>{" "}
                  are built around investments, not coordinated multi-year tax planning.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Tax planning requires coordination</span>{" "}
                  (often CPA, CFP, or attorney), and many professionals avoid stepping outside
                  their lane to reduce liability.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Timing windows</span>{" "}
                  (unemployment, early retirement, business events, property decisions) can create
                  opportunities that are easy to miss without a deliberate process.
                </li>
              </ul>
            </div>

            {/* What it does / doesn't */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg bg-surface border border-border p-6">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">What this tool does</h3>
                <ul className="mt-4 space-y-2 text-lg md:text-xl leading-relaxed text-muted-foreground">
                  <li>Identifies tax strategies that may be relevant based on your situation</li>
                  <li>Uses short stories to show how similar households approach timing decisions</li>
                  <li>Helps you prepare better questions for professional conversations</li>
                </ul>
              </div>

              <div className="rounded-lg bg-surface border border-border p-6">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">What this tool does not do</h3>
                <ul className="mt-4 space-y-2 text-lg md:text-xl leading-relaxed text-muted-foreground">
                  <li>Provide tax, legal, or investment advice</li>
                  <li>Calculate exact savings or produce "do this now" recommendations</li>
                  <li>Replace your CPA, attorney, or financial professional</li>
                </ul>
              </div>
            </div>

            {/* CTA strip */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    Start with a few simple selections
                  </div>
                  <div className="mt-1 text-base text-muted-foreground">
                    Takes about 2 minutes. No uploads. No report download.
                  </div>
                </div>

                {onStart && (
                  <Button onClick={onStart} size="lg" className="w-full lg:w-auto">
                    Continue
                  </Button>
                )}
              </div>
            </div>

            {/* Micro-disclosure */}
            <div className="text-sm leading-relaxed text-muted-foreground">
              Educational only. Validate with a qualified professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
