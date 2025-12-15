import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { 
  EmploymentStatus, 
  MaritalStatus, 
  UnemploymentDetails, 
  UnemploymentDuration, 
  CharitableRange,
  SeveranceRange,
  SeveranceType,
  UIRange,
  CurrentYearIncomeComparison,
  SelfEmployedDetails
} from "@/types/persona";
import { cn } from "@/lib/utils";

interface HouseholdStepProps {
  maritalStatus: MaritalStatus;
  onComplete: (data: {
    employmentStatus: EmploymentStatus;
    unemploymentDetails?: UnemploymentDetails;
    selfEmployedDetails?: SelfEmployedDetails;
    spouseEmploymentStatus?: EmploymentStatus;
    spouseUnemploymentDetails?: UnemploymentDetails;
    spouseSelfEmployedDetails?: SelfEmployedDetails;
    charitableGiving?: CharitableRange;
    hasBusinessOwnership?: boolean;
    hasEmployerStock?: boolean;
    hasRentalRealEstate?: boolean;
  }) => void;
  onBack: () => void;
}

const employmentOptions: { value: EmploymentStatus; label: string; description: string }[] = [
  { value: 'employed', label: 'Employed', description: 'Currently working as W-2 employee' },
  { value: 'unemployed', label: 'In Transition', description: 'Between jobs, on sabbatical, or career change' },
  { value: 'self-employed', label: 'Self-Employed', description: 'Own business or independent contractor' },
  { value: 'consulting', label: 'Consulting', description: 'Independent consulting or contract work' },
  { value: 'retired', label: 'Retired', description: 'No longer working for income' },
];

const durationOptions: { value: UnemploymentDuration; label: string }[] = [
  { value: '<3months', label: 'Less than 3 months' },
  { value: '3-6months', label: '3–6 months' },
  { value: '6-12months', label: '6–12 months' },
  { value: '>12months', label: 'More than 12 months' },
];

const returnOptions: { value: 'yes' | 'no' | 'not-sure'; label: string; description: string }[] = [
  { value: 'yes', label: 'Yes, likely within 12 months', description: 'Expecting to return to similar income' },
  { value: 'no', label: 'No, unlikely', description: 'This may be a longer-term change' },
  { value: 'not-sure', label: 'Not sure yet', description: 'Still evaluating options' },
];

const severanceRangeOptions: { value: SeveranceRange; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '<50k', label: 'Less than $50,000' },
  { value: '50k-150k', label: '$50,000 – $150,000' },
  { value: '150k-300k', label: '$150,000 – $300,000' },
  { value: '>300k', label: 'More than $300,000' },
];

const severanceTypeOptions: { value: SeveranceType; label: string; description: string }[] = [
  { value: 'lump-sum', label: 'Lump sum', description: 'Paid all at once' },
  { value: 'over-time', label: 'Over time', description: 'Spread across multiple payments' },
];

const uiRangeOptions: { value: UIRange; label: string }[] = [
  { value: 'none', label: 'Not receiving UI' },
  { value: '<2k', label: 'Less than $2,000/month' },
  { value: '2k-4k', label: '$2,000 – $4,000/month' },
  { value: '>4k', label: 'More than $4,000/month' },
];

const incomeComparisonOptions: { value: CurrentYearIncomeComparison; label: string; description: string }[] = [
  { value: 'higher', label: 'Higher than typical', description: 'Due to severance, bonuses, or other factors' },
  { value: 'similar', label: 'About the same', description: 'Similar to a typical working year' },
  { value: 'lower', label: 'Lower than typical', description: 'Noticeably reduced income' },
  { value: 'unsure', label: 'Not sure', description: 'Haven\'t fully assessed yet' },
];

const charitableOptions: { value: CharitableRange; label: string }[] = [
  { value: 'none', label: 'None or minimal' },
  { value: '<5k', label: 'Less than $5,000/year' },
  { value: '5k-25k', label: '$5,000 – $25,000/year' },
  { value: '25k-100k', label: '$25,000 – $100,000/year' },
  { value: '>100k', label: 'More than $100,000/year' },
];

