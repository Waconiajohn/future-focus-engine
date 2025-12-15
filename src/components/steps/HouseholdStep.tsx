import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { EmploymentStatus, MaritalStatus } from "@/types/persona";
import { cn } from "@/lib/utils";

interface HouseholdStepProps {
  maritalStatus: MaritalStatus;
  onComplete: (data: {
    employmentStatus: EmploymentStatus;
    spouseEmploymentStatus?: EmploymentStatus;
    unemploymentDuration?: string;
    expectReturnToWork?: 'yes' | 'no' | 'not-sure';
  }) => void;
  onBack: () => void;
}

const employmentOptions: { value: EmploymentStatus; label: string; description: string }[] = [
  { value: 'employed', label: 'Employed', description: 'Currently working' },
  { value: 'unemployed', label: 'Unemployed', description: 'Between jobs or career transition' },
  { value: 'retired', label: 'Retired', description: 'No longer working' },
];

const durationOptions = [
  { value: '<3months', label: 'Less than 3 months' },
  { value: '3-6months', label: '3–6 months' },
  { value: '6-12months', label: '6–12 months' },
  { value: '>12months', label: 'More than 12 months' },
];

const returnOptions: { value: 'yes' | 'no' | 'not-sure'; label: string }[] = [
  { value: 'yes', label: 'Yes, likely' },
  { value: 'no', label: 'No, unlikely' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export function HouseholdStep({ maritalStatus, onComplete, onBack }: HouseholdStepProps) {
  const [step, setStep] = useState(0);
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [spouseEmploymentStatus, setSpouseEmploymentStatus] = useState<EmploymentStatus | "">("");
  const [unemploymentDuration, setUnemploymentDuration] = useState("");
  const [expectReturnToWork, setExpectReturnToWork] = useState<'yes' | 'no' | 'not-sure' | "">("");

  const showUnemploymentQuestions = employmentStatus === 'unemployed' || 
    (maritalStatus === 'married' && spouseEmploymentStatus === 'unemployed');

  const totalSteps = maritalStatus === 'married' 
    ? (showUnemploymentQuestions ? 4 : 2)
    : (employmentStatus === 'unemployed' ? 3 : 1);

  const handleNext = () => {
    const nextStep = step + 1;
    
    if (maritalStatus === 'single') {
      if (employmentStatus === 'unemployed' && step < 2) {
        setStep(nextStep);
        return;
      }
      handleComplete();
      return;
    }

    // Married flow
    if (step === 0) {
      setStep(1);
      return;
    }
    
    if (step === 1 && showUnemploymentQuestions) {
      setStep(2);
      return;
    }
    
    if (step === 2 && showUnemploymentQuestions) {
      setStep(3);
      return;
    }

    handleComplete();
  };

  const handleComplete = () => {
    onComplete({
      employmentStatus: employmentStatus as EmploymentStatus,
      spouseEmploymentStatus: maritalStatus === 'married' ? spouseEmploymentStatus as EmploymentStatus : undefined,
      unemploymentDuration: showUnemploymentQuestions ? unemploymentDuration : undefined,
      expectReturnToWork: showUnemploymentQuestions ? expectReturnToWork as 'yes' | 'no' | 'not-sure' : undefined,
    });
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    if (step === 0) return employmentStatus !== "";
    if (step === 1 && maritalStatus === 'married') return spouseEmploymentStatus !== "";
    if (step === 2 && showUnemploymentQuestions) return unemploymentDuration !== "";
    if (step === 3 && showUnemploymentQuestions) return expectReturnToWork !== "";
    return true;
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ProgressIndicator currentStep={step + 1} totalSteps={totalSteps} />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {step === 0 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                What's your employment status?
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
          )}

          {step === 1 && maritalStatus === 'married' && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                What about your spouse?
              </h2>
              <p className="text-muted-foreground mb-8">
                Their situation affects household planning
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
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && showUnemploymentQuestions && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                How long unemployed?
              </h2>
              <p className="text-muted-foreground mb-8">
                Duration can affect planning windows
              </p>
              <RadioGroup
                value={unemploymentDuration}
                onValueChange={setUnemploymentDuration}
                className="space-y-3"
              >
                {durationOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      unemploymentDuration === option.value
                        ? "border-sage bg-sage-light/50"
                        : "border-border hover:border-sage/50"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 3 && showUnemploymentQuestions && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                Expecting to return to work?
              </h2>
              <p className="text-muted-foreground mb-8">
                This shapes the planning horizon
              </p>
              <RadioGroup
                value={expectReturnToWork}
                onValueChange={(value) => setExpectReturnToWork(value as 'yes' | 'no' | 'not-sure')}
                className="space-y-3"
              >
                {returnOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      expectReturnToWork === option.value
                        ? "border-sage bg-sage-light/50"
                        : "border-border hover:border-sage/50"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

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
