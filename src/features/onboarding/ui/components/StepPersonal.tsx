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

export default function StepPersonal({
  data,
  errors,
  onChange,
}: StepPersonalProps) {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿COMO TE <span className="text-green-400">LLAMAS?</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Empecemos por conocerte.
      </p>

      <div className="mb-6">
        <label
          htmlFor="name"
          className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
        >
          NOMBRE
        </label>
        <input
          id="name"
          type="text"
          placeholder="Tu nombre"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`${inputBase} ${errors.name ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
        />
        {errors.name && (
          <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
            ✕ {errors.name}
          </p>
        )}
      </div>

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
          value={data.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className={`${inputBase} ${errors.birthDate ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
        />
        {errors.birthDate && (
          <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
            ✕ {errors.birthDate}
          </p>
        )}
      </div>
    </div>
  );
}
