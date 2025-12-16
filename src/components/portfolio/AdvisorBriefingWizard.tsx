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
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  CheckCircle2,
  User,
  ClipboardList,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Strategy, RetirementRange } from "@/types/persona";
import { getQuestionsForStrategy, type StrategyQuestion } from "@/data/strategy-questions";
import { getAdvisorInfoForStrategy } from "@/data/strategy-advisor-info";
import { generateAdvisorBriefingPDF, type ClientProfile, type QuestionAnswer } from "@/lib/advisor-briefing-pdf";
import { calculatePersonalizedEstimate, formatEstimate } from "@/lib/personalized-estimates";
import { cn } from "@/lib/utils";

interface AdvisorBriefingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy;
  clientProfile?: ClientProfile;
}

type Step = 'questions' | 'preview' | 'download';

export function AdvisorBriefingWizard({
  open,
  onOpenChange,
  strategy,
  clientProfile = {},
}: AdvisorBriefingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('questions');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = useMemo(() => getQuestionsForStrategy(strategy.id), [strategy.id]);
  const advisorInfo = useMemo(() => getAdvisorInfoForStrategy(strategy.id), [strategy.id]);
  const estimate = useMemo(
    () => calculatePersonalizedEstimate(
      strategy.id,
      clientProfile.retirementRange || '500k-1M',
      clientProfile.age || 55
    ),
    [strategy.id, clientProfile]
  );

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'questions', label: 'Your Situation', icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'preview', label: 'Review', icon: <User className="h-4 w-4" /> },
    { key: 'download', label: 'Download', icon: <Download className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep === 'questions') {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('download');
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('questions');
    } else if (currentStep === 'download') {
      setCurrentStep('preview');
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    const questionAnswers: QuestionAnswer[] = questions.map(q => ({
      questionId: q.id,
      questionLabel: q.label,
      answer: answers[q.id] || 'Not provided',
    })).filter(qa => qa.answer !== 'Not provided');

    try {
      await generateAdvisorBriefingPDF({
        strategy,
        clientProfile,
        answers: questionAnswers,
        generatedDate: new Date().toLocaleDateString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('questions');
    setAnswers({});
    onOpenChange(false);
  };

  const renderQuestionInput = (question: StrategyQuestion) => {
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

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={question.id}
              checked={value === 'yes'}
              onCheckedChange={(checked) => handleAnswerChange(question.id, checked ? 'yes' : 'no')}
            />
            <label htmlFor={question.id} className="text-sm text-muted-foreground">
              Yes
            </label>
          </div>
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

  const getAnswerDisplay = (question: StrategyQuestion): string => {
    const value = answers[question.id];
    if (!value) return 'Not provided';
    
    if (question.type === 'select' && question.options) {
      const option = question.options.find(o => o.value === value);
      return option?.label || value;
    }
    
    if (question.type === 'checkbox') {
      return value === 'yes' ? 'Yes' : 'No';
    }
    
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prepare Your Advisor Meeting
          </DialogTitle>
          <DialogDescription>
            {strategy.title}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[300px]"
          >
            {/* Step 1: Questions */}
            {currentStep === 'questions' && (
              <div className="space-y-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Answer a few questions to personalize your briefing document.
                </p>
                
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-sm font-medium">{question.label}</Label>
                    {renderQuestionInput(question)}
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Preview */}
            {currentStep === 'preview' && (
              <div className="space-y-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Review the information before generating your briefing document.
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
                      {clientProfile.age || 'Not provided'}
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

                {/* Strategy Summary */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                  <h4 className="font-semibold text-sm">Strategy: {strategy.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {strategy.whatThisIs || strategy.description}
                  </p>
                  <div className="pt-2 border-t border-primary/20">
                    <span className="text-sm text-muted-foreground">Estimated Savings: </span>
                    <span className="font-semibold text-primary">{formatEstimate(estimate)}</span>
                  </div>
                </div>

                {/* Answers Summary */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Your Responses
                  </h4>
                  <div className="space-y-1">
                    {questions.map((q) => (
                      <div key={q.id} className="text-sm">
                        <span className="text-muted-foreground">{q.label}</span>
                        <p className="font-medium">{getAnswerDisplay(q)}</p>
                      </div>
                    ))}
                  </div>
                </div>

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
                      Strategy overview & why it applies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Your specific situation details
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Estimated savings analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {advisorInfo.questionsForAdvisor.length} questions to discuss with your advisor
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Document checklist ({advisorInfo.documentsToGather.length} items)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Important deadlines & timing
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Download */}
            {currentStep === 'download' && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Your Briefing is Ready</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Click the button below to download your personalized advisor briefing document. 
                    Bring this to your meeting with a {advisorInfo.professionalType}.
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

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={currentStep === 'questions' ? handleClose : handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 'questions' ? 'Cancel' : 'Back'}
          </Button>

          {currentStep !== 'download' && (
            <Button onClick={handleNext} className="gap-2">
              {currentStep === 'questions' ? 'Review' : 'Generate'}
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
