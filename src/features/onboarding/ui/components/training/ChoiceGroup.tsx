import type { OnboardingFormData } from '../../../core/domain/models/OnboardingFormData';

export type Choice = { value: string; label: string; sub?: string };

type SingleProps = {
  multi?: false;
  field: keyof OnboardingFormData;
  value: string | undefined;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
};

type MultiProps = {
  multi: true;
  field: keyof OnboardingFormData;
  value: string[] | undefined;
  onChange: (field: keyof OnboardingFormData, value: string[]) => void;
};

type ChoiceGroupProps = (SingleProps | MultiProps) & {
  label: string;
  choices: Choice[];
  error?: string;
  hint?: string;
};

export const ChoiceGroup = (props: ChoiceGroupProps): React.JSX.Element => {
  const isSelected = (value: string): boolean =>
    props.multi
      ? Array.isArray(props.value) && props.value.includes(value)
      : props.value === value;

  const handleClick = (value: string): void => {
    if (props.multi) {
      const current = props.value ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      props.onChange(props.field, next);
    } else {
      props.onChange(props.field, value);
    }
  };

  const gridColumns = 'grid-cols-3';

  return (
    // Mismas escalas tipográficas que los demás pasos del onboarding
    // (StepActivity / StepGoal usan SelectableCard con
    // `text-[9px] sm:text-[10px]` para el título y
    // `text-base sm:text-lg` para el subtítulo). El paso 5 había
    // crecido a md:/lg:text-xl y rompía la coherencia visual al
    // pasar de móvil a escritorio.
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted tracking-wider">
          {props.label}
        </label>
        {props.hint && (
          <span className="font-pixel-mono text-base text-ink-disabled leading-none">
            {props.hint}
          </span>
        )}
      </div>
      <div className={`grid gap-2 ${gridColumns}`}>
        {props.choices.map((c) => {
          const selected = isSelected(c.value);
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => handleClick(c.value)}
              aria-pressed={selected}
              className={`px-1.5 sm:px-2 py-3 border-2 text-center transition-all duration-150 min-h-[44px] ${
                selected
                  ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                  : 'bg-subtle border-border hover:border-[#3f3f46]'
              }`}
            >
              <div
                className={`font-pixel text-[8px] sm:text-[10px] tracking-wide leading-tight break-words ${selected ? 'text-green-400' : 'text-ink'}`}
              >
                {c.label}
              </div>
              {c.sub && (
                <div className="font-pixel-mono text-[11px] sm:text-base text-ink-faint mt-1 leading-tight break-words">
                  {c.sub}
                </div>
              )}
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
