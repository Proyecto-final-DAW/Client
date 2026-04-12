import { UserIcon } from '@heroicons/react/24/solid';

import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';

interface StepBodyProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const sexOptions = [
  { value: 'male', label: 'HOMBRE', color: '#3b82f6' },
  { value: 'female', label: 'MUJER', color: '#ec4899' },
] as const;

const inputBase =
  'w-full bg-[#12121a] border-2 px-3 py-2.5 font-["Press_Start_2P"] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

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
        <div>
          <label
            htmlFor="weight"
            className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
          >
            PESO (KG)
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="30"
            max="250"
            placeholder="75"
            value={data.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            className={`${inputBase} ${errors.weight ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
          />
          {errors.weight && (
            <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
              ✕ {errors.weight}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="height"
            className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
          >
            ALTURA (CM)
          </label>
          <input
            id="height"
            type="number"
            step="1"
            min="120"
            max="230"
            placeholder="175"
            value={data.height}
            onChange={(e) => onChange('height', e.target.value)}
            className={`${inputBase} ${errors.height ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
          />
          {errors.height && (
            <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
              ✕ {errors.height}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
          SEXO BIOLOGICO
        </label>
        <p className="font-['VT323'] text-sm text-[#71717a] mb-3 tracking-wide leading-tight">
          Necesario para el cálculo metabólico, no define tu identidad.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {sexOptions.map((option) => {
            const isSelected = data.sex === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('sex', option.value)}
                className={`relative py-5 border-2 text-center font-['Press_Start_2P'] text-[10px] transition-all duration-150 ${
                  isSelected
                    ? 'bg-green-500/10 border-green-500/70 text-green-400 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                    : 'bg-[#12121a] border-[#1e1e2e] text-[#a1a1aa] hover:border-[#3f3f46]'
                }`}
              >
                <UserIcon
                  className="h-6 w-6 mx-auto mb-2"
                  style={{ color: isSelected ? '#4ade80' : option.color }}
                />
                {option.label}
              </button>
            );
          })}
        </div>
        {errors.sex && (
          <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
            ✕ {errors.sex}
          </p>
        )}
      </div>
    </div>
  );
}
