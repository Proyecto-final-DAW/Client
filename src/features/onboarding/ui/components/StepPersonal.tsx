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
  'w-full bg-[#12121a] border-2 px-3 py-2.5 font-["Press_Start_2P"] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none transition-colors [color-scheme:dark]';

export const StepPersonal = (props: StepPersonalProps): React.JSX.Element => {
  // The name was already captured during registration; asking again would
  // duplicate the prompt. The form state still carries `name` (pre-filled
  // from the auth user in OnboardingView) so the submit payload is unchanged.
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿CUÁNDO <span className="text-green-400">NACISTE?</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Calculamos tu edad para personalizar tus macros.
      </p>

      <div className="mb-2">
        <label
          htmlFor="birthDate"
          className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
        >
          FECHA DE NACIMIENTO
        </label>
        <input
          id="birthDate"
          type="date"
          value={props.data.birthDate}
          onChange={(e) => props.onChange('birthDate', e.target.value)}
          className={`${inputBase} ${props.errors.birthDate ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
        />
        {props.errors.birthDate && (
          <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
            ✕ {props.errors.birthDate}
          </p>
        )}
      </div>
    </div>
  );
};
