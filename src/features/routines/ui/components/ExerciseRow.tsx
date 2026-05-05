import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type ExerciseRowProps = {
  exercise: Exercise;
  index: number;
  total: number;
  editing: boolean;
  onRemove: (exerciseId: string) => void;
  onMove?: (exerciseId: string, direction: 'up' | 'down') => void;
};

export const ExerciseRow = ({
  exercise,
  index,
  total,
  editing,
  onRemove,
  onMove,
}: ExerciseRowProps) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <article className="relative flex items-center gap-3 border-2 border-border bg-card p-3">
      <PixelCorners size="sm" className="border-green-500/30" />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border-muted bg-subtle font-pixel text-[10px] text-green-400">
        {String(index + 1).padStart(2, '0')}
      </div>

      <h3 className="flex-1 font-pixel text-[10px] sm:text-[11px] leading-relaxed text-ink">
        {exercise.name}
      </h3>

      {editing && (
        <div className="flex items-center gap-1">
          {onMove && (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => onMove(exercise.id, 'up')}
                disabled={isFirst}
                aria-label={`Subir ${exercise.name}`}
                className="border border-border-muted bg-subtle p-1 text-ink-muted transition-colors hover:border-green-500/50 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border-muted disabled:hover:text-ink-muted"
              >
                <ChevronUpIcon className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onMove(exercise.id, 'down')}
                disabled={isLast}
                aria-label={`Bajar ${exercise.name}`}
                className="border border-t-0 border-border-muted bg-subtle p-1 text-ink-muted transition-colors hover:border-green-500/50 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border-muted disabled:hover:text-ink-muted"
              >
                <ChevronDownIcon className="h-3 w-3" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => onRemove(exercise.id)}
            aria-label={`Eliminar ${exercise.name}`}
            className="border-2 border-red-500/40 bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </article>
  );
};
