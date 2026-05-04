import { useState } from 'react';

import type { MacrosRepository } from '../../core/application/ports/MacrosRepository';
import type { OnboardingRepository } from '../../core/application/ports/OnboardingRepository';
import type { StatsInitRepository } from '../../core/application/ports/StatsInitRepository';
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
  initialName: string;
  onboardingService: OnboardingRepository;
  statsInitService: StatsInitRepository;
  macrosService: MacrosRepository;
  onComplete: (response: OnboardingResponse) => void;
}

export function useOnboardingWizard({
  userId,
  token,
  initialName,
  onboardingService,
  statsInitService,
  macrosService,
  onComplete,
}: UseOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  // Seed `name` from the auth user — the wizard no longer asks for it but
  // the server validator still requires it in the submit payload.
  const [formData, setFormData] = useState<OnboardingFormData>(() => ({
    ...INITIAL_FORM_DATA,
    name: initialName,
  }));
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
        userId
      );
      // Post-onboarding side effects: non-fatal, do not block navigation.
      const nextToken = response.token ?? token;
      if (nextToken) {
        await Promise.allSettled([
          statsInitService.initStats(),
          macrosService.calculateMacros(formData, userId),
        ]);
      }
      onComplete(response);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error. Intentalo de nuevo.'
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
