import { FireIcon } from '@heroicons/react/24/outline';

type Props = {
  streak: number;
};

export const StreakCard = (props: Props): React.JSX.Element => {
  return (
    <article className="mr-2 ml-2 rounded-2xl border border-emerald-500 bg-zinc-900 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-100">Racha</p>

          <div className="mt-3 flex items-center gap-3">
            <FireIcon className="h-8 w-8 text-orange-500" />

            <div>
              <p className="text-xl font-bold text-zinc-100">{props.streak}</p>
              <p className="text-sm text-zinc-100">
                ¡{props.streak} días seguidos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
