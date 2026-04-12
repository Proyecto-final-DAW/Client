import { CheckIcon } from '@heroicons/react/24/solid';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'PERSONAL',
  'CUERPO',
  'ACTIVIDAD',
  'OBJETIVO',
  'PLAN',
  'LIMITES',
];

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] tracking-wider">
          PASO {currentStep}/{totalSteps}
        </span>
        <span className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-green-400 tracking-wider">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>

      <div className="flex items-start">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const prevCompleted = step - 1 < currentStep;
          const nextCompleted = step < currentStep;

          return (
            <div
              key={step}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <div className="flex items-center w-full">
                <div
                  className={`flex-1 h-0.5 transition-colors ${
                    i === 0
                      ? 'bg-transparent'
                      : prevCompleted
                        ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                        : 'bg-[#1e1e2e]'
                  }`}
                />
                <div
                  className={`shrink-0 flex h-8 w-8 items-center justify-center border-2 font-['Press_Start_2P'] text-[10px] leading-none ${
                    isCompleted
                      ? 'bg-green-500 border-green-700 text-[#0a0a0f] shadow-[0_0_12px_rgba(34,197,94,0.45)]'
                      : isActive
                        ? 'bg-[#12121a] border-green-500 text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.45)]'
                        : 'bg-[#12121a] border-[#1e1e2e] text-[#52525b]'
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4" /> : step}
                </div>
                <div
                  className={`flex-1 h-0.5 transition-colors ${
                    i === totalSteps - 1
                      ? 'bg-transparent'
                      : nextCompleted
                        ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                        : 'bg-[#1e1e2e]'
                  }`}
                />
              </div>
              <span
                className={`font-['Press_Start_2P'] text-[6px] sm:text-[7px] mt-2 tracking-wider text-center leading-tight ${
                  isCompleted
                    ? 'text-green-400'
                    : isActive
                      ? 'text-[#e4e4e7]'
                      : 'text-[#52525b]'
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
