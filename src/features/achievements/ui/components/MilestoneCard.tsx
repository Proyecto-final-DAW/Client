import {
  BoltIcon,
  FireIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import type { Milestone } from '../../core/domain/models/Milestone';

type Props = {
  milestone: Milestone;
};

const ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  trophy: TrophyIcon,
  flame: FireIcon,
  bolt: BoltIcon,
  star: StarIcon,
  dumbbell: ShieldCheckIcon,
  crown: SparklesIcon,
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const MilestoneCard = (props: Props): React.JSX.Element => {
  const Icon = ICON_MAP[props.milestone.icon] ?? TrophyIcon;
  const isUnlocked = props.milestone.unlocked;

  return (
    <article
      className={`relative rounded-2xl border p-5 shadow-sm transition-colors ${
        isUnlocked
          ? 'border-emerald-500 bg-zinc-900'
          : 'border-zinc-700 bg-zinc-900/50'
      }`}
    >
      {!isUnlocked && (
        <LockClosedIcon className="absolute right-3 top-3 h-4 w-4 text-zinc-600" />
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            isUnlocked
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-zinc-800 text-zinc-600'
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-bold ${
              isUnlocked ? 'text-zinc-100' : 'text-zinc-500'
            }`}
          >
            {props.milestone.name}
          </h3>
          <p
            className={`mt-1 text-xs leading-relaxed ${
              isUnlocked ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            {props.milestone.description}
          </p>
          {isUnlocked && props.milestone.unlockedAt && (
            <p className="mt-2 text-[11px] font-medium text-emerald-400">
              Desbloqueado el {formatDate(props.milestone.unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
