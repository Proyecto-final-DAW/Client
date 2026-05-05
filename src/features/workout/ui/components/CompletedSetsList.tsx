import type { WorkoutSet } from '../../core/domain/models/WorkoutSet';

type Props = {
  sets: WorkoutSet[];
  onUndoLast?: () => void;
};

export const CompletedSetsList = (props: Props): React.JSX.Element | null => {
  if (props.sets.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="font-pixel text-[8px] tracking-widest text-ink-muted">
          SETS COMPLETADOS
        </p>
        {props.onUndoLast && (
          <button
            type="button"
            onClick={props.onUndoLast}
            className="font-pixel text-[8px] tracking-widest text-ink-faint hover:text-red-400 transition-colors"
          >
            ↶ DESHACER ULTIMO
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-1">
        {props.sets.map((set, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-2 border-border bg-card px-3 py-2"
          >
            <span className="font-pixel text-base text-ink-faint">
              Set {index + 1}
            </span>
            <span className="font-pixel text-[10px] text-green-400">
              {set.weight} KG × {set.reps}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
