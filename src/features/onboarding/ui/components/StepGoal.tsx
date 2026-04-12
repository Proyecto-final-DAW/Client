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
    title: 'PERDER GRASA',
    description: 'Bajar de peso y definir el cuerpo.',
    icon: '🔥',
  },
  {
    value: 'gain_muscle',
    title: 'GANAR MUSCULO',
    description: 'Aumentar masa muscular y fuerza.',
    icon: '💪',
  },
  {
    value: 'maintain',
    title: 'MANTENERSE',
    description: 'Conservar la forma actual.',
    icon: '⚖️',
  },
  {
    value: 'health',
    title: 'MEJORAR SALUD',
    description: 'Sentirse mejor y crear un hábito.',
    icon: '❤️',
  },
];

export default function StepGoal({ data, errors, onChange }: StepGoalProps) {
  return (
    <div>
      <h2 className="font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿CUAL ES TU <span className="text-green-400">OBJETIVO?</span>
      </h2>
      <p className="font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-8 tracking-wide leading-tight">
        Determina tu plan nutricional y de entrenamiento.
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
