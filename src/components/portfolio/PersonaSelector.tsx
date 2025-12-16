
import { cn } from "@/lib/utils";
import { Persona, AgeBand, EmploymentStatus, MaritalStatus, RealEstateProfile, RetirementRange } from "@/types/persona";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressStepper } from "./ProgressStepper";
import { ChevronRight, ChevronLeft, Check, Target, Briefcase, Home, DollarSign, Users } from "lucide-react";

interface PersonaSelectorProps {
  onComplete: (persona: Persona) => void;
}

export function PersonaSelector({ onComplete }: PersonaSelectorProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // State for persona
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(null);
  const [employment, setEmployment] = useState<EmploymentStatus>("Employed");
  const [spouseEmployment, setSpouseEmployment] = useState<EmploymentStatus>("Employed");
  const [retirementRange, setRetirementRange] = useState<RetirementRange | null>(null);
  const [realEstate, setRealEstate] = useState<RealEstateProfile>("None");

  const handleNext = () => {
    // Skip spouse step if not married
    if (step === 3 && maritalStatus !== "Married") {
      setStep(step + 2); // Skip spouse employment step (go to step 5)
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    // Skip spouse step if not married when going back
    if (step === 5 && maritalStatus !== "Married") {
      setStep(step - 2);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    if (ageBand && maritalStatus && retirementRange) {
      onComplete({
        ageBand,
        maritalStatus,
        employment,
        spouseEmployment: maritalStatus === "Married" ? spouseEmployment : undefined,
        retirementRange,
        realEstate,
        hasTaxableBrokerage: true, 
        hasHSA: true,
      });
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!ageBand;
      case 2: return !!maritalStatus;
      case 3: return !!employment;
      case 4: return !!spouseEmployment;
      case 5: return !!retirementRange;
      case 6: return !!realEstate;
      default: return false;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressStepper currentStep={step} totalSteps={totalSteps} />
      
      <Card className="mt-8 border-none shadow-card bg-surface">
        <CardContent className="pt-8 px-6 pb-8 min-h-[400px] flex flex-col">
          <div className="flex-1 space-y-6">
            
            {/* Step 1: Age */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-primarySoft rounded-full text-primary mb-2">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">What is your age range?</h2>
                  <p className="text-textSecondary">We use this to identify age-specific opportunities like catch-up contributions or RMDs.</p>
                </div>
                <RadioGroup value={ageBand || ""} onValueChange={(v) => setAgeBand(v as AgeBand)} className="grid grid-cols-1 gap-3">
                  {["45-49", "50-54", "55-59", "60-65"].map((opt) => (
                    <SelectionOption key={opt} value={opt} label={opt} selected={ageBand === opt} />
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Marital Status */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-purple-100 rounded-full text-purple-600 mb-2">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">What is your marital status?</h2>
                  <p className="text-textSecondary">This helps identify spousal planning strategies.</p>
                </div>
                <RadioGroup value={maritalStatus || ""} onValueChange={(v) => setMaritalStatus(v as MaritalStatus)} className="grid grid-cols-1 gap-3">
                  {["Single", "Married"].map((opt) => (
                    <SelectionOption key={opt} value={opt} label={opt} selected={maritalStatus === opt} />
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Your Employment */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-2">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">Your Employment Status</h2>
                  <p className="text-textSecondary">Identifies income shifting and benefit opportunities.</p>
                </div>
                <RadioGroup value={employment} onValueChange={(v) => setEmployment(v as EmploymentStatus)} className="grid grid-cols-1 gap-3">
                  {[
                    { val: "Employed", txt: "Employed (W-2)", desc: "Standard employment" },
                    { val: "Consulting", txt: "Self-Employed / Consulting", desc: "1099 or Business Owner" },
                    { val: "Severance", txt: "Recently Separated / Severance", desc: "Transitioning jobs" },
                    { val: "Unemployed", txt: "Unemployed / Retired", desc: "No earned income" },
                  ].map((opt) => (
                    <div
                      key={opt.val}
                      className={cn(
                        "relative flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-surfaceMuted",
                        employment === opt.val ? "border-primary bg-primarySoft/30" : "border-transparent bg-surfaceMuted/50"
                      )}
                      onClick={() => setEmployment(opt.val as EmploymentStatus)}
                    >
                      <RadioGroupItem value={opt.val} id={opt.val} className="peer sr-only" />
                      <div className="flex-1">
                        <Label htmlFor={opt.val} className="text-base font-semibold cursor-pointer block text-textPrimary">
                          {opt.txt}
                        </Label>
                        <p className="text-sm text-textMuted mt-0.5">{opt.desc}</p>
                      </div>
                      {employment === opt.val && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Spouse Employment (only shown if married) */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-purple-100 rounded-full text-purple-600 mb-2">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">Spouse&apos;s Employment Status</h2>
                  <p className="text-textSecondary">This helps identify additional household planning opportunities.</p>
                </div>
                <RadioGroup value={spouseEmployment} onValueChange={(v) => setSpouseEmployment(v as EmploymentStatus)} className="grid grid-cols-1 gap-3">
                  {[
                    { val: "Employed", txt: "Employed (W-2)", desc: "Standard employment" },
                    { val: "Consulting", txt: "Self-Employed / Consulting", desc: "1099 or Business Owner" },
                    { val: "Severance", txt: "Recently Separated / Severance", desc: "Transitioning jobs" },
                    { val: "Unemployed", txt: "Unemployed / Retired", desc: "No earned income" },
                  ].map((opt) => (
                    <div
                      key={opt.val}
                      className={cn(
                        "relative flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-surfaceMuted",
                        spouseEmployment === opt.val ? "border-primary bg-primarySoft/30" : "border-transparent bg-surfaceMuted/50"
                      )}
                      onClick={() => setSpouseEmployment(opt.val as EmploymentStatus)}
                    >
                      <RadioGroupItem value={opt.val} id={`spouse-${opt.val}`} className="peer sr-only" />
                      <div className="flex-1">
                        <Label htmlFor={`spouse-${opt.val}`} className="text-base font-semibold cursor-pointer block text-textPrimary">
                          {opt.txt}
                        </Label>
                        <p className="text-sm text-textMuted mt-0.5">{opt.desc}</p>
                      </div>
                      {spouseEmployment === opt.val && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Retirement Assets */}
            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-2">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">Investable Assets</h2>
                  <p className="text-textSecondary">Total value of retirement and brokerage accounts.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "<250k", "250k-500k", "500k-1M", 
                    "1M-2.5M", "2.5M-5M", "5M+"
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setRetirementRange(opt as RetirementRange)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all font-medium text-sm",
                        retirementRange === opt 
                          ? "border-primary bg-primarySoft/30 text-primary" 
                          : "border-transparent bg-surfaceMuted text-textSecondary hover:bg-surfaceMuted/80"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Real Estate */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-600 mb-2">
                    <Home className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-textPrimary">Real Estate Profile</h2>
                  <p className="text-textSecondary">Do you own property?</p>
                </div>
                <RadioGroup value={realEstate} onValueChange={(v) => setRealEstate(v as RealEstateProfile)} className="grid grid-cols-1 gap-3">
                  {[
                    { val: "None", txt: "Renting / No Ownership" },
                    { val: "Primary", txt: "Primary Residence Only" },
                    { val: "Rental", txt: "Rental / Investment Properties" }
                  ].map((opt) => (
                    <SelectionOption key={opt.val} value={opt.val} label={opt.txt} selected={realEstate === opt.val} />
                  ))}
                </RadioGroup>
              </div>
            )}

          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="text-textMuted hover:text-textPrimary"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-8 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
            >
              {step === totalSteps ? "Generate Plan" : "Continue"}
              {step < totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectionOption({ value, label, selected }: { value: string; label: string; selected: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
      selected ? "border-primary bg-primarySoft/30" : "border-transparent bg-surfaceMuted hover:bg-surfaceMuted/80"
    )}>
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <Label htmlFor={value} className="flex-1 font-semibold text-textPrimary cursor-pointer text-base">
        {label}
      </Label>
      {selected && <Check className="h-5 w-5 text-primary" />}
    </div>
  );
}
