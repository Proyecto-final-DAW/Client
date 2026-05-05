import {
  BoltIcon,
  FireIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
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
      className={`relative border-2 p-4 transition-colors ${
        isUnlocked
          ? 'border-green-500/60 bg-card shadow-[0_0_14px_rgba(34,197,94,0.18)]'
          : 'border-border bg-page/80'
      }`}
    >
      <PixelCorners
        size="sm"
        className={isUnlocked ? 'border-green-500/60' : 'border-[#3f3f46]'}
      />

      {!isUnlocked && (
        <LockClosedIcon className="absolute right-2 top-2 h-3.5 w-3.5 text-ink-disabled" />
      )}

      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 ${
            isUnlocked
              ? 'border-green-500/40 bg-green-500/10 text-green-400'
              : 'border-border-muted bg-page text-ink-disabled'
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-pixel text-[10px] tracking-widest leading-tight ${
              isUnlocked
                ? 'text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.5)]'
                : 'text-ink-faint'
            }`}
          >
            {props.milestone.name.toUpperCase()}
          </h3>
          <p
            className={`mt-2 font-pixel text-base leading-tight ${
              isUnlocked ? 'text-[#d4d4d8]' : 'text-ink-disabled'
            }`}
          >
            {props.milestone.description}
          </p>
          {isUnlocked && props.milestone.unlockedAt && (
            <p className="mt-2 font-pixel text-[8px] tracking-widest text-green-500">
              ✦ {formatDate(props.milestone.unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
