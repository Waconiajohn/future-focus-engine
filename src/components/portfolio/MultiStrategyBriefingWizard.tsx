import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  CheckCircle2,
  User,
  ClipboardList,
  Download,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Strategy, RetirementRange } from "@/types/persona";
import { ImpactBadge } from "./ImpactBadge";
import { generateMultiStrategyBriefingPDF, type ClientProfile, type QuestionAnswer } from "@/lib/advisor-briefing-pdf";
import { calculatePersonalizedEstimate, formatEstimate } from "@/lib/personalized-estimates";
import { cn } from "@/lib/utils";

interface MultiStrategyBriefingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategies: Strategy[];
  clientProfile?: ClientProfile;
  onRemoveStrategy?: (strategyId: string) => void;
}

type Step = 'review' | 'questions' | 'preview' | 'download';

// Common questions for multi-strategy briefings
const commonQuestions = [
  {
    id: 'advisor_relationship',
    label: 'Do you currently work with a tax advisor or financial planner?',
    type: 'select' as const,
    options: [
      { value: 'yes_tax', label: 'Yes, a tax advisor/CPA' },
      { value: 'yes_financial', label: 'Yes, a financial planner/CFP' },
      { value: 'yes_both', label: 'Yes, both' },
      { value: 'no', label: 'No, I need to find one' },
    ],
  },
  {
    id: 'timeline',
    label: 'When are you hoping to implement these strategies?',
    type: 'select' as const,
    options: [
      { value: 'this_year', label: 'This tax year' },
      { value: 'next_year', label: 'Next tax year' },
      { value: 'exploring', label: 'Just exploring options' },
    ],
  },
  {
    id: 'priority',
    label: 'What is your primary goal?',
    type: 'select' as const,
    options: [
      { value: 'reduce_taxes', label: 'Reduce current tax burden' },
      { value: 'retirement', label: 'Optimize retirement income' },
      { value: 'estate', label: 'Estate planning / wealth transfer' },
      { value: 'all', label: 'All of the above' },
    ],
  },
  {
    id: 'notes',
    label: 'Any additional notes or questions for your advisor?',
    type: 'text' as const,
    placeholder: 'Add any specific questions or context you want to discuss...',
  },
];

