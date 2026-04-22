import { useState } from 'react';

import type { MacrosPort } from '../../core/application/ports/MacrosPort';
import type { OnboardingPort } from '../../core/application/ports/OnboardingPort';
import type { StatsInitPort } from '../../core/application/ports/StatsInitPort';
import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import { INITIAL_FORM_DATA } from '../../core/domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../core/domain/models/OnboardingResponse';
import { validateStep } from '../../core/domain/validators/OnboardingValidator';

const TOTAL_STEPS = 6;

interface UseOnboardingWizardProps {
  userId: number;
  token: string;
  onboardingService: OnboardingPort;
  statsInitService: StatsInitPort;
  macrosService: MacrosPort;
  onComplete: (userData: OnboardingResponse['user']) => void;
}

export function useOnboardingWizard({
  userId,
  token,
  onboardingService,
  statsInitService,
  macrosService,
  onComplete,
}: UseOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    field: keyof OnboardingFormData,
    value: string | string[]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleNext() {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    if (currentStep === TOTAL_STEPS) {
      await handleSubmit();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  }

  function handlePrev() {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await onboardingService.submitOnboarding(
        formData,
        userId,
        token
      );
      // Post-onboarding side effects: non-fatal, do not block navigation.
      await Promise.allSettled([
        statsInitService.initStats(token),
        macrosService.calculateMacros(formData, userId, token),
      ]);
      onComplete(response.user);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitError,
    totalSteps: TOTAL_STEPS,
    handleChange,
    handleNext,
    handlePrev,
  };
}
