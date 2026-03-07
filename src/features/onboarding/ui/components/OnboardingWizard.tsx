import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

import type { OnboardingPort } from '../../core/application/ports/OnboardingPort';
import type { OnboardingResponse } from '../../core/domain/models/OnboardingResponse';
import { useOnboardingWizard } from '../hooks/useOnboardingWizard';
import StepActivity from './StepActivity';
import StepBody from './StepBody';
import StepGoal from './StepGoal';
import Stepper from './Stepper';
import StepPersonal from './StepPersonal';

interface OnboardingWizardProps {
  token: string;
  onboardingService: OnboardingPort;
  onComplete: (userData: OnboardingResponse['user']) => void;
}

export default function OnboardingWizard(props: OnboardingWizardProps) {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitError,
    totalSteps,
    handleChange,
    handleNext,
    handlePrev,
  } = useOnboardingWizard(props);

  function renderStep() {
    const stepProps = { data: formData, errors, onChange: handleChange };
    switch (currentStep) {
      case 1:
        return <StepPersonal {...stepProps} />;
      case 2:
        return <StepBody {...stepProps} />;
      case 3:
        return <StepActivity {...stepProps} />;
      case 4:
        return <StepGoal {...stepProps} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-400">GymQuest</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configura tu perfil para personalizar tu experiencia
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />

          <div className="min-h-[300px]">{renderStep()}</div>

          {submitError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Anterior
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all bg-emerald-500 text-zinc-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Guardando...'
              ) : currentStep === totalSteps ? (
                <>
                  Finalizar
                  <CheckIcon className="w-4 h-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
