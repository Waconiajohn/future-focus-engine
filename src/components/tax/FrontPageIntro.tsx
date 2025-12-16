
export function FrontPageIntro() {
  return (
    <div className="rounded-lg bg-surface border border-border p-8 shadow-subtle">
      <div className="flex flex-col gap-6">
        {/* Hero */}
        <div>
          <div className="text-xs font-semibold tracking-wide text-textMuted">
            TAX OPPORTUNITY FINDER
          </div>

          <h1 className="mt-2 text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-textPrimary">
            Most people miss tax opportunities because nobody owns the conversation.
          </h1>

          <p className="mt-3 text-lg lg:text-xl leading-normal text-textSecondary">
            Long-term outcomes are often improved less by “beating the market” and more by
            reducing avoidable lifetime taxes — especially across income changes, account growth,
            and retirement distributions.
          </p>
        </div>

        {/* Why overlooked */}
        <div className="rounded-lg bg-surfaceMuted border border-border p-6">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-textPrimary">
            Why this is often overlooked
          </h2>

          <ul className="mt-3 space-y-2 text-base lg:text-lg leading-normal text-textSecondary">
            <li>
              <span className="font-semibold text-textPrimary">Most advisor relationships</span>{" "}
              are built around investments, not coordinated multi-year tax planning.
            </li>
            <li>
              <span className="font-semibold text-textPrimary">Tax planning requires coordination</span>{" "}
              (often CPA + advisor + attorney), and many professionals avoid stepping outside
              their lane to reduce liability.
            </li>
            <li>
              <span className="font-semibold text-textPrimary">Timing windows</span>{" "}
              (unemployment, early retirement, business events, property decisions) can create
              opportunities that are easy to miss without a deliberate process.
            </li>
          </ul>
        </div>

        {/* What it does / doesn’t */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-surface border border-border p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-textPrimary">What this tool does</h3>
            <ul className="mt-3 space-y-2 text-base lg:text-lg leading-normal text-textSecondary">
              <li>Identifies tax strategies that may be relevant based on your situation</li>
              <li>Uses short stories to show how similar households approach timing decisions</li>
              <li>Helps you prepare better questions for professional conversations</li>
            </ul>
          </div>

          <div className="rounded-lg bg-surface border border-border p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-textPrimary">What this tool does not do</h3>
            <ul className="mt-3 space-y-2 text-base lg:text-lg leading-normal text-textSecondary">
              <li>Provide tax, legal, or investment advice</li>
              <li>Calculate exact savings or produce “do this now” recommendations</li>
              <li>Replace your CPA, attorney, or financial professional</li>
            </ul>
          </div>
        </div>

        {/* CTA strip */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-textPrimary">
                Start with a few simple selections
              </div>
              <div className="mt-1 text-base text-textSecondary">
                Takes about 2 minutes. No uploads. No report download.
              </div>
            </div>

            <div className="text-sm text-textMuted">
              Educational only. Validate with a qualified professional.
            </div>
          </div>
        </div>

        {/* Micro-disclosure */}
        <div className="text-sm leading-relaxed text-textMuted">
          This tool provides educational information only and does not constitute tax, legal, or
          investment advice. Consult a qualified professional before making financial decisions.
        </div>
      </div>
    </div>
  );
}
