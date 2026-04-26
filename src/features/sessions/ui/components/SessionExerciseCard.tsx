import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import type { SessionSet } from '../../core/domain/models/Session';
import type { SessionExerciseDraft } from '../hooks/useSessionForm';
import { SetRow } from './SetRow';

type SessionExerciseCardProps = {
  exercise: SessionExerciseDraft;
  index: number;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onUpdateSet: (
    setIndex: number,
    field: keyof SessionSet,
    value: number
  ) => void;
  onRemoveExercise: () => void;
};

export const SessionExerciseCard = ({
  exercise,
  index,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onRemoveExercise,
}: SessionExerciseCardProps) => {
  return (
    <article className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-blue-400">
            {index + 1}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-100">
              {exercise.name}
            </h3>
            <p className="text-xs text-gray-400">
              {exercise.sets.length} serie
              {exercise.sets.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemoveExercise}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
        >
          <TrashIcon className="h-4 w-4" />
          Quitar
        </button>
      </header>

      <div className="space-y-3">
        {exercise.sets.map((set, setIndex) => (
          <SetRow
            key={setIndex}
            index={setIndex}
            set={set}
            canRemove={exercise.sets.length > 1}
            onChange={(field, value) => onUpdateSet(setIndex, field, value)}
            onRemove={() => onRemoveSet(setIndex)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddSet}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
      >
        <PlusIcon className="h-4 w-4" />
        Añadir serie
      </button>
    </article>
  );
};
