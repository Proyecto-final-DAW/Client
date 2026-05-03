import { TrophyIcon } from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../../shared/components/PixelCorners';
import type { WeeklySummary } from '../../../core/domain/models/WeeklySummary';
import { SummaryRow } from './SummaryRow';

type Props = {
  summary: WeeklySummary;
};

export const WeeklySummaryCard = (props: Props): React.JSX.Element => {
  const { current, previous } = props.summary;

  return (
    <article className="relative border-2 border-green-500/60 bg-[#0d0d14] p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)] md:col-span-2 xl:col-span-3">
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="flex items-center gap-3 border-b-2 border-[#1e1e2e] pb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-green-500/40 bg-green-500/10">
          <TrophyIcon className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
            ▸ RESUMEN SEMANAL
          </p>
          <p className="mt-1 font-['VT323'] text-base text-[#a1a1aa]">
            Esta semana vs. semana anterior
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <SummaryRow
          label="Dias entrenados"
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
