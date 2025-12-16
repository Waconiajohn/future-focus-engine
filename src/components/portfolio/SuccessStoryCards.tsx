import { Card, CardContent } from "@/components/ui/card";
import { Quote, TrendingUp, DollarSign, Heart, Building2 } from "lucide-react";

interface SuccessStory {
  id: string;
  names: string;
  situation: string;
  strategy: string;
  savings: string;
  quote: string;
  icon: React.ReactNode;
  color: string;
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "roth-conversion",
    names: "Michael & Karen",
    situation: "Retired couple, ages 62 & 60, with $1.1M in traditional IRAs",
    strategy: "Strategic Roth Conversions",
    savings: "$790,000",
    quote: "We had no idea our lifetime tax bill would be over $1.1 million without a plan. Converting portions of our IRAs over 10 years at lower rates changed everything.",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "qcd-qlac",
    names: "David & Patricia",
    situation: "Retired couple, ages 74 & 72, facing large RMDs on $800k IRA",
    strategy: "QCDs + Partial QLAC",
    savings: "$490,000",
    quote: "We were terrified of the RMD tax bomb in our 70s. Using QCDs for our charitable giving and a QLAC to defer some distributions kept us in a lower bracket.",
    icon: <Heart className="h-5 w-5" />,
    color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800",
  },
  {
    id: "early-conversion",
    names: "James & Linda",
    situation: "Pre-retirees, ages 58 & 56, worried about future tax rates",
    strategy: "Early Roth Conversions + Tax-Loss Harvesting",
    savings: "$225,000",
    quote: "We started converting to Roth in our late 50s while still in a moderate bracket. Even if tax rates rise, we are protected now.",
    icon: <DollarSign className="h-5 w-5" />,
    color: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800",
  },
  {
    id: "real-estate",
    names: "Robert & Susan",
    situation: "Real estate investors, ages 65 & 63, selling rental portfolio",
    strategy: "1031 Exchange + Installment Sale",
    savings: "$340,000",
    quote: "We thought selling our rentals would trigger a massive tax bill. By combining a 1031 exchange with an installment sale on one property, we kept our capital working.",
    icon: <Building2 className="h-5 w-5" />,
    color: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800",
  },
];

export function SuccessStoryCards() {
  return (
    <section className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Real Results from Strategic Tax Planning
        </h2>
        <p className="text-sm text-muted-foreground">
          See how others in similar situations reduced their lifetime tax burden
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SUCCESS_STORIES.map((story) => (
          <Card 
            key={story.id} 
            className={`bg-gradient-to-br ${story.color} border overflow-hidden`}
          >
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-white/60 dark:bg-background/40">
                  {story.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{story.names}</h3>
                  <p className="text-xs text-muted-foreground">{story.situation}</p>
                </div>
              </div>

              {/* Strategy & Savings */}
              <div className="flex items-center justify-between mb-3 py-2 px-3 bg-white/50 dark:bg-background/30 rounded-lg">
                <span className="text-sm font-medium text-foreground">{story.strategy}</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {story.savings}
                </span>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 h-4 w-4 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground italic pl-4 leading-relaxed">
                  {story.quote}
                </p>
              </div>

              {/* Label */}
              <p className="text-[10px] text-muted-foreground/60 mt-3 text-right">
                *Estimated lifetime tax savings
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground mt-4 max-w-lg mx-auto">
        These examples are illustrative scenarios based on common situations. Individual results vary based on 
        specific circumstances. Consult a qualified professional for personalized advice.
      </p>
    </section>
  );
}
