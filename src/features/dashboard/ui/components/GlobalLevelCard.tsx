import { ChartBarIcon } from '@heroicons/react/24/outline';

type Props = {
  globalLevel: number;
};

export const GlobalLevelCard = ({ globalLevel }: Props): React.JSX.Element => {
  return (
    <article className="mr-2 ml-2 rounded-2xl border border-emerald-500 bg-zinc-900 p-6 shadow-sm">
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
  );
};
