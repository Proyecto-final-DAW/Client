import { PixelDatePicker } from '@shared/components/PixelDatePicker';

import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';

interface StepPersonalProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export const StepPersonal = (props: StepPersonalProps): React.JSX.Element => {
  // Name was already captured during registration; the wizard does not
  // re-prompt. The form state still carries `name` (pre-filled in
  // OnboardingView) so the submit payload is unchanged.
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h2 className="text-center font-pixel text-base sm:text-lg text-ink mb-3 leading-tight tracking-wider [text-shadow:0_0_12px_rgba(34,197,94,0.35)]">
        ¿CUANDO <span className="text-green-400">NACISTE?</span>
      </h2>
      <p className="text-center font-pixel-mono text-base text-ink-muted mb-5 leading-tight">
        Calculamos tu edad para personalizar tus macros.
      </p>

      <div className="mb-2">
        <label
          htmlFor="birthDate"
          className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider"
        >
          FECHA DE NACIMIENTO
        </label>
        <PixelDatePicker
          id="birthDate"
          value={props.data.birthDate}
          onChange={(value) => props.onChange('birthDate', value)}
          min="1900-01-01"
          max={todayIso}
          error={Boolean(props.errors.birthDate)}
        />
        {props.errors.birthDate && (
          <p className="font-pixel-mono text-base text-red-400 mt-2 leading-snug">
            ✕ {props.errors.birthDate}
          </p>
        )}
      </div>
    </div>
  );
};
