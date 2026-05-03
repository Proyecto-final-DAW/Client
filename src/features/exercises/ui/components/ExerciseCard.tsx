import { API_BASE_URL } from '../../../../config/api';
import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../core/domain/models/Exercise';

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

export const ExerciseCard = ({
  exercise,
  onSelect,
}: ExerciseCardProps): React.JSX.Element => {
  const diffColor =
    DIFFICULTY_COLOR[exercise.difficulty] ??
    'text-[#a1a1aa] border-[#3f3f46] bg-[#18181b]';
  const diffLabel =
    DIFFICULTY_LABEL[exercise.difficulty] ?? exercise.difficulty;
  const imgSrc = `${API_BASE_URL}${exercise.imageUrl}`;

  const content = (
    <>
      <PixelCorners size="sm" className="border-green-500/40" />

      <div className="relative h-40 overflow-hidden border-b-2 border-[#1e1e2e] bg-[#0a0a0f]">
        <img
          src={imgSrc}
          alt={exercise.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
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
