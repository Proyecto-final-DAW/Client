import { TrashIcon } from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type ExerciseRowProps = {
  exercise: Exercise;
  index: number;
  editing: boolean;
  onRemove: (exerciseId: string) => void;
};

export const ExerciseRow = ({
  exercise,
  index,
  editing,
  onRemove,
}: ExerciseRowProps) => {
  return (
    <article className="relative flex items-center gap-3 border-2 border-[#1e1e2e] bg-[#0d0d14] p-3">
      <PixelCorners size="sm" className="border-green-500/30" />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#27272a] bg-[#12121a] font-['Press_Start_2P'] text-[10px] text-green-400">
        {String(index + 1).padStart(2, '0')}
      </div>

      <h3 className="flex-1 font-['Press_Start_2P'] text-base sm:text-lg leading-tight text-[#e4e4e7]">
        {exercise.name}
      </h3>

      {editing && (
        <button
          type="button"
          onClick={() => onRemove(exercise.id)}
          aria-label={`Eliminar ${exercise.name}`}
          className="border-2 border-red-500/40 bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </article>
  );
};
