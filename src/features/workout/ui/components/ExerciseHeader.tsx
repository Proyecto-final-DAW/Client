import { API_BASE_URL } from '@config/api';
import { PixelCorners } from '@shared/components/PixelCorners';

import {
  TARGET_LABEL,
  formatLabel,
} from '../../../exercises/core/domain/labels';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type Props = {
  exercise: Exercise;
  setNumber: number;
  /**
   * Prescribed sets from the routine. When provided, the header reads
   * "SET 2 / 4" instead of just "SET 2" — gives the user a visible
   * target and powers the early-skip / over-prescribed warnings in
   * LiveWorkoutView.
   */
  totalSets?: number;
  /**
   * Cardio activities log as a single duration, not a sequence of
   * sets — switching the label to ACTIVIDAD keeps the UI from
   * suggesting the user should run "set 2" of a 30-minute treadmill.
   */
  isCardio?: boolean;
};

export const ExerciseHeader = (props: Props): React.JSX.Element => {
  // Absolute URL → use as-is (free-exercise-db CDN). Relative path → prefix
  // with the API base, kept for backward compatibility with any pre-migration
  // saved exercise that still carries a relative URL.
  const imgSrc = props.exercise.imageUrl
    ? props.exercise.imageUrl.startsWith('http')
      ? props.exercise.imageUrl
      : `${API_BASE_URL}${props.exercise.imageUrl}`
    : null;

  const setLabel = props.isCardio
    ? 'ACTIVIDAD'
    : props.totalSets && props.totalSets > 0
      ? `SET ${props.setNumber} / ${props.totalSets}`
      : `SET ${props.setNumber}`;

  return (
    <header className="relative border-2 border-green-500/40 bg-card p-5 sm:p-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <PixelCorners size="md" className="border-green-500/60" />

      {imgSrc && (
        <div className="hidden sm:block h-20 w-20 shrink-0 overflow-hidden border-2 border-border bg-page">
          <img
            src={imgSrc}
            alt={props.exercise.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display =
                'none';
            }}
          />
        </div>
      )}

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="font-pixel text-[9px] tracking-widest text-green-500">
          {setLabel}
        </p>
        {/* Hierarchy: exercise name is the heading (largest), target
            muscle is its subordinate eyebrow (smaller, font-pixel-mono
            for contrast). Previously the target was rendered at
            text-lg while the name was text-sm — secondary metadata
            literally outweighed the primary heading. */}
        <h1 className="mt-3 font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)] break-words">
          {props.exercise.name}
        </h1>
        {props.exercise.target && (
          <p className="mt-2 font-pixel-mono text-base text-ink-muted uppercase tracking-wide">
            {formatLabel(props.exercise.target, TARGET_LABEL)}
          </p>
        )}
      </div>
    </header>
  );
};
