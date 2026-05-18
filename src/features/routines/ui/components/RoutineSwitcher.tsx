import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

import type { Routine } from '../../core/domain/models/Routine';
import { formatRoutineName } from '../formatRoutineName';

type Props = {
  routines: Routine[];
  selectedRoutineId: string;
  doneThisWeekIds: ReadonlySet<string>;
  onSelect: (routineId: string) => void;
  onCreateNew: () => void;
};

/**
 * Compact horizontal pill bar that lets the user switch between routines
 * without leaving the page. Replaces the previous half-of-the-screen list,
 * keeping the focus on the routine the user is actually about to do.
 */
export const RoutineSwitcher = ({
  routines,
  selectedRoutineId,
  doneThisWeekIds,
  onSelect,
  onCreateNew,
}: Props): React.JSX.Element => {
  return (
    // Wrap freely at every width. The previous mobile treatment was a
    // `flex-nowrap overflow-x-auto` strip — but on a phone the second
    // tab ("Dia 2") sat half-clipped at the edge with only a hairline
    // scrollbar hinting there was more, which read as a broken layout.
    // Wrapping to a second row is the lesser evil: nothing is hidden.
    <nav className="flex flex-wrap gap-2" aria-label="Cambiar sesion">
      {routines.map((routine) => {
        const active = routine.id === selectedRoutineId;
        const done = doneThisWeekIds.has(routine.id);
        return (
          <button
            key={routine.id}
            type="button"
            onClick={() => onSelect(routine.id)}
            aria-pressed={active}
            // Surface the "done" status via the button's accessible name
            // instead of an aria-label on the SVG inside it — that
            // strategy made screen readers stutter with the icon's label
            // colliding with the button text. The CheckIcon is now
            // purely decorative (aria-hidden).
            aria-label={
              done
                ? `${formatRoutineName(routine)} (hecha esta semana)`
                : undefined
            }
            title={done ? 'Hecha esta semana' : undefined}
            className={`inline-flex min-w-0 max-w-full items-center gap-2 font-pixel text-[9px] tracking-widest border-2 px-3 py-2 transition-colors ${
              active
                ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
            }`}
          >
            {done && (
              <CheckIcon
                className="h-3 w-3 shrink-0 text-green-400"
                aria-hidden="true"
              />
            )}
            {active ? '▶ ' : ''}
            <span className="truncate">{formatRoutineName(routine)}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onCreateNew}
        className="inline-flex items-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-dashed border-[#3f3f46] bg-card text-ink-muted hover:border-green-500/50 hover:text-green-400 px-3 py-2 transition-colors"
      >
        <PlusIcon className="h-3 w-3" />
        NUEVA
      </button>
    </nav>
  );
};
