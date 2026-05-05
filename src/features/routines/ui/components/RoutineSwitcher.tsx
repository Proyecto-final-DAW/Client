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
    // Horizontal scroll with snap on mobile (`flex-nowrap`), wraps freely
    // from sm+ where there's room. Without this a user with 4-5 routines
    // saw the bar wrap to 3 rows on a phone, eating the page.
    <nav
      className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scroll-snap-type:x_proximity] sm:flex-wrap sm:overflow-visible"
      aria-label="Cambiar sesion"
    >
      {routines.map((routine) => {
        const active = routine.id === selectedRoutineId;
        const done = doneThisWeekIds.has(routine.id);
        return (
          <button
            key={routine.id}
            type="button"
            onClick={() => onSelect(routine.id)}
            aria-pressed={active}
            title={done ? 'Hecha esta semana' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 max-w-xs truncate [scroll-snap-align:start] font-pixel text-[9px] tracking-widest border-2 px-3 py-2 transition-colors ${
              active
                ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
            }`}
          >
            {done && (
              <CheckIcon
                className="h-3 w-3 shrink-0 text-green-400"
                aria-label="Hecha esta semana"
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
        className="inline-flex shrink-0 items-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-dashed border-[#3f3f46] bg-card text-ink-muted hover:border-green-500/50 hover:text-green-400 px-3 py-2 transition-colors"
      >
        <PlusIcon className="h-3 w-3" />
        NUEVA
      </button>
    </nav>
  );
};
