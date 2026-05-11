import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  /**
   * Called when the user confirms the "leave the wizard" exit. The
   * parent typically logs out + navigates home so the user is no
   * longer trapped behind the onboarding gate.
   */
  onExit?: () => void;
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

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Track navigation direction so the slide direction follows the
  // user's intent: SIGUIENTE pushes the new card in from the right
  // (it's "ahead"), VOLVER pulls it in from the left ("behind"). The
  // earlier always-from-right animation made hitting VOLVER feel like
  // a forward step, which fought the user's mental model.
  const prevStepRef = useRef(currentStep);
  const direction = currentStep >= prevStepRef.current ? 1 : -1;
  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  // Memo so the inner Step components don't see a fresh `stepProps`
  // identity on every wizard render (errors mutate per keystroke,
  // but the object pointer didn't need to change for the same data).
  const stepProps = useMemo(
    () => ({ data: formData, errors, onChange: handleChange }),
    [formData, errors, handleChange]
  );

  // Step-transition variants. Transform + opacity only — those are
  // the two properties browsers can animate on the compositor without
  // triggering layout or paint, so the card glides at 60 fps even on
  // a budget phone. The earlier version stacked `filter: blur(...)`
  // and `rotate` on top of three competing springs; blur in
  // particular forces a per-frame full-card rasterisation and was the
  // single biggest cause of the "low-fps" feel.
  //
  // Curve: a snappy cubic-bezier (close to Apple's "swift out") that
  // accelerates immediately and settles cleanly — the right "polished"
  // feel for a stepper that should respect the user's click without
  // dragging or wobbling. No springs, no overshoot.
  const stepVariants = useMemo(
    () => ({
      enter: (dir: number) => ({
        opacity: 0,
        x: dir * 48,
        scale: 0.97,
      }),
      center: {
        opacity: 1,
        x: 0,
        scale: 1,
      },
      exit: (dir: number) => ({
        opacity: 0,
        x: dir * -48,
        scale: 0.97,
      }),
    }),
    []
  );

  function renderStep() {
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
      {props.onExit && (
        <button
          type="button"
          onClick={() => setExitDialogOpen(true)}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 font-pixel text-[8px] sm:text-[9px] tracking-widest border-2 border-border-muted bg-card text-ink-muted hover:border-red-500/50 hover:text-red-300 px-3 py-2 transition-colors"
        >
          ✕ SALIR
        </button>
      )}
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
        <div className="w-full max-w-2xl">
          <WizardHeader showWelcome={currentStep === 1} />
          <WizardFrame>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} />
            <div className="relative overflow-hidden">
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={prefersReducedMotion ? undefined : stepVariants}
                  initial={prefersReducedMotion ? false : 'enter'}
                  animate={prefersReducedMotion ? undefined : 'center'}
                  exit={prefersReducedMotion ? undefined : 'exit'}
                  // willChange opts the layer in for compositor-thread
                  // rendering up-front; without it Chrome promotes the
                  // layer mid-animation, which costs a frame on the
                  // first transition and reads as a "drop".
                  style={{ willChange: 'transform, opacity' }}
                  // Single tween for every property so they finish in
                  // lockstep — no competing springs ringing on
                  // different timelines. Cubic-bezier (0.32, 0.72, 0, 1)
                  // is a snappy ease-out that lands the card crisply.
                  transition={{
                    duration: 0.32,
                    ease: [0.32, 0.72, 0, 1],
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

      <ConfirmDialog
        open={exitDialogOpen}
        title="¿SALIR DE LA CONFIGURACION?"
        description="Tu progreso de la configuracion inicial no se guardara. Tendras que volver a empezar la proxima vez."
        confirmLabel="SALIR Y CERRAR SESION"
        cancelLabel="VOLVER"
        variant="danger"
        onConfirm={() => {
          setExitDialogOpen(false);
          props.onExit?.();
        }}
        onCancel={() => setExitDialogOpen(false)}
      />
    </div>
  );
};
