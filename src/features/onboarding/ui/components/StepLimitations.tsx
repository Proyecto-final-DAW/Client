import type {
  OnboardingFormData,
  FormErrors,
  Injury,
} from '../../core/domain/models/OnboardingFormData';
import { InjuryCard, type InjuryOption } from './limitations/InjuryCard';

interface StepLimitationsProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string | string[]) => void;
}

const injuryOptions: InjuryOption[] = [
  {
    value: 'NONE',
    title: 'NINGUNA',
    description: 'Sin restricciones.',
    icon: '✅',
  },
  {
    value: 'KNEE',
    title: 'RODILLA',
    description: 'Sin impacto ni sentadillas profundas.',
    icon: '🦵',
  },
  {
    value: 'BACK',
    title: 'ESPALDA',
    description: 'Cuidamos carga axial.',
    icon: '🧍',
  },
  {
    value: 'SHOULDER',
    title: 'HOMBRO',
    description: 'Sin press vertical agresivo.',
    icon: '💪',
  },
  {
    value: 'OTHER',
    title: 'OTRA',
    description: 'La indicaras luego.',
    icon: '⚠️',
  },
];

export const StepLimitations = (
  props: StepLimitationsProps
): React.JSX.Element => {
  const selected = props.data.injuries ?? [];

  const toggle = (value: Injury) => {
    let next: Injury[];
    if (value === 'NONE') {
      next = selected.includes('NONE') ? [] : ['NONE'];
    } else if (selected.includes(value)) {
      next = selected.filter((v) => v !== value);
    } else {
      next = [...selected.filter((v) => v !== 'NONE'), value];
    }
    props.onChange('injuries', next);
  };

  return (
    <div>
      <h2 className="text-center font-pixel text-lg sm:text-xl text-ink mb-3 leading-relaxed tracking-wider [text-shadow:0_0_18px_rgba(34,197,94,0.35)]">
        ¿TIENES <span className="text-green-400">LIMITACIONES?</span>
      </h2>
      <p className="text-center font-pixel-mono text-lg sm:text-xl text-ink-muted mb-5 leading-tight">
        Puedes elegir una o mas.
      </p>

      {/* "Ninguna" lives on its own row as the headline default choice — also
          the natural pick for most users — so the remaining four specific
          injuries pair off cleanly in the 2-col grid below without a lone
          orphan card on the last row. */}
      <div className="flex flex-col gap-2">
        {injuryOptions[0] && (
          <InjuryCard
            key={injuryOptions[0].value}
            option={injuryOptions[0]}
            isSelected={selected.includes(injuryOptions[0].value)}
            onToggle={toggle}
          />
        )}
        <div className="grid grid-cols-2 gap-2">
          {injuryOptions.slice(1).map((option) => (
            <InjuryCard
              key={option.value}
              option={option}
              isSelected={selected.includes(option.value)}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
      {props.errors.injuries && (
        <p className="font-pixel text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {props.errors.injuries}
        </p>
      )}
    </div>
  );
};
