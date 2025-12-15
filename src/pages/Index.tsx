import { useState } from "react";
import { IntroStep } from "@/components/steps/IntroStep";
import { PersonaStep } from "@/components/steps/PersonaStep";
import { StoriesStep } from "@/components/steps/StoriesStep";
import { HouseholdStep } from "@/components/steps/HouseholdStep";
import { ResultsStep } from "@/components/steps/ResultsStep";
import { matchStories } from "@/data/stories";
import { matchStrategies } from "@/data/strategies";
import { 
  UserProfile, 
  MaritalStatus, 
  RetirementRange, 
  RealEstateRange, 
  EmploymentStatus, 
  PersonaStory, 
  Strategy,
  UnemploymentDetails
} from "@/types/persona";

type Step = 'intro' | 'persona' | 'stories' | 'household' | 'results';

export default function Index() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [matchedStories, setMatchedStories] = useState<PersonaStory[]>([]);
  const [matchedStrategies, setMatchedStrategies] = useState<Strategy[]>([]);

  const handleStart = () => {
    setCurrentStep('persona');
  };

  const handlePersonaComplete = (data: {
    firstName: string;
    age: number;
    maritalStatus: MaritalStatus;
    retirementRange: RetirementRange;
    realEstateRange: RealEstateRange;
  }) => {
    setProfile(prev => ({ ...prev, ...data }));
    
    // Match stories based on persona
    const stories = matchStories({
      age: data.age,
      maritalStatus: data.maritalStatus,
      retirementRange: data.retirementRange,
      realEstateRange: data.realEstateRange,
    });
    setMatchedStories(stories);
    
    setCurrentStep('stories');
  };

  const handleStoriesContinue = () => {
    setCurrentStep('household');
  };

  const handleHouseholdComplete = (data: {
    employmentStatus: EmploymentStatus;
    unemploymentDetails?: UnemploymentDetails;
    spouseEmploymentStatus?: EmploymentStatus;
    spouseUnemploymentDetails?: UnemploymentDetails;
  }) => {
    const fullProfile: UserProfile = {
      firstName: profile.firstName!,
      age: profile.age!,
      maritalStatus: profile.maritalStatus!,
      retirementRange: profile.retirementRange!,
      realEstateRange: profile.realEstateRange!,
      employmentStatus: data.employmentStatus,
      unemploymentDetails: data.unemploymentDetails,
      spouseEmploymentStatus: data.spouseEmploymentStatus,
      spouseUnemploymentDetails: data.spouseUnemploymentDetails,
    };
    
    setProfile(fullProfile);
    
    // Match strategies
    const strategies = matchStrategies(fullProfile);
    setMatchedStrategies(strategies);
    
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setProfile({});
    setMatchedStories([]);
    setMatchedStrategies([]);
    setCurrentStep('intro');
  };

  const handleBackToIntro = () => {
    setCurrentStep('intro');
  };

  const handleBackToPersona = () => {
    setCurrentStep('persona');
  };

  const handleBackToStories = () => {
    setCurrentStep('stories');
  };

  switch (currentStep) {
    case 'intro':
      return <IntroStep onStart={handleStart} />;
    
    case 'persona':
      return (
        <PersonaStep 
          onComplete={handlePersonaComplete}
          onBack={handleBackToIntro}
        />
      );
    
    case 'stories':
      return (
        <StoriesStep
          firstName={profile.firstName || ''}
          stories={matchedStories}
          onContinue={handleStoriesContinue}
          onBack={handleBackToPersona}
        />
      );
    
    case 'household':
      return (
        <HouseholdStep
          maritalStatus={profile.maritalStatus!}
          onComplete={handleHouseholdComplete}
          onBack={handleBackToStories}
        />
      );
    
    case 'results':
      return (
        <ResultsStep
          profile={profile as UserProfile}
          strategies={matchedStrategies}
          onRestart={handleRestart}
        />
      );
    
    default:
      return <IntroStep onStart={handleStart} />;
  }
}
