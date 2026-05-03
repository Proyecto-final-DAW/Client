import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import { ChoiceGroup, type Choice } from './training/ChoiceGroup';

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
  { value: 'FULL_GYM', label: 'GIMNASIO', sub: 'Maquinas y pesas' },
  { value: 'HOME_WEIGHTS', label: 'CASA + PESAS', sub: 'Mancuernas / barras' },
  { value: 'BODYWEIGHT', label: 'PESO CORPORAL', sub: 'Sin material' },
];

const daysChoices: Choice[] = [
  { value: '2-3', label: '2-3' },
  { value: '4-5', label: '4-5' },
  { value: '6+', label: '6+' },
];

export const StepTraining = (props: StepTrainingProps): React.JSX.Element => {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU <span className="text-green-400">ENTRENAMIENTO</span>
      </h2>
      <p className="text-center font-['Press_Start_2P'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Como, cuando y con que entrenas.
      </p>

      <ChoiceGroup
        label="EXPERIENCIA"
        field="experienceLevel"
        value={props.data.experienceLevel}
        choices={experienceChoices}
        error={props.errors.experienceLevel}
        cols={3}
        onChange={props.onChange}
      />
      <ChoiceGroup
        label="EQUIPAMIENTO"
        field="equipment"
        value={props.data.equipment}
        choices={equipmentChoices}
        error={props.errors.equipment}
        cols={3}
        onChange={props.onChange}
      />
      <ChoiceGroup
        label="DIAS POR SEMANA"
        field="daysPerWeek"
        value={props.data.daysPerWeek}
        choices={daysChoices}
        error={props.errors.daysPerWeek}
        cols={3}
        onChange={props.onChange}
      />
    </div>
  );
};
