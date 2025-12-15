import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, ChevronRight, ChevronLeft, Check, User, Calendar, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { RiskTolerance } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const RISK_OPTIONS: { value: RiskTolerance; label: string; description: string }[] = [
  {
    value: 'Conservative',
    label: 'Conservative',
    description: 'Prioritize capital preservation. Lower risk, potentially lower returns.',
  },
  {
    value: 'Moderate',
    label: 'Moderate',
    description: 'Balance between growth and stability. Medium risk and returns.',
  },
  {
    value: 'Aggressive',
    label: 'Aggressive',
    description: 'Maximize growth potential. Higher risk, potentially higher returns.',
  },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('Moderate');

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    
    const success = await updateProfile({
      name: name || null,
      date_of_birth: dateOfBirth || null,
      risk_tolerance: riskTolerance,
    });

    setSaving(false);

    if (success) {
      toast.success('Profile saved!');
      onComplete();
    } else {
      toast.error('Failed to save profile');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return true; // Date of birth is optional
      case 3:
        return true; // Risk tolerance has a default
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Setup your profile</h1>
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-8 rounded-full transition-all duration-300',
                  i + 1 === step ? 'bg-primary w-12' : i + 1 < step ? 'bg-primary/40' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        <Card className="border-none shadow-soft-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-8 px-6 pb-8">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold">What should we call you?</h2>
                  <p className="text-muted-foreground">
                    We'll use this for your personalized reports.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <Input
                    id="name"
                    placeholder="Enter your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="h-12 text-lg text-center"
                  />
                  <Button 
                    className="w-full h-12 text-base font-medium rounded-xl" 
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Date of Birth */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold">When were you born?</h2>
                  <p className="text-muted-foreground">
                    This helps us calculate your investment timeline.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-12 text-lg justify-center text-center"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleBack} className="h-12 rounded-xl">
                      Back
                    </Button>
                    <Button onClick={handleNext} className="h-12 rounded-xl">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Risk Tolerance */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold">What's your investment style?</h2>
                  <p className="text-muted-foreground">
                    Select the option that best describes you.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {RISK_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRiskTolerance(option.value)}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 outline-none',
                        riskTolerance === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-transparent bg-muted/30 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground">{option.label}</span>
                        {riskTolerance === option.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" onClick={handleBack} className="h-12 rounded-xl">
                    Back
                  </Button>
                  <Button 
                    onClick={handleComplete} 
                    disabled={saving} 
                    className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {saving ? 'Creating...' : 'Finish Setup'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skip link */}
        <button
          onClick={onComplete}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Skip customization for now
        </button>
      </div>
    </div>
  );
}
