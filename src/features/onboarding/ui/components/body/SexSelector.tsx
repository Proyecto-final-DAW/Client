import { UserIcon } from '@heroicons/react/24/solid';

import type { Sex } from '../../../core/domain/models/OnboardingFormData';

const sexOptions = [
  { value: 'MALE', label: 'HOMBRE', color: '#3b82f6' },
  { value: 'FEMALE', label: 'MUJER', color: '#ec4899' },
] as const;

interface SexSelectorProps {
  value: Sex | undefined;
  error?: string;
  onChange: (value: Sex) => void;
}

export default function SexSelector({
  value,
  error,
  onChange,
}: SexSelectorProps) {
  return (
    <div>
      <label className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
        SEXO BIOLOGICO
      </label>
      <p className="font-['VT323'] text-sm text-[#71717a] mb-3 tracking-wide leading-tight">
        Necesario para el cálculo metabólico, no define tu identidad.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {sexOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
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
      {error && (
        <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
          ✕ {error}
        </p>
      )}
    </div>
  );
}
