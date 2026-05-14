import { PixelCorners } from '@shared/components/PixelCorners';

import {
  DIFFICULTY_LABEL,
  EQUIPMENT_LABEL,
  TARGET_LABEL,
  formatLabel,
} from '../../core/domain/labels';
import type { Exercise } from '../../core/domain/models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
  /**
   * True when this exercise is already in the routine the picker is
   * adding to. Renders a non-interactive "AÑADIDO" tile so the user
   * doesn't keep tapping a card that the server treats as a no-op.
   */
  added?: boolean;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400 border-green-500/40 bg-green-500/10',
  intermediate: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  expert: 'text-red-400 border-red-500/40 bg-red-500/10',
};

const PIXEL_GRID_BG: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)',
  backgroundSize: '8px 8px',
};

export const ExerciseCard = ({
  exercise,
  onSelect,
  added = false,
}: ExerciseCardProps): React.JSX.Element => {
  const diffColor =
    DIFFICULTY_COLOR[exercise.difficulty] ??
    'text-ink-muted border-[#3f3f46] bg-[#18181b]';
  const diffLabel =
    DIFFICULTY_LABEL[exercise.difficulty] ?? exercise.difficulty.toUpperCase();
  const targetLabel = formatLabel(exercise.target, TARGET_LABEL);
  const equipmentLabel = formatLabel(exercise.equipment, EQUIPMENT_LABEL);

  const content = (
    <>
      <PixelCorners
        size="sm"
        className={added ? 'border-green-500/70' : 'border-green-500/40'}
      />

      {added && (
        // Corner ribbon — sits above the hero so the "added" state is
        // legible even when the card is one of 12 in a tight grid.
        <span className="pointer-events-none absolute right-0 top-0 z-10 inline-flex items-center gap-1 border-l-2 border-b-2 border-green-500/60 bg-green-500/15 px-1.5 py-0.5 font-pixel text-[7px] sm:text-[8px] tracking-widest text-green-300">
          ✓ AÑADIDO
        </span>
      )}

      <div
        className="relative flex h-16 sm:h-28 items-center justify-center overflow-hidden border-b-2 border-border bg-page px-2 sm:px-3"
        style={PIXEL_GRID_BG}
      >
        <span className="relative z-10 text-center font-pixel text-[10px] sm:text-base lg:text-lg tracking-widest text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)] uppercase break-words">
          {targetLabel}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)',
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 p-2 sm:p-3">
        <h3 className="font-pixel text-[8px] sm:text-[10px] leading-tight text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.5)] line-clamp-2">
          {exercise.name.toUpperCase()}
        </h3>

        {/* Press Start 2P below 9px renders as illegible blocks ("ant
            tracks"). VT323 (font-pixel-mono) at text-base is far more
            readable at chip size and lets long labels like
            "INTERMEDIATE" / "HOME WEIGHTS" fit without overflow. */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {exercise.equipment && (
            <span className="font-pixel-mono text-sm sm:text-base leading-none border border-[#3f3f46] bg-[#18181b] text-ink-muted px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase">
              {equipmentLabel}
            </span>
          )}
          <span
            className={`font-pixel-mono text-sm sm:text-base leading-none border px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase ${diffColor}`}
          >
            {diffLabel}
          </span>
        </div>
      </div>
    </>
  );

  if (onSelect && !added) {
    return (
      <button
        type="button"
        onClick={() => onSelect(exercise)}
        className="group relative mx-auto flex w-full max-w-[260px] flex-col overflow-hidden border-2 border-border bg-card text-left transition-colors hover:border-green-500/60 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        {content}
      </button>
    );
  }

  // Already-added cards are non-interactive: the click would be a
  // no-op server-side (addExercise short-circuits on duplicates) and
  // pretending it did something would mislead the user. Kept as a
  // visual tile with the "AÑADIDO" ribbon so it stays obvious.
  const inertBorder = added
    ? 'border-green-500/40 bg-card/80 opacity-90'
    : 'border-border bg-card';
  return (
    <div
      aria-disabled={added || undefined}
      className={`group relative mx-auto flex w-full max-w-[260px] flex-col overflow-hidden border-2 ${inertBorder}`}
    >
      {content}
    </div>
  );
};
