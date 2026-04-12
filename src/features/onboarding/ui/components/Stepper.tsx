import { CheckIcon } from '@heroicons/react/24/solid';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['PERSONAL', 'CUERPO', 'ACTIVIDAD', 'OBJETIVO'];

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] tracking-wider">
          PASO {currentStep}/{totalSteps}
        </span>
        <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-green-400 tracking-wider">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>

      <div className="flex items-start gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative flex h-9 w-9 items-center justify-center border-2
                    font-['Press_Start_2P'] text-[10px] transition-colors duration-200
                    ${
                      isCompleted
                        ? 'bg-green-500 border-green-700 text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.45)]'
                        : isActive
                          ? 'bg-[#12121a] border-green-500 text-green-400 shadow-[0_0_16px_rgba(34,197,94,0.45)]'
                          : 'bg-[#12121a] border-[#1e1e2e] text-[#52525b]'
                    }
                  `}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4" /> : step}
                </div>
                <span
                  className={`
                    font-['Press_Start_2P'] text-[7px] sm:text-[8px] mt-2 tracking-wider text-center
                    ${
                      isCompleted
                        ? 'text-green-400'
                        : isActive
                          ? 'text-[#e4e4e7]'
                          : 'text-[#52525b]'
                    }
                  `}
                >
                  {stepLabels[i]}
                </span>
              </div>

              {step < totalSteps && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 mt-4 transition-colors duration-200
                    ${isCompleted ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-[#1e1e2e]'}
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
