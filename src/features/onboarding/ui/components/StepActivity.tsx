import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import { SelectableCardGroup } from './SelectableCardGroup';

interface StepActivityProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const activityOptions: SelectableOption[] = [
  {
    value: 'SEDENTARY',
    title: 'SEDENTARIO',
    description: 'Sin ejercicio regular.',
    icon: '🪑',
  },
  {
    value: 'LIGHT',
    title: 'LIGERAMENTE ACTIVO',
    description: 'Ejercicio 1-3 dias por semana.',
    icon: '🚶',
  },
  {
    value: 'MODERATE',
    title: 'MODERADAMENTE ACTIVO',
    description: 'Ejercicio 3-5 dias por semana.',
    icon: '🏃',
  },
  {
    value: 'ACTIVE',
    title: 'MUY ACTIVO',
    description: 'Ejercicio intenso 5-6 dias por semana.',
    icon: '💪',
  },
  {
    value: 'VERY_ACTIVE',
    title: 'MUY ACTIVO',
    description: 'Ejercicio 6-7 dias por semana y trabajo fisico diario.',
    icon: '🔥',
  },
];

export const StepActivity = (props: StepActivityProps): React.JSX.Element => {
  return (
    <div>
      <h2 className="text-center font-pixel text-lg sm:text-xl text-ink mb-3 leading-relaxed tracking-wider [text-shadow:0_0_18px_rgba(34,197,94,0.35)]">
        TU NIVEL DE <span className="text-green-400">ACTIVIDAD</span>
      </h2>
      <p className="text-center font-pixel-mono text-lg sm:text-xl text-ink-muted mb-5 leading-tight">
        ¿Como es tu dia a dia?
      </p>

      <SelectableCardGroup
        options={activityOptions}
        selected={props.data.activityLevel ?? null}
        onSelect={(value) => props.onChange('activityLevel', value)}
        error={props.errors.activityLevel}
      />
    </div>
  );
};
