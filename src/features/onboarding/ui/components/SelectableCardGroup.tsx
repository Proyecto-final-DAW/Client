import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import { SelectableCard } from './selectable/SelectableCard';

interface SelectableCardGroupProps {
  options: SelectableOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  error?: string;
}

export const SelectableCardGroup = (
  props: SelectableCardGroupProps
): React.JSX.Element => {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {props.options.map((option) => (
          <SelectableCard
            key={option.value}
            option={option}
            isSelected={props.selected === option.value}
            onSelect={props.onSelect}
          />
        ))}
      </div>
      {props.error && (
        <p className="font-['Press_Start_2P'] text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {props.error}
        </p>
      )}
    </div>
  );
};
