import { UserIcon } from '@heroicons/react/24/solid';

import type { Sex } from '../../../core/domain/models/OnboardingFormData';

// `NON_BINARY` was previously absent from the onboarding picker even
// though the rest of the stack (Sex type, profile editor, backend Zod
// schema, `macros.service` with midpoint BMR offset) already supported
// it. A user that identifies as non-binary was forced to pick MALE /
// FEMALE just to clear the wizard, then re-edit later from profile.
// Adding it here closes the loop. Three columns from the start so the
// three options sit side-by-side instead of leaving NO BINARIO
// orphaned in a half-empty second row — matches the 3-column layout
// the StepTraining choices use for similar 3-option questions.
const sexOptions = [
  { value: 'MALE', label: 'HOMBRE', color: '#3b82f6' },
  { value: 'FEMALE', label: 'MUJER', color: '#ec4899' },
  { value: 'NON_BINARY', label: 'NO BINARIO', color: '#a855f7' },
] as const;

interface SexSelectorProps {
  value: Sex | undefined;
  error?: string;
  onChange: (value: Sex) => void;
}

export const SexSelector = (props: SexSelectorProps): React.JSX.Element => {
  return (
    <div>
      <label className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider">
        SEXO BIOLOGICO
      </label>
      <p className="font-pixel-mono text-base text-ink-faint mb-3 leading-tight">
        Necesario para el calculo metabolico, no define tu identidad.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {sexOptions.map((option) => {
          const isSelected = props.value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => props.onChange(option.value)}
              className={`relative px-1 py-4 sm:py-5 border-2 text-center font-pixel text-[8px] sm:text-[10px] leading-tight break-words transition-all duration-150 ${
                isSelected
                  ? 'bg-green-500/10 border-green-500/70 text-green-400 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                  : 'bg-subtle border-border text-ink-muted hover:border-[#3f3f46]'
              }`}
            >
              <UserIcon
                className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 sm:mb-2"
                style={{ color: isSelected ? '#4ade80' : option.color }}
              />
              {option.label}
            </button>
          );
        })}
      </div>
      {props.error && (
        <p className="font-pixel-mono text-base text-red-400 mt-2 tracking-wide leading-none">
          ✕ {props.error}
        </p>
      )}
    </div>
  );
};
