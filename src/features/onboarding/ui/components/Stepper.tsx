interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Personal', 'Cuerpo', 'Actividad', 'Objetivo'];

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-zinc-400">
          Paso {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-emerald-400 font-medium">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-bold transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-emerald-500 text-zinc-900'
                        : isActive
                          ? 'bg-zinc-800 text-emerald-400 ring-2 ring-emerald-500'
                          : 'bg-zinc-800 text-zinc-500'
                    }
                  `}
                >
                  {isCompleted ? '✓' : step}
                </div>
                <span
                  className={`
                    text-xs mt-2 transition-colors duration-300
                    ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isActive
                          ? 'text-zinc-200'
                          : 'text-zinc-600'
                    }
                  `}
                >
                  {stepLabels[i]}
                </span>
              </div>

              {step < totalSteps && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-700'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
