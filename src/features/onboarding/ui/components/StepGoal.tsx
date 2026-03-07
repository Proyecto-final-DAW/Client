import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import SelectableCardGroup from './SelectableCardGroup';

interface StepGoalProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const goalOptions: SelectableOption[] = [
  {
    value: 'lose_fat',
    title: 'Perder grasa',
    description: 'Quiero bajar de peso y definir mi cuerpo',
    icon: '🔥',
  },
  {
    value: 'gain_muscle',
    title: 'Ganar músculo',
    description: 'Quiero ganar masa muscular y fuerza',
    icon: '💪',
  },
  {
    value: 'maintain',
    title: 'Mantenerse',
    description: 'Quiero mantener mi forma actual',
    icon: '⚖️',
  },
  {
    value: 'health',
    title: 'Mejorar salud',
    description: 'Quiero sentirme mejor y crear un hábito',
    icon: '❤️',
  },
];

export default function StepGoal({ data, errors, onChange }: StepGoalProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">
        ¿Cuál es tu objetivo?
      </h2>
      <p className="text-zinc-400 text-sm mb-8">
        Esto determina tu plan nutricional y de entrenamiento.
      </p>

      <SelectableCardGroup
        options={goalOptions}
        selected={data.goal ?? null}
        onSelect={(value) => onChange('goal', value)}
        error={errors.goal}
      />
    </div>
  );
}
