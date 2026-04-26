import { TrashIcon } from '@heroicons/react/24/outline';

import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type ExerciseRowProps = {
  exercise: Exercise;
  index: number;
  onRemove: (exerciseId: string) => void;
};

export const ExerciseRow = ({
  exercise,
  index,
  onRemove,
}: ExerciseRowProps) => {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-blue-400">
          {index + 1}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-100">
            {exercise.name}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRemove(exercise.id)}
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
};
