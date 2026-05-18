import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import { ChoiceGroup, type Choice } from './training/ChoiceGroup';

interface StepTrainingProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string | string[]) => void;
}

const experienceChoices: Choice[] = [
  { value: 'BEGINNER', label: 'NOVATO', sub: '< 6 meses' },
  { value: 'INTERMEDIATE', label: 'MEDIO', sub: '6m - 2 años' },
  { value: 'ADVANCED', label: 'VETER.', sub: '2+ años' },
];

const equipmentChoices: Choice[] = [
  { value: 'FULL_GYM', label: 'GIMNASIO', sub: 'Maq. y pesas' },
  { value: 'HOME_WEIGHTS', label: 'CASA', sub: 'Mancuernas' },
  { value: 'BODYWEIGHT', label: 'CORPORAL', sub: 'Sin material' },
];

const daysChoices: Choice[] = [
  { value: '2-3', label: '2-3' },
  { value: '4-5', label: '4-5' },
  { value: '6+', label: '6+' },
];

export const StepTraining = (props: StepTrainingProps): React.JSX.Element => {
  const handleSingle = (
    field: keyof OnboardingFormData,
    value: string
  ): void => {
    props.onChange(field, value);
  };

  const handleMulti = (
    field: keyof OnboardingFormData,
    value: string[]
  ): void => {
    props.onChange(field, value);
  };

  return (
    <div>
      {/* Title scales up on desktop — the mobile/sm sizes match the
          rest of the wizard, but on md+ the step 5 form reads as
          cramped (lots of vertical white-space around a tiny header)
          so we bump it gently. Mobile/sm intentionally unchanged. */}
      <h2 className="text-center font-pixel text-base sm:text-lg md:text-xl lg:text-2xl text-ink mb-3 md:mb-4 leading-tight tracking-wider [text-shadow:0_0_12px_rgba(34,197,94,0.35)]">
        TU <span className="text-green-400">ENTRENAMIENTO</span>
      </h2>
      <p className="text-center font-pixel-mono text-base md:text-lg lg:text-xl text-ink-muted mb-5 md:mb-7 leading-tight">
        Como, cuando y con que entrenas.
      </p>

      <ChoiceGroup
        label="EXPERIENCIA"
        field="experienceLevel"
        value={props.data.experienceLevel}
        choices={experienceChoices}
        error={props.errors.experienceLevel}
        onChange={handleSingle}
      />
      <ChoiceGroup
        multi
        label="EQUIPAMIENTO"
        hint="Puedes elegir varios"
        field="equipment"
        value={props.data.equipment}
        choices={equipmentChoices}
        error={props.errors.equipment}
        onChange={handleMulti}
      />
      <ChoiceGroup
        label="DIAS POR SEMANA"
        field="daysPerWeek"
        value={props.data.daysPerWeek}
        choices={daysChoices}
        error={props.errors.daysPerWeek}
        onChange={handleSingle}
      />
    </div>
  );
};
