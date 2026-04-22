import type {
  OnboardingFormData,
  FormErrors,
  Sex,
} from '../../core/domain/models/OnboardingFormData';
import NumericField from './body/NumericField';
import SexSelector from './body/SexSelector';

interface StepBodyProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export default function StepBody({ data, errors, onChange }: StepBodyProps) {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        TU <span className="text-green-400">CUERPO</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Para calcular tu metabolismo basal.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <NumericField
          id="weight"
          label="PESO (KG)"
          value={data.weight}
          placeholder="75"
          step="0.1"
          min="30"
          max="250"
          error={errors.weight}
          onChange={(v) => onChange('weight', v)}
        />
        <NumericField
          id="height"
          label="ALTURA (CM)"
          value={data.height}
          placeholder="175"
          step="1"
          min="120"
          max="230"
          error={errors.height}
          onChange={(v) => onChange('height', v)}
        />
      </div>

      <SexSelector
        value={data.sex}
        error={errors.sex}
        onChange={(v: Sex) => onChange('sex', v)}
      />
    </div>
  );
}