export function MultiStrategyBriefingWizard({
  open,
  onOpenChange,
  strategies,
  clientProfile = {},
  onRemoveStrategy,
}: MultiStrategyBriefingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('review');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate total estimated savings
  const totalEstimate = useMemo(() => {
    let totalLow = 0;
    let totalHigh = 0;
    
    strategies.forEach(strategy => {
      const estimate = calculatePersonalizedEstimate(
        strategy.id,
        clientProfile.retirementRange || '500k-1M',
        clientProfile.age || 55
      );
      totalLow += estimate.lowEstimate;
      totalHigh += estimate.highEstimate;
    });
    
    return { lowEstimate: totalLow, highEstimate: totalHigh };
  }, [strategies, clientProfile]);

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'review', label: 'Review Selection', icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'questions', label: 'Your Situation', icon: <User className="h-4 w-4" /> },
    { key: 'preview', label: 'Preview', icon: <FileText className="h-4 w-4" /> },
    { key: 'download', label: 'Download', icon: <Download className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const stepOrder: Step[] = ['review', 'questions', 'preview', 'download'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['review', 'questions', 'preview', 'download'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    const questionAnswers: QuestionAnswer[] = commonQuestions.map(q => ({
      questionId: q.id,
      questionLabel: q.label,
      answer: answers[q.id] || 'Not provided',
    })).filter(qa => qa.answer !== 'Not provided');

    try {
      await generateMultiStrategyBriefingPDF({
        strategies,
        clientProfile,
        answers: questionAnswers,
        generatedDate: new Date().toLocaleDateString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('review');
    setAnswers({});
    onOpenChange(false);
  };

  const renderQuestionInput = (question: typeof commonQuestions[0]) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={(v) => handleAnswerChange(question.id, v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[80px]"
          />
        );

      default:
        return null;
    }
  };

  const getAnswerDisplay = (question: typeof commonQuestions[0]): string => {
    const value = answers[question.id];
    if (!value) return 'Not provided';
    
    if (question.type === 'select' && question.options) {
      const option = question.options.find(o => o.value === value);
      return option?.label || value;
    }
    
    return value;
  };

  const formatTotalEstimate = () => {
    if (totalEstimate.lowEstimate === totalEstimate.highEstimate) {
      return `$${totalEstimate.lowEstimate.toLocaleString()}`;
    }
    return `$${totalEstimate.lowEstimate.toLocaleString()} - $${totalEstimate.highEstimate.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create Consolidated Advisor Briefing
          </DialogTitle>
          <DialogDescription>
            {strategies.length} strategies selected
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step, i) => (
              <div
                key={step.key}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors",
                  i <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <ScrollArea className="flex-1 pr-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {/* Step 1: Review Selection */}
              {currentStep === 'review' && (
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Review the strategies you've selected. You can remove any you don't want to include.
                  </p>

                  <div className="space-y-2">
                    {strategies.map((strategy) => {
                      const estimate = calculatePersonalizedEstimate(
                        strategy.id,
                        clientProfile.retirementRange || '500k-1M',
                        clientProfile.age || 55
                      );
                      return (
                        <div
                          key={strategy.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm truncate">{strategy.title}</span>
                              <ImpactBadge impact={strategy.impact} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Est. savings: {formatEstimate(estimate)}
                            </p>
                          </div>
                          {onRemoveStrategy && strategies.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onRemoveStrategy(strategy.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Summary */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Combined Estimated Savings</span>
                      <span className="text-lg font-bold text-primary">{formatTotalEstimate()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on your profile and {strategies.length} selected strategies
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Questions */}
              {currentStep === 'questions' && (
                <div className="space-y-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Answer a few questions to personalize your consolidated briefing.
                  </p>
                  
                  {commonQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-sm font-medium">{question.label}</Label>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Preview */}
              {currentStep === 'preview' && (
                <div className="space-y-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Review your consolidated briefing before generating the PDF.
                  </p>

                  {/* Profile Summary */}
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Client Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Age:</span>{' '}
                        {clientProfile.ageBand || 'Not provided'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Marital Status:</span>{' '}
                        {clientProfile.maritalStatus || 'Not provided'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Employment:</span>{' '}
                        {clientProfile.employmentStatus || 'Not provided'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retirement Assets:</span>{' '}
                        {clientProfile.retirementRange || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {/* Strategies Summary */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{strategies.length} Strategies Included</h4>
                    <div className="space-y-1">
                      {strategies.map((s, i) => (
                        <div key={s.id} className="text-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                            {i + 1}
                          </span>
                          <span>{s.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answers Summary */}
                  {Object.keys(answers).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Your Responses
                      </h4>
                      <div className="space-y-1">
                        {commonQuestions.filter(q => answers[q.id]).map((q) => (
                          <div key={q.id} className="text-sm">
                            <span className="text-muted-foreground">{q.label}</span>
                            <p className="font-medium">{getAnswerDisplay(q)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What's included */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Your briefing will include:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Client profile summary
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Executive summary with combined savings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {strategies.length} strategy details with explanations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Questions to discuss with your advisor
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Combined document checklist
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Important deadlines & timing
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 4: Download */}
              {currentStep === 'download' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Your Consolidated Briefing is Ready</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Click the button below to download your personalized advisor briefing document 
                      covering all {strategies.length} selected strategies.
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={handleGeneratePDF}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Download Briefing PDF'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center max-w-sm">
                    The PDF will be saved to your device. You can print it or share it digitally with your advisor.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={currentStep === 'review' ? handleClose : handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 'review' ? 'Cancel' : 'Back'}
          </Button>

          {currentStep !== 'download' && (
            <Button onClick={handleNext} className="gap-2" disabled={strategies.length === 0}>
              {currentStep === 'preview' ? 'Generate' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {currentStep === 'download' && (
            <Button variant="outline" onClick={handleClose}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
