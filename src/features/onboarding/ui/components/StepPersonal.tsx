import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';

interface StepPersonalProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const inputBase =
  'w-full bg-subtle border-2 px-3 py-2.5 font-["Press_Start_2P"] text-[9px] sm:text-[10px] text-ink placeholder:text-ink-disabled focus:outline-none transition-colors [color-scheme:dark]';

export const StepPersonal = (props: StepPersonalProps): React.JSX.Element => {
  // The name was already captured during registration; asking again would
  // duplicate the prompt. The form state still carries `name` (pre-filled
  // from the auth user in OnboardingView) so the submit payload is unchanged.
  return (
    <div>
      <h2 className="text-center font-pixel text-lg sm:text-xl text-ink mb-3 leading-relaxed tracking-wider [text-shadow:0_0_18px_rgba(34,197,94,0.35)]">
        ¿CUANDO <span className="text-green-400">NACISTE?</span>
      </h2>
      <p className="text-center font-pixel-mono text-lg sm:text-xl text-ink-muted mb-5 leading-tight">
        Calculamos tu edad para personalizar tus macros.
      </p>

      <div className="mb-2">
        <label
          htmlFor="birthDate"
          className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider"
        >
          FECHA DE NACIMIENTO
        </label>
        <input
          id="birthDate"
          type="date"
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
          value={props.data.birthDate}
          onChange={(e) => props.onChange('birthDate', e.target.value)}
          className={`${inputBase} ${props.errors.birthDate ? 'border-red-500/70 focus:border-red-400' : 'border-border focus:border-green-500/70'}`}
        />
        {props.errors.birthDate && (
          <p className="font-pixel text-base text-red-400 mt-2 tracking-wide leading-none">
            ✕ {props.errors.birthDate}
          </p>
        )}
      </div>
    </div>
  );
};
