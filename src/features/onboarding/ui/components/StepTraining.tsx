import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import ChoiceGroup, { type Choice } from './training/ChoiceGroup';

interface StepTrainingProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const experienceChoices: Choice[] = [
  { value: 'BEGINNER', label: 'NOVATO', sub: '< 6 meses' },
  { value: 'INTERMEDIATE', label: 'INTERMEDIO', sub: '6m - 2 años' },
  { value: 'ADVANCED', label: 'VETERANO', sub: '2+ años' },
];

const equipmentChoices: Choice[] = [
  { value: 'FULL_GYM', label: 'GIMNASIO', sub: 'Máquinas y pesas' },
  { value: 'HOME_WEIGHTS', label: 'CASA + PESAS', sub: 'Mancuernas / barras' },
  { value: 'BODYWEIGHT', label: 'PESO CORPORAL', sub: 'Sin material' },
];

const daysChoices: Choice[] = [
  { value: '2-3', label: '2-3' },
  { value: '4-5', label: '4-5' },
  { value: '6+', label: '6+' },
];

export default function StepTraining({
  data,
  errors,
  onChange,
}: StepTrainingProps) {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU <span className="text-green-400">ENTRENAMIENTO</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Cómo, cuándo y con qué entrenas.
      </p>

      <ChoiceGroup
        label="EXPERIENCIA"
        field="experienceLevel"
        value={data.experienceLevel}
        choices={experienceChoices}
        error={errors.experienceLevel}
        cols={3}
        onChange={onChange}
      />
      <ChoiceGroup
        label="EQUIPAMIENTO"
        field="equipment"
        value={data.equipment}
        choices={equipmentChoices}
        error={errors.equipment}
        cols={3}
        onChange={onChange}
      />
      <ChoiceGroup
        label="DIAS POR SEMANA"
        field="daysPerWeek"
        value={data.daysPerWeek}
        choices={daysChoices}
        error={errors.daysPerWeek}
        cols={3}
        onChange={onChange}
      />
    </div>
  );
}
