import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MaritalStatus, RetirementRange, RealEstateRange } from "@/types/persona";
import { cn } from "@/lib/utils";

interface PersonaStepProps {
  onComplete: (data: {
    firstName: string;
    age: number;
    maritalStatus: MaritalStatus;
    retirementRange: RetirementRange;
    realEstateRange: RealEstateRange;
  }) => void;
  onBack: () => void;
}

const retirementOptions: { value: RetirementRange; label: string }[] = [
  { value: '<250k', label: 'Less than $250k' },
  { value: '250k-500k', label: '$250k – $500k' },
  { value: '500k-1m', label: '$500k – $1M' },
  { value: '1m-2.5m', label: '$1M – $2.5M' },
  { value: '2.5m-5m', label: '$2.5M – $5M' },
  { value: '>5m', label: 'More than $5M' },
];

const realEstateOptions: { value: RealEstateRange; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '<250k', label: 'Less than $250k' },
  { value: '250k-750k', label: '$250k – $750k' },
  { value: '750k-2m', label: '$750k – $2M' },
  { value: '>2m', label: 'More than $2M' },
];

export function PersonaStep({ onComplete, onBack }: PersonaStepProps) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">("");
  const [retirementRange, setRetirementRange] = useState<RetirementRange | "">("");
  const [realEstateRange, setRealEstateRange] = useState<RealEstateRange | "">("");

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        firstName,
        age: parseInt(age),
        maritalStatus: maritalStatus as MaritalStatus,
        retirementRange: retirementRange as RetirementRange,
        realEstateRange: realEstateRange as RealEstateRange,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return firstName.trim().length > 0;
      case 1: return age && parseInt(age) >= 45 && parseInt(age) <= 100;
      case 2: return maritalStatus !== "";
      case 3: return retirementRange !== "";
      case 4: return realEstateRange !== "";
      default: return false;
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
          <ProgressIndicator currentStep={step + 1} totalSteps={5} />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {step === 0 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                Let's start with your name
              </h2>
              <p className="text-muted-foreground mb-8">
                What should we call you?
              </p>
              <div className="space-y-2">
                <Label htmlFor="firstName">First name or nickname</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-12 text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                Hi {firstName}! What's your age?
              </h2>
              <p className="text-muted-foreground mb-8">
                This helps us show relevant strategies
              </p>
              <div className="space-y-2">
                <Label htmlFor="age">Your age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min={45}
                  max={100}
                  className="h-12 text-lg"
                  autoFocus
                />
                {age && parseInt(age) < 45 && (
                  <p className="text-sm text-muted-foreground">
                    This tool is designed for individuals 45 and older
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                What's your marital status?
              </h2>
              <p className="text-muted-foreground mb-8">
                This affects which tax strategies apply
              </p>
              <RadioGroup
                value={maritalStatus}
                onValueChange={(value) => setMaritalStatus(value as MaritalStatus)}
                className="space-y-3"
              >
                {[
                  { value: 'single', label: 'Single' },
                  { value: 'married', label: 'Married' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      maritalStatus === option.value
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

          {step === 3 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                Retirement account value
              </h2>
              <p className="text-muted-foreground mb-8">
                Include all IRAs, 401(k)s, and similar accounts
              </p>
              <RadioGroup
                value={retirementRange}
                onValueChange={(value) => setRetirementRange(value as RetirementRange)}
                className="space-y-3"
              >
                {retirementOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      retirementRange === option.value
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

          {step === 4 && (
            <div className="opacity-0 animate-fade-up">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                Real estate equity
              </h2>
              <p className="text-muted-foreground mb-8">
                Approximate equity in properties you own
              </p>
              <RadioGroup
                value={realEstateRange}
                onValueChange={(value) => setRealEstateRange(value as RealEstateRange)}
                className="space-y-3"
              >
                {realEstateOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      realEstateRange === option.value
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
              {step === 4 ? "See Stories Like Mine" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
