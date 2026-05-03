import type { Injury } from '../../../core/domain/models/OnboardingFormData';

export interface InjuryOption {
  value: Injury;
  title: string;
  description: string;
  icon: string;
}

interface InjuryCardProps {
  option: InjuryOption;
  isSelected: boolean;
  onToggle: (value: Injury) => void;
}

export const InjuryCard = (props: InjuryCardProps): React.JSX.Element => {
  return (
    <button
      type="button"
      onClick={() => props.onToggle(props.option.value)}
      className={`relative text-left px-3 py-3 border-2 transition-all duration-150 ${
        props.isSelected
          ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_14px_rgba(34,197,94,0.25)]'
          : 'bg-[#12121a] border-[#1e1e2e] hover:border-[#3f3f46]'
      }`}
    >
      {props.isSelected && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/70" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/70" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/70" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/70" />
        </>
      )}
      <div className="flex items-start gap-2">
        <span className="text-xl shrink-0">{props.option.icon}</span>
        <div className="min-w-0 flex-1">
          <div
            className={`font-['Press_Start_2P'] text-[8px] tracking-wider leading-tight ${props.isSelected ? 'text-green-400' : 'text-[#e4e4e7]'}`}
          >
            {props.option.title}
          </div>
          <div className="font-['Press_Start_2P'] text-sm text-[#a1a1aa] mt-1 tracking-wide leading-tight">
            {props.option.description}
          </div>
        </div>
      </div>
    </button>
  );
};
