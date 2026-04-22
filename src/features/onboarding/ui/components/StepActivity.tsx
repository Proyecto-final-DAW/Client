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
    value: 'SEDENTARY',
    title: 'SEDENTARIO',
    description: 'Sin ejercicio regular.',
    icon: '🪑',
  },
  {
    value: 'LIGHT',
    title: 'LIGERAMENTE ACTIVO',
    description: 'Ejercicio 1-3 días por semana.',
    icon: '🚶',
  },
  {
    value: 'ACTIVE',
    title: 'ACTIVO',
    description: 'Ejercicio 3-5 días por semana.',
    icon: '💪',
  },
  {
    value: 'VERY_ACTIVE',
    title: 'MUY ACTIVO',
    description: 'Ejercicio 6-7 días por semana y trabajo físico diario.',
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
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU NIVEL DE <span className="text-green-400">ACTIVIDAD</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        ¿Cómo es tu día a día?
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
