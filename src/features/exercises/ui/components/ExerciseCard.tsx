import { useState } from 'react';

import { API_BASE_URL } from '../../../../config/api';
import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../core/domain/models/Exercise';
import { MuscleArt } from './MuscleArt';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'PRINCIPIANTE',
  intermediate: 'INTERMEDIO',
  expert: 'AVANZADO',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400 border-green-500/40 bg-green-500/10',
  intermediate: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  expert: 'text-red-400 border-red-500/40 bg-red-500/10',
};

// Pixel-grid background used when the upstream image is missing. Cheap
// CSS-only texture that keeps the card looking intentional instead of empty.
const PIXEL_GRID_BG = {
  backgroundImage:
    'linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)',
  backgroundSize: '8px 8px',
};

export const ExerciseCard = ({
  exercise,
  onSelect,
}: ExerciseCardProps): React.JSX.Element => {
  const [imgFailed, setImgFailed] = useState(false);
  const diffColor =
    DIFFICULTY_COLOR[exercise.difficulty] ??
    'text-[#a1a1aa] border-[#3f3f46] bg-[#18181b]';
  const diffLabel =
    DIFFICULTY_LABEL[exercise.difficulty] ?? exercise.difficulty;
  // Absolute URL (https://…) → use as-is (the new ExerciseDB CDN). Relative
  // (/exercises/image/:id) → prefix with our API base because that's the
  // legacy server proxy.
  const imgSrc = exercise.imageUrl
    ? exercise.imageUrl.startsWith('http')
      ? exercise.imageUrl
      : `${API_BASE_URL}${exercise.imageUrl}`
    : '';
  const showFallback = !imgSrc || imgFailed;

  const content = (
    <>
      <PixelCorners size="sm" className="border-green-500/40" />

      <div
        className="relative h-28 overflow-hidden border-b-2 border-[#1e1e2e] bg-gradient-to-br from-[#0a0a0f] to-[#10101a]"
        style={showFallback ? PIXEL_GRID_BG : undefined}
      >
        {!showFallback ? (
          <img
            src={imgSrc}
            alt={exercise.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <MuscleArt
              target={exercise.target}
              aria-hidden="true"
              className="h-12 w-12 text-green-500/70 [filter:drop-shadow(0_0_6px_rgba(34,197,94,0.45))]"
            />
            <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-green-500/60 uppercase">
              {exercise.target}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h3 className="font-['Press_Start_2P'] text-[10px] leading-tight text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.5)] line-clamp-2">
          {exercise.name.toUpperCase()}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <span className="font-['Press_Start_2P'] text-[7px] tracking-widest border border-green-500/40 bg-green-500/10 text-green-400 px-1.5 py-0.5 uppercase">
            {exercise.target}
          </span>
          <span className="font-['Press_Start_2P'] text-[7px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-1.5 py-0.5 uppercase">
            {exercise.equipment}
          </span>
          <span
            className={`font-['Press_Start_2P'] text-[7px] tracking-widest border px-1.5 py-0.5 uppercase ${diffColor}`}
          >
            {diffLabel}
          </span>
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(exercise)}
        className="group relative flex flex-col overflow-hidden border-2 border-[#1e1e2e] bg-[#0d0d14] text-left transition-colors hover:border-green-500/60 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden border-2 border-[#1e1e2e] bg-[#0d0d14]">
      {content}
    </div>
  );
};
