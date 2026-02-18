import { useState } from "react";
import type { OnboardingFormData, FormErrors} from "../../core/domain/models/OnboardingFormData";
import {INITIAL_FORM_DATA } from "../../core/domain/models/OnboardingFormData";
import type{ OnboardingResponse } from "../../core/domain/models/OnboardingResponse";
import { validateStep } from "../../core/domain/validators/OnboardingValidator";
import type{ OnboardingPort } from "../../core/application/ports/OnboardingPort";

import Stepper from "./Stepper";
import StepPersonal from "./StepPersonal";
import StepBody from "./StepBody";
import StepActivity from "./StepActivity";
import StepGoal from "./StepGoal";

const TOTAL_STEPS = 4;

interface OnboardingWizardProps {
   token: string;
   onboardingService: OnboardingPort;
   onComplete: (userData: OnboardingResponse["user"]) => void;
}

export default function OnboardingWizard({ token, onboardingService, onComplete }: OnboardingWizardProps) {
   const [currentStep, setCurrentStep] = useState(1);
   const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
   const [errors, setErrors] = useState<FormErrors>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);

   function handleChange(field: keyof OnboardingFormData, value: string) {
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
         const response = await onboardingService.submitOnboarding(formData, token);
         onComplete(response.user);
      } catch (error) {
         setSubmitError(error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo de nuevo.");
      } finally {
         setIsSubmitting(false);
      }
   }

   function renderStep() {
      const stepProps = { data: formData, errors, onChange: handleChange };
      switch (currentStep) {
         case 1: return <StepPersonal {...stepProps} />;
         case 2: return <StepBody {...stepProps} />;
         case 3: return <StepActivity {...stepProps} />;
         case 4: return <StepGoal {...stepProps} />;
         default: return null;
      }
   }

   return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
         <div className="w-full max-w-lg">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-extrabold text-emerald-400">GymQuest</h1>
               <p className="text-zinc-500 text-sm mt-1">Configura tu perfil para personalizar tu experiencia</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
               <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

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
                        className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
                     >
                        ← Anterior
                     </button>
                  )}
                  <button
                     type="button"
                     onClick={handleNext}
                     disabled={isSubmitting}
                     className="flex-1 py-3 rounded-xl font-semibold transition-all bg-emerald-500 text-zinc-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSubmitting ? "Guardando..." : currentStep === TOTAL_STEPS ? "Finalizar ✓" : "Siguiente →"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}