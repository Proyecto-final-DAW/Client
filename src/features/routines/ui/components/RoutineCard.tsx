import { BoltIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import type { Routine } from '../../core/domain/models/Routine';

type RoutineCardProps = {
  routine: Routine;
  isSelected: boolean;
  onSelect: (routineId: string) => void;
  onDelete: (routineId: string) => void;
};

export const RoutineCard = ({
  routine,
  isSelected,
  onSelect,
  onDelete,
}: RoutineCardProps) => {
  return (
    <article
      className={`rounded-2xl border bg-gray-950/70 p-4 transition ${
        isSelected
          ? 'border-blue-500/60'
          : 'border-gray-800 hover:border-blue-500/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-100">
            {routine.name}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {routine.exercises.length} ejercicios
          </p>
        </div>

        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
          Rutina
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onDelete(routine.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
        >
          <TrashIcon className="h-4 w-4" />
          Borrar
        </button>

        <button
          type="button"
          onClick={() => onSelect(routine.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-gray-950 transition hover:bg-blue-400"
        >
          <PlayIcon className="h-4 w-4" />
          Usar
        </button>

        <Link
          to={`/sessions/new?routineId=${routine.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-gray-950 transition hover:bg-emerald-400"
        >
          <BoltIcon className="h-4 w-4" />
          Iniciar sesión
        </Link>
      </div>
    </article>
  );
};
