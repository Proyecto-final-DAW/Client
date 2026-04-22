import type { SelectableOption } from '../../../core/domain/models/SelectableOption';

interface SelectableCardProps {
  option: SelectableOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export default function SelectableCard({
  option,
  isSelected,
  onSelect,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`relative w-full text-left px-4 py-3 border-2 transition-all duration-150 ${
        isSelected
          ? 'bg-green-500/10 border-green-500/70 shadow-[0_0_18px_rgba(34,197,94,0.25)]'
          : 'bg-[#12121a] border-[#1e1e2e] hover:border-[#3f3f46]'
      }`}
    >
      {isSelected && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/70" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/70" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/70" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/70" />
        </>
      )}
      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">{option.icon}</span>
        <div className="min-w-0 flex-1">
          <div
            className={`font-['Press_Start_2P'] text-[9px] sm:text-[10px] tracking-wider ${isSelected ? 'text-green-400' : 'text-[#e4e4e7]'}`}
          >
            {option.title}
          </div>
          <div className="font-['VT323'] text-sm sm:text-base text-[#a1a1aa] mt-1 tracking-wide leading-tight">
            {option.description}
          </div>
        </div>
        <div
          className={`shrink-0 flex h-5 w-5 items-center justify-center border-2 ${
            isSelected
              ? 'border-green-500 bg-green-500 text-[#0a0a0f]'
              : 'border-[#3f3f46] bg-[#0d0d14]'
          }`}
        >
          {isSelected && (
            <span className="font-['Press_Start_2P'] text-[9px] leading-none">
              ✓
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
