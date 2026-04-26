import { TrashIcon } from '@heroicons/react/24/outline';

import type { SessionSet } from '../../core/domain/models/Session';

type SetRowProps = {
  index: number;
  set: SessionSet;
  canRemove: boolean;
  onChange: (field: keyof SessionSet, value: number) => void;
  onRemove: () => void;
};

const parseNumber = (value: string): number => {
  if (value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const SetRow = ({
  index,
  set,
  canRemove,
  onChange,
  onRemove,
}: SetRowProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/70 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-blue-400">
        {index + 1}
      </div>

      <label className="flex flex-1 min-w-[120px] flex-col text-xs text-gray-400">
        Reps
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={set.reps === 0 ? '' : set.reps}
          onChange={(event) =>
            onChange('reps', parseNumber(event.target.value))
          }
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
        />
      </label>

      <label className="flex flex-1 min-w-[120px] flex-col text-xs text-gray-400">
        Peso (kg)
        <input
          type="number"
          min={0}
          step="0.5"
          inputMode="decimal"
          value={set.weight === 0 ? '' : set.weight}
          onChange={(event) =>
            onChange('weight', parseNumber(event.target.value))
          }
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
        />
      </label>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
