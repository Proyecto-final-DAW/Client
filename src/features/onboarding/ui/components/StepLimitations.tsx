import type {
  OnboardingFormData,
  FormErrors,
  Injury,
} from '../../core/domain/models/OnboardingFormData';

interface StepLimitationsProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string | string[]) => void;
}

type InjuryOption = {
  value: Injury;
  title: string;
  description: string;
  icon: string;
};

const injuryOptions: InjuryOption[] = [
  {
    value: 'none',
    title: 'NINGUNA',
    description: 'Sin restricciones.',
    icon: '✅',
  },
  {
    value: 'knee',
    title: 'RODILLA',
    description: 'Sin impacto ni sentadillas profundas.',
    icon: '🦵',
  },
  {
    value: 'back',
    title: 'ESPALDA',
    description: 'Cuidamos carga axial.',
    icon: '🧍',
  },
  {
    value: 'shoulder',
    title: 'HOMBRO',
    description: 'Sin press vertical agresivo.',
    icon: '💪',
  },
  {
    value: 'other',
    title: 'OTRA',
    description: 'La indicarás luego.',
    icon: '⚠️',
  },
];

export default function StepLimitations({
  data,
  errors,
  onChange,
}: StepLimitationsProps) {
  const selected = data.injuries ?? [];

  const toggle = (value: Injury) => {
    let next: Injury[];
    if (value === 'none') {
      next = selected.includes('none') ? [] : ['none'];
    } else if (selected.includes(value)) {
      next = selected.filter((v) => v !== value);
    } else {
      next = [...selected.filter((v) => v !== 'none'), value];
    }
    onChange('injuries', next);
  };

  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿TIENES <span className="text-green-400">LIMITACIONES?</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Puedes elegir una o más.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {injuryOptions.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`relative text-left px-3 py-3 border-2 transition-all duration-150 ${
                isSelected
                  ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_14px_rgba(34,197,94,0.25)]'
                  : 'bg-[#12121a] border-[#1e1e2e] hover:border-[#3f3f46]'
              }`}
            >
              {isSelected && (
                <>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/70" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/70" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/70" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/70" />
                </>
              )}
              <div className="flex items-start gap-2">
                <span className="text-xl shrink-0">{option.icon}</span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-['Press_Start_2P'] text-[8px] tracking-wider leading-tight ${isSelected ? 'text-green-400' : 'text-[#e4e4e7]'}`}
                  >
                    {option.title}
                  </div>
                  <div className="font-['VT323'] text-sm text-[#a1a1aa] mt-1 tracking-wide leading-tight">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {errors.injuries && (
        <p className="font-['VT323'] text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {errors.injuries}
        </p>
      )}
    </div>
  );
}
