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

export const SexSelector = (props: SexSelectorProps): React.JSX.Element => {
  return (
    <div>
      <label className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
        SEXO BIOLOGICO
      </label>
      <p className="font-['Press_Start_2P'] text-sm text-[#71717a] mb-3 tracking-wide leading-tight">
        Necesario para el calculo metabolico, no define tu identidad.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {sexOptions.map((option) => {
          const isSelected = props.value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => props.onChange(option.value)}
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
      {props.error && (
        <p className="font-['Press_Start_2P'] text-base text-red-400 mt-2 tracking-wide leading-none">
          ✕ {props.error}
        </p>
      )}
    </div>
  );
};
