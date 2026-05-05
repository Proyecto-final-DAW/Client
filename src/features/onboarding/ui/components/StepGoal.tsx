import type {
  OnboardingFormData,
  FormErrors,
  Goal,
} from '../../core/domain/models/OnboardingFormData';

interface StepGoalProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string | string[]) => void;
}

type GoalOption = {
  value: Goal;
  title: string;
  description: string;
  icon: string;
};

const goalOptions: GoalOption[] = [
  {
    value: 'LOSE_FAT',
    title: 'PERDER GRASA',
    description: 'Bajar de peso y definir el cuerpo.',
    icon: '🔥',
  },
  {
    value: 'GAIN_MUSCLE',
    title: 'GANAR MUSCULO',
    description: 'Aumentar masa muscular y fuerza.',
    icon: '💪',
  },
  {
    value: 'MAINTAIN',
    title: 'MANTENERSE',
    description: 'Conservar la forma actual.',
    icon: '⚖️',
  },
  {
    value: 'HEALTH',
    title: 'MEJORAR SALUD',
    description: 'Sentirse mejor y crear un habito.',
    icon: '❤️',
  },
];

export const StepGoal = (props: StepGoalProps): React.JSX.Element => {
  const selected = props.data.goals ?? [];

  const toggle = (value: Goal) => {
    const next = selected.includes(value)
      ? selected.filter((g) => g !== value)
      : [...selected, value];
    props.onChange('goals', next);
  };

  return (
    <div>
      <h2 className="text-center font-pixel text-lg sm:text-xl text-ink mb-3 leading-relaxed tracking-wider [text-shadow:0_0_18px_rgba(34,197,94,0.35)]">
        ¿CUAL ES TU <span className="text-green-400">OBJETIVO?</span>
      </h2>
      <p className="text-center font-pixel-mono text-lg sm:text-xl text-ink-muted mb-5 leading-tight">
        Puedes elegir uno o mas.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {goalOptions.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`relative text-left px-3 py-3 border-2 transition-all duration-150 ${
                isSelected
                  ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_14px_rgba(34,197,94,0.25)]'
                  : 'bg-subtle border-border hover:border-[#3f3f46]'
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
                    className={`font-pixel text-[8px] tracking-wider leading-tight ${isSelected ? 'text-green-400' : 'text-ink'}`}
                  >
                    {option.title}
                  </div>
                  <div className="font-pixel-mono text-base text-ink-muted mt-1 leading-tight">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {props.errors.goals && (
        <p className="font-pixel text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {props.errors.goals}
        </p>
      )}
    </div>
  );
};
