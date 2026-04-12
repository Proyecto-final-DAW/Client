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
    title: 'SEDENTARIO',
    description: 'Oficina o estudio, sin ejercicio regular.',
    icon: '🪑',
  },
  {
    value: 'light',
    title: 'LIGERAMENTE ACTIVO',
    description: 'Ejercicio ligero 1-3 días/semana (caminar, yoga).',
    icon: '🚶',
  },
  {
    value: 'moderate',
    title: 'MODERADAMENTE ACTIVO',
    description: 'Ejercicio moderado 3-5 días/semana (gimnasio, deporte).',
    icon: '🏃',
  },
  {
    value: 'active',
    title: 'ACTIVO',
    description: 'Ejercicio intenso 6-7 días por semana.',
    icon: '💪',
  },
  {
    value: 'very_active',
    title: 'MUY ACTIVO',
    description: 'Trabajo físico diario + ejercicio intenso.',
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
      <h2 className="font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU NIVEL DE <span className="text-green-400">ACTIVIDAD</span>
      </h2>
      <p className="font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-8 tracking-wide leading-tight">
        ¿Cómo es tu día a día? Calculamos cuántas calorías gastas.
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
