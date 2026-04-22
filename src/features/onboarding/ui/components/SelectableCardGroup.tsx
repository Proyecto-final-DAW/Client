import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import SelectableCard from './selectable/SelectableCard';

interface SelectableCardGroupProps {
  options: SelectableOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  error?: string;
}

export default function SelectableCardGroup({
  options,
  selected,
  onSelect,
  error,
}: SelectableCardGroupProps) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <SelectableCard
            key={option.value}
            option={option}
            isSelected={selected === option.value}
            onSelect={onSelect}
          />
        ))}
      </div>
      {error && (
        <p className="font-['VT323'] text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {error}
        </p>
      )}
    </div>
  );
}
