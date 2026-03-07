import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import SelectableCardGroup from './SelectableCardGroup';

interface StepActivityProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const activityOptions: SelectableOption[] = [
  {
    value: 'sedentary',
    title: 'Sedentario',
    description: 'Trabajo de oficina o estudio, sin ejercicio regular',
    icon: '🪑',
  },
  {
    value: 'light',
    title: 'Ligeramente activo',
    description: 'Ejercicio ligero 1-3 días por semana (caminar, yoga)',
    icon: '🚶',
  },
  {
    value: 'moderate',
    title: 'Moderadamente activo',
    description: 'Ejercicio moderado 3-5 días por semana (gimnasio, deporte)',
    icon: '🏃',
  },
  {
    value: 'active',
    title: 'Activo',
    description: 'Ejercicio intenso 6-7 días por semana',
    icon: '💪',
  },
  {
    value: 'very_active',
    title: 'Muy activo',
    description: 'Trabajo físico diario + ejercicio intenso',
    icon: '🔥',
  },
];

export default function StepActivity({
  data,
  errors,
  onChange,
}: StepActivityProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">
        Tu nivel de actividad
      </h2>
      <p className="text-zinc-400 text-sm mb-8">
        ¿Cómo es tu día a día? Esto nos ayuda a calcular cuántas calorías
        gastas.
      </p>

      <SelectableCardGroup
        options={activityOptions}
        selected={data.activityLevel ?? null}
        onSelect={(value) => onChange('activityLevel', value)}
        error={errors.activityLevel}
      />
    </div>
  );
}
