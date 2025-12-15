import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { EmploymentStatus, MaritalStatus, UnemploymentDetails, UnemploymentDuration } from "@/types/persona";
import { cn } from "@/lib/utils";

interface HouseholdStepProps {
  maritalStatus: MaritalStatus;
  onComplete: (data: {
    employmentStatus: EmploymentStatus;
    unemploymentDetails?: UnemploymentDetails;
    spouseEmploymentStatus?: EmploymentStatus;
    spouseUnemploymentDetails?: UnemploymentDetails;
  }) => void;
  onBack: () => void;
}

const employmentOptions: { value: EmploymentStatus; label: string; description: string }[] = [
  { value: 'employed', label: 'Employed', description: 'Currently working' },
  { value: 'unemployed', label: 'In Transition', description: 'Between jobs, on sabbatical, or career change' },
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

type Step = 
  | 'primary-employment'
  | 'primary-duration'
  | 'primary-income-lower'
  | 'primary-return'
  | 'spouse-employment'
  | 'spouse-duration'
  | 'spouse-income-lower'
  | 'spouse-return';

export function HouseholdStep({ maritalStatus, onComplete, onBack }: HouseholdStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('primary-employment');
  
  // Primary person state
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [primaryDuration, setPrimaryDuration] = useState<UnemploymentDuration | "">("");
  const [primaryIncomeLower, setPrimaryIncomeLower] = useState<boolean | null>(null);
  const [primaryExpectReturn, setPrimaryExpectReturn] = useState<'yes' | 'no' | 'not-sure' | "">("");
  
  // Spouse state
  const [spouseEmploymentStatus, setSpouseEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [spouseDuration, setSpouseDuration] = useState<UnemploymentDuration | "">("");
  const [spouseIncomeLower, setSpouseIncomeLower] = useState<boolean | null>(null);
  const [spouseExpectReturn, setSpouseExpectReturn] = useState<'yes' | 'no' | 'not-sure' | "">("");

  const getStepFlow = (): Step[] => {
    const flow: Step[] = ['primary-employment'];
    
    if (employmentStatus === 'unemployed') {
      flow.push('primary-duration', 'primary-income-lower', 'primary-return');
    }
    
    if (maritalStatus === 'married') {
      flow.push('spouse-employment');
      if (spouseEmploymentStatus === 'unemployed') {
        flow.push('spouse-duration', 'spouse-income-lower', 'spouse-return');
      }
    }
    
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
    const primaryDetails: UnemploymentDetails | undefined = 
      employmentStatus === 'unemployed' && primaryDuration && primaryIncomeLower !== null && primaryExpectReturn
        ? {
            duration: primaryDuration as UnemploymentDuration,
            incomeLowerThanTypical: primaryIncomeLower,
            expectReturnWithin12Months: primaryExpectReturn as 'yes' | 'no' | 'not-sure'
          }
        : undefined;

    const spouseDetails: UnemploymentDetails | undefined = 
      spouseEmploymentStatus === 'unemployed' && spouseDuration && spouseIncomeLower !== null && spouseExpectReturn
        ? {
            duration: spouseDuration as UnemploymentDuration,
            incomeLowerThanTypical: spouseIncomeLower,
            expectReturnWithin12Months: spouseExpectReturn as 'yes' | 'no' | 'not-sure'
          }
        : undefined;

    onComplete({
      employmentStatus: employmentStatus as EmploymentStatus,
      unemploymentDetails: primaryDetails,
      spouseEmploymentStatus: maritalStatus === 'married' ? spouseEmploymentStatus as EmploymentStatus : undefined,
      spouseUnemploymentDetails: spouseDetails,
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
      case 'primary-income-lower': return primaryIncomeLower !== null;
      case 'primary-return': return primaryExpectReturn !== "";
      case 'spouse-employment': return spouseEmploymentStatus !== "";
      case 'spouse-duration': return spouseDuration !== "";
      case 'spouse-income-lower': return spouseIncomeLower !== null;
      case 'spouse-return': return spouseExpectReturn !== "";
      default: return false;
    }
  };

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

      case 'primary-income-lower':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Is your income this year significantly lower than a typical working year?
            </h2>
            <p className="text-muted-foreground mb-8">
              Lower-income years can create unique planning opportunities
            </p>
            <RadioGroup
              value={primaryIncomeLower === null ? "" : primaryIncomeLower ? "yes" : "no"}
              onValueChange={(value) => setPrimaryIncomeLower(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryIncomeLower === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="yes" id="income-lower-yes" />
                  <span className="font-medium">Yes, noticeably lower</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Income is significantly below what I'd typically earn
                </span>
              </label>
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  primaryIncomeLower === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="no" id="income-lower-no" />
                  <span className="font-medium">No, about the same</span>
                </div>
                <span className="text-sm text-muted-foreground ml-8">
                  Severance, savings, or other income keeps it similar
                </span>
              </label>
            </RadioGroup>
          </div>
        );

      case 'primary-return':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Do you expect to return to similar income levels?
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

      case 'spouse-income-lower':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Is your spouse's income this year significantly lower than typical?
            </h2>
            <p className="text-muted-foreground mb-8">
              Household income changes affect planning options
            </p>
            <RadioGroup
              value={spouseIncomeLower === null ? "" : spouseIncomeLower ? "yes" : "no"}
              onValueChange={(value) => setSpouseIncomeLower(value === "yes")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseIncomeLower === true
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="yes" id="spouse-income-lower-yes" />
                  <span className="font-medium">Yes, noticeably lower</span>
                </div>
              </label>
              <label
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  spouseIncomeLower === false
                    ? "border-sage bg-sage-light/50"
                    : "border-border hover:border-sage/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="no" id="spouse-income-lower-no" />
                  <span className="font-medium">No, about the same</span>
                </div>
              </label>
            </RadioGroup>
          </div>
        );

      case 'spouse-return':
        return (
          <div className="opacity-0 animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Does your spouse expect to return to similar income?
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
