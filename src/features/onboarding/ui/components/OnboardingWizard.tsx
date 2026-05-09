import { AnimatePresence, motion } from 'framer-motion';

import type { OnboardingRepository } from '../../core/application/ports/OnboardingRepository';
import type { StatsInitRepository } from '../../core/application/ports/StatsInitRepository';
import type { OnboardingResponse } from '../../core/domain/models/OnboardingResponse';
import { useOnboardingWizard } from '../hooks/useOnboardingWizard';
import { StepActivity } from './StepActivity';
import { StepBody } from './StepBody';
import { StepGoal } from './StepGoal';
import { StepLimitations } from './StepLimitations';
import { Stepper } from './Stepper';
import { StepPersonal } from './StepPersonal';
import { StepPreview } from './StepPreview';
import { StepTraining } from './StepTraining';
import { WizardBackground } from './wizard/WizardBackground';
import { WizardFrame } from './wizard/WizardFrame';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardNavigation } from './wizard/WizardNavigation';
import { WizardSubmitError } from './wizard/WizardSubmitError';

interface OnboardingWizardProps {
  userId: number;
  token: string;
  initialName: string;
  onboardingService: OnboardingRepository;
  statsInitService: StatsInitRepository;
  onComplete: (response: OnboardingResponse) => void;
}

export const OnboardingWizard = (
  props: OnboardingWizardProps
): React.JSX.Element => {
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
      case 7:
        return <StepPreview data={formData} />;
      default:
        return null;
    }
  }

  return (
    <div className="relative min-h-screen bg-page text-ink overflow-hidden">
      <WizardBackground />
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
        <div className="w-full max-w-2xl">
          <WizardHeader showWelcome={currentStep === 1} />
          <WizardFrame>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} />
            <div className="relative overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  // Spring-based transition replaces the fixed-duration
                  // ease — slightly heavier slide (60 → 0) plus the
                  // spring's natural overshoot makes step changes feel
                  // alive instead of rubber-stamped, which the previous
                  // 300ms timed easing was missing on quick clicks.
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 26,
                    mass: 0.9,
                    opacity: { duration: 0.25 },
                  }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
            <WizardSubmitError error={submitError} />
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              isSubmitting={isSubmitting}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </WizardFrame>
        </div>
      </main>
    </div>
  );
};
