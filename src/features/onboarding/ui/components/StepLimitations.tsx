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
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿TIENES <span className="text-green-400">LIMITACIONES?</span>
      </h2>
      <p className="text-center font-['Press_Start_2P'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Puedes elegir una o mas.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {injuryOptions.map((option) => (
          <InjuryCard
            key={option.value}
            option={option}
            isSelected={selected.includes(option.value)}
            onToggle={toggle}
          />
        ))}
      </div>
      {props.errors.injuries && (
        <p className="font-['Press_Start_2P'] text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {props.errors.injuries}
        </p>
      )}
    </div>
  );
};
