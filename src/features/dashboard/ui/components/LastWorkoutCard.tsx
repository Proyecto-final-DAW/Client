import { CalendarDaysIcon } from '@heroicons/react/24/outline';

type Props = {
  lastWorkoutDaysAgo: number;
};

export const LastWorkoutCard = (props: Props): React.JSX.Element => {
  return (
    <article className="mr-2 ml-2 rounded-2xl border border-emerald-500 bg-zinc-900 p-6 shadow-sm">
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
  );
};
