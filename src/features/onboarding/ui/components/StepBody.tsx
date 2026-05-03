import type {
  OnboardingFormData,
  FormErrors,
  Sex,
} from '../../core/domain/models/OnboardingFormData';
import { NumericField } from './body/NumericField';
import { SexSelector } from './body/SexSelector';

interface StepBodyProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export const StepBody = (props: StepBodyProps): React.JSX.Element => {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU <span className="text-green-400">CUERPO</span>
      </h2>
      <p className="text-center font-['Press_Start_2P'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Para calcular tu metabolismo basal.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <NumericField
          id="weight"
          label="PESO (KG)"
          value={props.data.weight}
          placeholder="75"
          step="0.1"
          min="30"
          max="250"
          error={props.errors.weight}
          onChange={(v) => props.onChange('weight', v)}
        />
        <NumericField
          id="height"
          label="ALTURA (CM)"
          value={props.data.height}
          placeholder="175"
          step="1"
          min="120"
          max="230"
          error={props.errors.height}
          onChange={(v) => props.onChange('height', v)}
        />
      </div>

      <SexSelector
        value={props.data.sex}
        error={props.errors.sex}
        onChange={(v: Sex) => props.onChange('sex', v)}
      />
    </div>
  );
};
