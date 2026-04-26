import { TrophyIcon } from '@heroicons/react/24/outline';

import type { WeeklySummary } from '../../../core/domain/models/WeeklySummary';
import { SummaryRow } from './SummaryRow';

type Props = {
  summary: WeeklySummary;
};

export const WeeklySummaryCard = (props: Props): React.JSX.Element => {
  const { current, previous } = props.summary;

  return (
    <article className="mr-2 ml-2 rounded-2xl border border-emerald-500 bg-zinc-900 p-6 shadow-sm md:col-span-2 xl:col-span-3">
      <div className="flex items-center gap-3">
        <TrophyIcon className="h-8 w-8 text-emerald-500" />
        <div>
          <p className="text-sm font-medium text-zinc-100">Resumen semanal</p>
          <p className="text-xs text-zinc-400">
            Esta semana vs. semana anterior
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <SummaryRow
          label="Días entrenados"
          formattedValue={`${current.daysTrained} / 7`}
          currentValue={current.daysTrained}
          previousValue={previous.daysTrained}
        />
        <SummaryRow
          label="Ejercicios totales"
          formattedValue={String(current.totalExercises)}
          currentValue={current.totalExercises}
          previousValue={previous.totalExercises}
        />
        <SummaryRow
          label="Volumen total"
          formattedValue={`${current.totalVolume.toLocaleString('es-ES')} kg`}
          currentValue={current.totalVolume}
          previousValue={previous.totalVolume}
        />
      </div>
    </article>
  );
};
