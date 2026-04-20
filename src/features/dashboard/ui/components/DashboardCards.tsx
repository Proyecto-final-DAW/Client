import {
  CalendarDaysIcon,
  ChartBarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

import type { Cards } from '../../core/domain/models/Cards';

type Props = Cards;

export const DashboardCards = (props: Props): React.JSX.Element => {
  const globalLevel =
    Object.values(props.stats).reduce((acc, val) => acc + val, 0) /
    Object.values(props.stats).length;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl bg-zinc-900 p-6 shadow-sm mr-2 ml-2 border border-emerald-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-100">Racha</p>
            <div className="mt-3 flex items-center gap-3">
              <FireIcon className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {props.streak}
                </p>
                <p className="text-sm text-zinc-100">
                  ¡{props.streak} días seguidos!
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-zinc-900 p-6 shadow-sm mr-2 ml-2 border border-emerald-500">
        <div>
          <p className="text-sm font-medium text-zinc-100">
            Último entrenamiento
          </p>
          <div className="mt-3 flex items-center gap-3">
            <CalendarDaysIcon className="h-8 w-8 text-zinc-100" />
            <div>
              <p className="text-xl font-bold text-zinc-100">
                Hace {props.lastWorkoutDaysAgo} días
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-zinc-900 p-6 shadow-sm ml-2 mr-2 border border-emerald-500">
        <div>
          <p className="text-sm font-medium text-zinc-100">Nivel global</p>
          <div className="mt-3 flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-xl font-bold text-zinc-100">
                {globalLevel.toFixed(1)}
              </p>
              <p className="text-sm text-zinc-100">Media de tus stats</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
