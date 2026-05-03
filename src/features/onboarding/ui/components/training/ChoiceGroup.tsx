import type { OnboardingFormData } from '../../../core/domain/models/OnboardingFormData';

export type Choice = { value: string; label: string; sub?: string };

interface ChoiceGroupProps {
  label: string;
  field: keyof OnboardingFormData;
  value: string | undefined;
  choices: Choice[];
  error?: string;
  cols?: number;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export const ChoiceGroup = (props: ChoiceGroupProps): React.JSX.Element => {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
        {props.label}
      </label>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${props.cols ?? 3}, minmax(0,1fr))`,
        }}
      >
        {props.choices.map((c) => {
          const selected = props.value === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => props.onChange(props.field, c.value)}
              className={`px-2 py-3 border-2 text-center transition-all duration-150 ${
                selected
                  ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                  : 'bg-[#12121a] border-[#1e1e2e] hover:border-[#3f3f46]'
              }`}
            >
              <div
                className={`font-['Press_Start_2P'] text-[8px] sm:text-[9px] tracking-wider ${selected ? 'text-green-400' : 'text-[#e4e4e7]'}`}
              >
                {c.label}
              </div>
              {c.sub && (
                <div className="font-['Press_Start_2P'] text-xs sm:text-sm text-[#71717a] mt-1 leading-none">
                  {c.sub}
                </div>
              )}
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
