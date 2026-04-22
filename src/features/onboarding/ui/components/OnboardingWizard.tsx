import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

import type { OnboardingPort } from '../../core/application/ports/OnboardingPort';
import type { OnboardingResponse } from '../../core/domain/models/OnboardingResponse';
import { useOnboardingWizard } from '../hooks/useOnboardingWizard';
import StepActivity from './StepActivity';
import StepBody from './StepBody';
import StepGoal from './StepGoal';
import StepLimitations from './StepLimitations';
import Stepper from './Stepper';
import StepPersonal from './StepPersonal';
import StepTraining from './StepTraining';

interface OnboardingWizardProps {
  userId: number;
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
      case 5:
        return <StepTraining {...stepProps} />;
      case 6:
        return <StepLimitations {...stepProps} />;
      default:
        return null;
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#e4e4e7] overflow-hidden">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/5.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      {/* Frosted glass layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.68) 0%, rgba(5,5,9,0.75) 100%)',
        }}
      />

      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
        <div className="w-full max-w-xl">
          <div className="text-center mb-4 sm:mb-5">
            <h1 className="font-['Press_Start_2P'] text-base sm:text-xl md:text-2xl text-white leading-relaxed [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_22px_rgba(0,0,0,1)]">
              FORJA TU
              <span className="block text-green-400 mt-2 [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_30px_rgba(34,197,94,1),0_0_55px_rgba(34,197,94,0.55)]">
                LEYENDA
              </span>
            </h1>
          </div>

          <div className="relative border-2 border-green-500/60 bg-[#0d0d14] px-5 sm:px-7 pt-6 pb-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

            <Stepper currentStep={currentStep} totalSteps={totalSteps} />

            <div>{renderStep()}</div>

            {submitError && (
              <p
                role="alert"
                className="font-['VT323'] text-base sm:text-lg text-red-400 mt-4 leading-none tracking-wide border-2 border-red-500/40 bg-red-500/10 px-3 py-1"
              >
                ✕ {submitError}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] hover:text-green-400 border-2 border-[#1e1e2e] hover:border-green-500/50 px-4 py-3 transition-colors disabled:opacity-50"
                >
                  <ArrowLeftIcon className="h-3 w-3" />
                  ATRAS
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 disabled:bg-[#1e1e2e] disabled:text-[#52525b] text-[#0a0a0f] px-6 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 disabled:border-b-0 disabled:active:mt-0 shadow-[0_0_16px_rgba(34,197,94,0.35)] disabled:shadow-none"
              >
                {isSubmitting ? (
                  'GUARDANDO...'
                ) : currentStep === totalSteps ? (
                  <>
                    FINALIZAR
                    <CheckIcon className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    SIGUIENTE
                    <ArrowRightIcon className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
