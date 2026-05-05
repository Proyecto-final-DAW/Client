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
      <h2 className="text-center font-pixel text-lg sm:text-xl text-ink mb-3 leading-relaxed tracking-wider [text-shadow:0_0_18px_rgba(34,197,94,0.35)]">
        TU <span className="text-green-400">CUERPO</span>
      </h2>
      <p className="text-center font-pixel-mono text-lg sm:text-xl text-ink-muted mb-5 leading-tight">
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