type Step = 
  | 'primary-employment'
  | 'primary-duration'
  | 'primary-severance'
  | 'primary-severance-amount'
  | 'primary-severance-type'
  | 'primary-ui'
  | 'primary-income-comparison'
  | 'primary-return'
  | 'primary-self-employed-fluctuates'
  | 'primary-self-employed-cashflow'
  | 'spouse-employment'
  | 'spouse-duration'
  | 'spouse-severance'
  | 'spouse-severance-amount'
  | 'spouse-severance-type'
  | 'spouse-ui'
  | 'spouse-income-comparison'
  | 'spouse-return'
  | 'spouse-self-employed-fluctuates'
  | 'spouse-self-employed-cashflow'
  | 'charitable-giving'
  | 'business-ownership'
  | 'employer-stock'
  | 'rental-real-estate';

export function HouseholdStep({ maritalStatus, onComplete, onBack }: HouseholdStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('primary-employment');
  
  // Primary person state
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [primaryDuration, setPrimaryDuration] = useState<UnemploymentDuration | "">("");
  const [primaryIncomeLower, setPrimaryIncomeLower] = useState<boolean | null>(null);
  const [primaryExpectReturn, setPrimaryExpectReturn] = useState<'yes' | 'no' | 'not-sure' | "">("");
  
  // Primary unemployment details
  const [primaryReceivedSeverance, setPrimaryReceivedSeverance] = useState<boolean | null>(null);
  const [primarySeveranceRange, setPrimarySeveranceRange] = useState<SeveranceRange | "">("");
  const [primarySeveranceType, setPrimarySeveranceType] = useState<SeveranceType | "">("");
  const [primaryReceivingUI, setPrimaryReceivingUI] = useState<boolean | null>(null);
  const [primaryUIRange, setPrimaryUIRange] = useState<UIRange | "">("");
  const [primaryIncomeComparison, setPrimaryIncomeComparison] = useState<CurrentYearIncomeComparison | "">("");

  // Primary self-employed details
  const [primaryIncomeFluctuates, setPrimaryIncomeFluctuates] = useState<boolean | null>(null);
  const [primaryPositiveCashFlow, setPrimaryPositiveCashFlow] = useState<boolean | null>(null);
  
  // Spouse state
  const [spouseEmploymentStatus, setSpouseEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [spouseDuration, setSpouseDuration] = useState<UnemploymentDuration | "">("");
  const [spouseIncomeLower, setSpouseIncomeLower] = useState<boolean | null>(null);
  const [spouseExpectReturn, setSpouseExpectReturn] = useState<'yes' | 'no' | 'not-sure' | "">("");

  // Spouse unemployment details
  const [spouseReceivedSeverance, setSpouseReceivedSeverance] = useState<boolean | null>(null);
  const [spouseSeveranceRange, setSpouseSeveranceRange] = useState<SeveranceRange | "">("");
  const [spouseSeveranceType, setSpouseSeveranceType] = useState<SeveranceType | "">("");
  const [spouseReceivingUI, setSpouseReceivingUI] = useState<boolean | null>(null);
  const [spouseUIRange, setSpouseUIRange] = useState<UIRange | "">("");
  const [spouseIncomeComparison, setSpouseIncomeComparison] = useState<CurrentYearIncomeComparison | "">("");

  // Spouse self-employed details
  const [spouseIncomeFluctuates, setSpouseIncomeFluctuates] = useState<boolean | null>(null);
  const [spousePositiveCashFlow, setSpousePositiveCashFlow] = useState<boolean | null>(null);

  // Life context state
  const [charitableGiving, setCharitableGiving] = useState<CharitableRange | "">("");
  const [hasBusinessOwnership, setHasBusinessOwnership] = useState<boolean | null>(null);
  const [hasEmployerStock, setHasEmployerStock] = useState<boolean | null>(null);
  const [hasRentalRealEstate, setHasRentalRealEstate] = useState<boolean | null>(null);

  const getStepFlow = (): Step[] => {
    const flow: Step[] = ['primary-employment'];
    
    if (employmentStatus === 'unemployed') {
      flow.push('primary-duration', 'primary-severance');
      if (primaryReceivedSeverance === true) {
        flow.push('primary-severance-amount', 'primary-severance-type');
      }
      flow.push('primary-ui');
      flow.push('primary-income-comparison');
      flow.push('primary-return');
    }

    if (employmentStatus === 'self-employed' || employmentStatus === 'consulting') {
      flow.push('primary-self-employed-fluctuates', 'primary-self-employed-cashflow');
    }
    
    if (maritalStatus === 'married') {
      flow.push('spouse-employment');
      if (spouseEmploymentStatus === 'unemployed') {
        flow.push('spouse-duration', 'spouse-severance');
        if (spouseReceivedSeverance === true) {
          flow.push('spouse-severance-amount', 'spouse-severance-type');
        }
        flow.push('spouse-ui');
        flow.push('spouse-income-comparison');
        flow.push('spouse-return');
      }
      if (spouseEmploymentStatus === 'self-employed' || spouseEmploymentStatus === 'consulting') {
        flow.push('spouse-self-employed-fluctuates', 'spouse-self-employed-cashflow');
      }
    }

    // Add life context questions
    flow.push('charitable-giving', 'business-ownership', 'employer-stock', 'rental-real-estate');
    
    return flow;
  };

  const stepFlow = getStepFlow();
  const currentStepIndex = stepFlow.indexOf(currentStep);
  const totalSteps = stepFlow.length;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex < stepFlow.length) {
      setCurrentStep(stepFlow[nextIndex]);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Compute incomeLowerThanTypical from incomeComparison
    const primaryLowerIncome = primaryIncomeComparison === 'lower';
    const spouseLowerIncome = spouseIncomeComparison === 'lower';

    const primaryDetails: UnemploymentDetails | undefined = 
      employmentStatus === 'unemployed' && primaryDuration && primaryIncomeComparison
        ? {
            duration: primaryDuration as UnemploymentDuration,
            incomeLowerThanTypical: primaryLowerIncome,
            expectReturnWithin12Months: primaryExpectReturn as 'yes' | 'no' | 'not-sure',
            receivedSeverance: primaryReceivedSeverance ?? undefined,
            severanceRange: primarySeveranceRange as SeveranceRange || undefined,
            severanceType: primarySeveranceType as SeveranceType || undefined,
            receivingUI: primaryReceivingUI ?? undefined,
            uiRange: primaryUIRange as UIRange || undefined,
            currentYearIncomeComparison: primaryIncomeComparison as CurrentYearIncomeComparison,
          }
        : undefined;

    const spouseDetails: UnemploymentDetails | undefined = 
      spouseEmploymentStatus === 'unemployed' && spouseDuration && spouseIncomeComparison
        ? {
            duration: spouseDuration as UnemploymentDuration,
            incomeLowerThanTypical: spouseLowerIncome,
            expectReturnWithin12Months: spouseExpectReturn as 'yes' | 'no' | 'not-sure',
            receivedSeverance: spouseReceivedSeverance ?? undefined,
            severanceRange: spouseSeveranceRange as SeveranceRange || undefined,
            severanceType: spouseSeveranceType as SeveranceType || undefined,
            receivingUI: spouseReceivingUI ?? undefined,
            uiRange: spouseUIRange as UIRange || undefined,
            currentYearIncomeComparison: spouseIncomeComparison as CurrentYearIncomeComparison,
          }
        : undefined;

    const primarySelfEmployedDetails: SelfEmployedDetails | undefined =
      (employmentStatus === 'self-employed' || employmentStatus === 'consulting')
        ? {
            incomeFluctuatesQuarterly: primaryIncomeFluctuates ?? undefined,
            hasPositiveCashFlow: primaryPositiveCashFlow ?? undefined,
          }
        : undefined;

    const spouseSelfEmployedDetails: SelfEmployedDetails | undefined =
      (spouseEmploymentStatus === 'self-employed' || spouseEmploymentStatus === 'consulting')
        ? {
            incomeFluctuatesQuarterly: spouseIncomeFluctuates ?? undefined,
            hasPositiveCashFlow: spousePositiveCashFlow ?? undefined,
          }
        : undefined;

    onComplete({
      employmentStatus: employmentStatus as EmploymentStatus,
      unemploymentDetails: primaryDetails,
      selfEmployedDetails: primarySelfEmployedDetails,
      spouseEmploymentStatus: maritalStatus === 'married' ? spouseEmploymentStatus as EmploymentStatus : undefined,
      spouseUnemploymentDetails: spouseDetails,
      spouseSelfEmployedDetails: spouseSelfEmployedDetails,
      charitableGiving: charitableGiving as CharitableRange || undefined,
      hasBusinessOwnership: hasBusinessOwnership ?? undefined,
      hasEmployerStock: hasEmployerStock ?? undefined,
      hasRentalRealEstate: hasRentalRealEstate ?? undefined,
    });
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      // Need to recalculate flow based on current state to go back properly
      const flow = getStepFlow();
      const prevIndex = flow.indexOf(currentStep) - 1;
      if (prevIndex >= 0) {
        setCurrentStep(flow[prevIndex]);
      } else {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 'primary-employment': return employmentStatus !== "";
      case 'primary-duration': return primaryDuration !== "";
      case 'primary-severance': return primaryReceivedSeverance !== null;
      case 'primary-severance-amount': return primarySeveranceRange !== "";
      case 'primary-severance-type': return primarySeveranceType !== "";
      case 'primary-ui': return primaryReceivingUI !== null;
      case 'primary-income-comparison': return primaryIncomeComparison !== "";
      case 'primary-return': return primaryExpectReturn !== "";
      case 'primary-self-employed-fluctuates': return primaryIncomeFluctuates !== null;
      case 'primary-self-employed-cashflow': return primaryPositiveCashFlow !== null;
      case 'spouse-employment': return spouseEmploymentStatus !== "";
      case 'spouse-duration': return spouseDuration !== "";
      case 'spouse-severance': return spouseReceivedSeverance !== null;
      case 'spouse-severance-amount': return spouseSeveranceRange !== "";
      case 'spouse-severance-type': return spouseSeveranceType !== "";
      case 'spouse-ui': return spouseReceivingUI !== null;
      case 'spouse-income-comparison': return spouseIncomeComparison !== "";
      case 'spouse-return': return spouseExpectReturn !== "";
      case 'spouse-self-employed-fluctuates': return spouseIncomeFluctuates !== null;
      case 'spouse-self-employed-cashflow': return spousePositiveCashFlow !== null;
      case 'charitable-giving': return charitableGiving !== "";
      case 'business-ownership': return hasBusinessOwnership !== null;
      case 'employer-stock': return hasEmployerStock !== null;
      case 'rental-real-estate': return hasRentalRealEstate !== null;
      default: return false;
    }
  };

  // Helper to determine if we should show caution microcopy
  const showHighIncomeWarning = (incomeComparison: CurrentYearIncomeComparison | "", severance: boolean | null) => {
    return (incomeComparison === 'higher' || incomeComparison === 'similar') && severance === true;
  };

  const showUIWarning = (receivingUI: boolean | null) => receivingUI === true;

  const renderStep = () => {
    switch (currentStep) {
      case 'primary-employment':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              What's your current employment status?
            </h2>
            <p className="text-muted-foreground mb-8">
              This helps identify time-sensitive opportunities
            </p>
            <RadioGroup
              value={employmentStatus}
              onValueChange={(value) => setEmploymentStatus(value as EmploymentStatus)}
              className="space-y-3"
            >
              {employmentOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    employmentStatus === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'primary-duration':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How long have you been in transition?
            </h2>
            <p className="text-muted-foreground mb-8">
              Duration can affect which planning windows are available
            </p>
            <RadioGroup
              value={primaryDuration}
              onValueChange={(value) => setPrimaryDuration(value as UnemploymentDuration)}
              className="space-y-3"
            >
              {durationOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    primaryDuration === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`duration-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'primary-severance':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Have you received severance in the last 12 months?
            </h2>
            <p className="text-muted-foreground mb-8">
              Severance payments can significantly affect your tax situation
            </p>
            <RadioGroup
              value={primaryReceivedSeverance === null ? "" : primaryReceivedSeverance ? "yes" : "no"}
              onValueChange={(value) => setPrimaryReceivedSeverance(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryReceivedSeverance === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="severance-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryReceivedSeverance === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="severance-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'primary-severance-amount':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Approximately how much severance did you receive?
            </h2>
            <p className="text-muted-foreground mb-8">
              This helps assess your total income for the year
            </p>
            <RadioGroup
              value={primarySeveranceRange}
              onValueChange={(value) => setPrimarySeveranceRange(value as SeveranceRange)}
              className="space-y-3"
            >
              {severanceRangeOptions.filter(o => o.value !== 'none').map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    primarySeveranceRange === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`sev-amt-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'primary-severance-type':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How is your severance being paid?
            </h2>
            <p className="text-muted-foreground mb-8">
              Timing of payments affects tax planning options
            </p>
            <RadioGroup
              value={primarySeveranceType}
              onValueChange={(value) => setPrimarySeveranceType(value as SeveranceType)}
              className="space-y-3"
            >
              {severanceTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    primarySeveranceType === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`sev-type-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'primary-ui':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Are you receiving unemployment insurance (UI)?
            </h2>
            <p className="text-muted-foreground mb-8">
              UI benefits are taxable income
            </p>
            <RadioGroup
              value={primaryReceivingUI === null ? "" : primaryReceivingUI ? "yes" : "no"}
              onValueChange={(value) => {
                setPrimaryReceivingUI(value === "yes");
                if (value === "no") setPrimaryUIRange('none');
              }}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryReceivingUI === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="ui-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryReceivingUI === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="ui-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
            {primaryReceivingUI === true && (
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  Benefits and credits can be sensitive to income changes; confirm with a CPA.
                </p>
              </div>
            )}
          </div>
        );

      case 'primary-income-comparison':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How does your current year income compare to a typical working year?
            </h2>
            <p className="text-muted-foreground mb-8">
              Consider all sources: severance, savings withdrawals, spouse income, etc.
            </p>
            <RadioGroup
              value={primaryIncomeComparison}
              onValueChange={(value) => {
                setPrimaryIncomeComparison(value as CurrentYearIncomeComparison);
                setPrimaryIncomeLower(value === 'lower');
              }}
              className="space-y-3"
            >
              {incomeComparisonOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    primaryIncomeComparison === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`income-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
            {showHighIncomeWarning(primaryIncomeComparison, primaryReceivedSeverance) && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  Unemployment can still be a high-income year if severance or other income is present. Some "low-income" strategies may not apply.
                </p>
              </div>
            )}
            {primaryIncomeComparison === 'lower' && (
              <div className="mt-6 p-4 bg-sage-light/30 border border-sage/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  Lower-income years may create timing-based planning windows. Be mindful of credit and subsidy thresholds—review with a professional.
                </p>
              </div>
            )}
          </div>
        );

      case 'primary-return':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you expect to return to W-2 employment within 12 months?
            </h2>
            <p className="text-muted-foreground mb-8">
              This shapes which strategies may be most relevant
            </p>
            <RadioGroup
              value={primaryExpectReturn}
              onValueChange={(value) => setPrimaryExpectReturn(value as 'yes' | 'no' | 'not-sure')}
              className="space-y-3"
            >
              {returnOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    primaryExpectReturn === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`return-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'primary-self-employed-fluctuates':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Does your income fluctuate quarter-to-quarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Variable income affects tax planning strategies
            </p>
            <RadioGroup
              value={primaryIncomeFluctuates === null ? "" : primaryIncomeFluctuates ? "yes" : "no"}
              onValueChange={(value) => setPrimaryIncomeFluctuates(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryIncomeFluctuates === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="yes" id="fluctuates-yes" />
                  <span className="font-medium">Yes, income varies significantly</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Revenue depends on projects, clients, or seasons
                </span>
              </label>
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryIncomeFluctuates === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="no" id="fluctuates-no" />
                  <span className="font-medium">No, fairly stable</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Consistent income throughout the year
                </span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'primary-self-employed-cashflow':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you currently have positive cash flow?
            </h2>
            <p className="text-muted-foreground mb-8">
              This affects contribution strategies and timing
            </p>
            <RadioGroup
              value={primaryPositiveCashFlow === null ? "" : primaryPositiveCashFlow ? "yes" : "no"}
              onValueChange={(value) => setPrimaryPositiveCashFlow(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryPositiveCashFlow === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="yes" id="cashflow-yes" />
                  <span className="font-medium">Yes</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Business income exceeds expenses
                </span>
              </label>
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryPositiveCashFlow === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="no" id="cashflow-no" />
                  <span className="font-medium">No / Not sure</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Still building or variable
                </span>
              </label>
            </RadioGroup>
          </div>
        );

      // SPOUSE STEPS
      case 'spouse-employment':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              What about your spouse's employment?
            </h2>
            <p className="text-muted-foreground mb-8">
              Household income affects planning opportunities
            </p>
            <RadioGroup
              value={spouseEmploymentStatus}
              onValueChange={(value) => setSpouseEmploymentStatus(value as EmploymentStatus)}
              className="space-y-3"
            >
              {employmentOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseEmploymentStatus === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`spouse-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'spouse-duration':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How long has your spouse been in transition?
            </h2>
            <p className="text-muted-foreground mb-8">
              Duration affects which opportunities apply
            </p>
            <RadioGroup
              value={spouseDuration}
              onValueChange={(value) => setSpouseDuration(value as UnemploymentDuration)}
              className="space-y-3"
            >
              {durationOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseDuration === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`spouse-duration-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'spouse-severance':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Has your spouse received severance in the last 12 months?
            </h2>
            <p className="text-muted-foreground mb-8">
              Severance payments affect household tax situation
            </p>
            <RadioGroup
              value={spouseReceivedSeverance === null ? "" : spouseReceivedSeverance ? "yes" : "no"}
              onValueChange={(value) => setSpouseReceivedSeverance(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseReceivedSeverance === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="spouse-severance-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseReceivedSeverance === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="spouse-severance-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'spouse-severance-amount':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Approximately how much severance did your spouse receive?
            </h2>
            <p className="text-muted-foreground mb-8">
              This helps assess household income for the year
            </p>
            <RadioGroup
              value={spouseSeveranceRange}
              onValueChange={(value) => setSpouseSeveranceRange(value as SeveranceRange)}
              className="space-y-3"
            >
              {severanceRangeOptions.filter(o => o.value !== 'none').map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseSeveranceRange === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`spouse-sev-amt-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'spouse-severance-type':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How is your spouse's severance being paid?
            </h2>
            <p className="text-muted-foreground mb-8">
              Timing of payments affects tax planning options
            </p>
            <RadioGroup
              value={spouseSeveranceType}
              onValueChange={(value) => setSpouseSeveranceType(value as SeveranceType)}
              className="space-y-3"
            >
              {severanceTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseSeveranceType === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`spouse-sev-type-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'spouse-ui':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Is your spouse receiving unemployment insurance (UI)?
            </h2>
            <p className="text-muted-foreground mb-8">
              UI benefits are taxable income
            </p>
            <RadioGroup
              value={spouseReceivingUI === null ? "" : spouseReceivingUI ? "yes" : "no"}
              onValueChange={(value) => {
                setSpouseReceivingUI(value === "yes");
                if (value === "no") setSpouseUIRange('none');
              }}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseReceivingUI === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="spouse-ui-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseReceivingUI === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="spouse-ui-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
            {spouseReceivingUI === true && (
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  Benefits and credits can be sensitive to income changes; confirm with a CPA.
                </p>
              </div>
            )}
          </div>
        );

      case 'spouse-income-comparison':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              How does your spouse's current year income compare to a typical year?
            </h2>
            <p className="text-muted-foreground mb-8">
              Consider all sources including severance
            </p>
            <RadioGroup
              value={spouseIncomeComparison}
              onValueChange={(value) => {
                setSpouseIncomeComparison(value as CurrentYearIncomeComparison);
                setSpouseIncomeLower(value === 'lower');
              }}
              className="space-y-3"
            >
              {incomeComparisonOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseIncomeComparison === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`spouse-income-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
            {showHighIncomeWarning(spouseIncomeComparison, spouseReceivedSeverance) && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  Unemployment can still be a high-income year if severance or other income is present.
                </p>
              </div>
            )}
          </div>
        );

      case 'spouse-return':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Does your spouse expect to return to W-2 employment within 12 months?
            </h2>
            <p className="text-muted-foreground mb-8">
              This shapes the planning horizon
            </p>
            <RadioGroup
              value={spouseExpectReturn}
              onValueChange={(value) => setSpouseExpectReturn(value as 'yes' | 'no' | 'not-sure')}
              className="space-y-3"
            >
              {returnOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    spouseExpectReturn === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={option.value} id={`spouse-return-${option.value}`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-8">
                    {option.description}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'spouse-self-employed-fluctuates':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Does your spouse's income fluctuate quarter-to-quarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Variable income affects tax planning strategies
            </p>
            <RadioGroup
              value={spouseIncomeFluctuates === null ? "" : spouseIncomeFluctuates ? "yes" : "no"}
              onValueChange={(value) => setSpouseIncomeFluctuates(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseIncomeFluctuates === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="spouse-fluctuates-yes" />
                <span className="font-medium">Yes, income varies significantly</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseIncomeFluctuates === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="spouse-fluctuates-no" />
                <span className="font-medium">No, fairly stable</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'spouse-self-employed-cashflow':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Does your spouse currently have positive cash flow?
            </h2>
            <p className="text-muted-foreground mb-8">
              This affects contribution strategies and timing
            </p>
            <RadioGroup
              value={spousePositiveCashFlow === null ? "" : spousePositiveCashFlow ? "yes" : "no"}
              onValueChange={(value) => setSpousePositiveCashFlow(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spousePositiveCashFlow === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="spouse-cashflow-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spousePositiveCashFlow === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="spouse-cashflow-no" />
                <span className="font-medium">No / Not sure</span>
              </label>
            </RadioGroup>
          </div>
        );

      // LIFE CONTEXT STEPS
      case 'charitable-giving':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you make charitable gifts?
            </h2>
            <p className="text-muted-foreground mb-8">
              Charitable giving can unlock specific tax strategies
            </p>
            <RadioGroup
              value={charitableGiving}
              onValueChange={(value) => setCharitableGiving(value as CharitableRange)}
              className="space-y-3"
            >
              {charitableOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    charitableGiving === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-border hover:border-sage/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`charitable-${option.value}`} />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'business-ownership':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you own a business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Business ownership opens additional planning options
            </p>
            <RadioGroup
              value={hasBusinessOwnership === null ? "" : hasBusinessOwnership ? "yes" : "no"}
              onValueChange={(value) => setHasBusinessOwnership(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasBusinessOwnership === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="business-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasBusinessOwnership === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="business-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'employer-stock':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you hold employer stock?
            </h2>
            <p className="text-muted-foreground mb-8">
              Company stock in retirement accounts has unique considerations
            </p>
            <RadioGroup
              value={hasEmployerStock === null ? "" : hasEmployerStock ? "yes" : "no"}
              onValueChange={(value) => setHasEmployerStock(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasEmployerStock === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="employer-stock-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasEmployerStock === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="employer-stock-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'rental-real-estate':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you own rental real estate?
            </h2>
            <p className="text-muted-foreground mb-8">
              Investment properties create unique tax considerations
            </p>
            <RadioGroup
              value={hasRentalRealEstate === null ? "" : hasRentalRealEstate ? "yes" : "no"}
              onValueChange={(value) => setHasRentalRealEstate(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasRentalRealEstate === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="yes" id="rental-yes" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  hasRentalRealEstate === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <RadioGroupItem value="no" id="rental-no" />
                <span className="font-medium">No</span>
              </label>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ProgressIndicator currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {renderStep()}

          <div className="mt-8">
            <Button
              variant="sage"
              size="lg"
              className="w-full"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
