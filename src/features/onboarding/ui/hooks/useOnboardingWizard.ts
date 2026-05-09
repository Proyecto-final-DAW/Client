import { useEffect, useState } from 'react';

import type { OnboardingRepository } from '../../core/application/ports/OnboardingRepository';
import type { StatsInitRepository } from '../../core/application/ports/StatsInitRepository';
import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import { INITIAL_FORM_DATA } from '../../core/domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../core/domain/models/OnboardingResponse';
import { validateStep } from '../../core/domain/validators/OnboardingValidator';

/**
 * Total wizard steps. Steps 1..6 are forms (validated). Step 7 is the
 * preview/confirm screen — no validation, pressing SIGUIENTE there
 * triggers submit instead of advancing.
 */
const TOTAL_STEPS = 7;
const PREVIEW_STEP = 7;

const STORAGE_KEY = 'onboarding_wizard_progress_v1';

interface PersistedProgress {
  data: OnboardingFormData;
  step: number;
}

/**
 * Loads wizard state from localStorage if a partial run exists. Returns
 * null when the stored payload is malformed — failing closed avoids
 * boot-time crashes from corrupted storage.
 */
function loadPersistedProgress(): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    if (
      !parsed ||
      typeof parsed.step !== 'number' ||
      !parsed.data ||
      typeof parsed.data !== 'object'
    ) {
      return null;
    }
    return {
      step: Math.max(1, Math.min(TOTAL_STEPS, parsed.step)),
      data: { ...INITIAL_FORM_DATA, ...parsed.data },
    };
  } catch {
    return null;
  }
}

interface UseOnboardingWizardProps {
  userId: number;
  token: string;
  initialName: string;
  onboardingService: OnboardingRepository;
  statsInitService: StatsInitRepository;
  onComplete: (response: OnboardingResponse) => void;
}

export function useOnboardingWizard({
  userId,
  token,
  initialName,
  onboardingService,
  statsInitService,
  onComplete,
}: UseOnboardingWizardProps) {
  // Both states use lazy initialisers so `loadPersistedProgress()`
  // (which parses localStorage) only runs once on mount instead of
  // every render. Without the lazy form, React still throws away the
  // computed value after the first render but still calls the function
  // — wasted JSON.parse on every keystroke in the wizard.
  const [currentStep, setCurrentStep] = useState(
    () => loadPersistedProgress()?.step ?? 1
  );
  const [formData, setFormData] = useState<OnboardingFormData>(() => ({
    ...INITIAL_FORM_DATA,
    ...(loadPersistedProgress()?.data ?? {}),
    // The auth user's name always wins — even if persisted storage held
    // a stale value from a different account on the same browser.
    name: initialName,
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Persist progress on every change so a reload / closed tab doesn't
  // wipe what the user already filled in.
  useEffect(() => {
    try {
      const payload: PersistedProgress = { data: formData, step: currentStep };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage quota / private mode → silent: persistence is a nice-to-have.
    }
  }, [formData, currentStep]);

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
    // The preview step (last one) has no fields to validate — pressing
    // "SIGUIENTE" there is the confirm action, not a step advance.
    if (currentStep === PREVIEW_STEP) {
      await handleSubmit();
      return;
    }

    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

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
      // Stats row needs to exist before the user lands on /dashboard
      // (cards / streak queries assume it's there). Macros are *already*
      // persisted server-side by `submitOnboarding` itself — calling
      // `macrosService.calculateMacros` here was a redundant second
      // write of the same data, and `Promise.allSettled` swallowed any
      // failure silently. Now we only init stats and surface its error.
      const nextToken = response.token ?? token;
      if (nextToken) {
        await statsInitService.initStats();
      }
      // Successful onboarding: clear the persisted draft so the user
      // doesn't see stale answers on a future fresh registration.
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore — storage cleanup is best-effort.
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
