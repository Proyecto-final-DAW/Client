import { API_BASE_URL } from '../../../../config/api';
import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type Props = {
  exercise: Exercise;
  setNumber: number;
};

export const ExerciseHeader = (props: Props): React.JSX.Element => {
  const imgSrc = props.exercise.imageUrl
    ? `${API_BASE_URL}${props.exercise.imageUrl}`
    : null;

  return (
    <header className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5 sm:p-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <PixelCorners size="md" className="border-green-500/60" />

      {imgSrc && (
        <div className="hidden sm:block h-20 w-20 shrink-0 overflow-hidden border-2 border-[#1e1e2e] bg-[#0a0a0f]">
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

      <div className="min-w-0 flex-1 text-center">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
          SET {props.setNumber}
        </p>
        <h1 className="font-['Press_Start_2P'] text-sm sm:text-base leading-relaxed text-green-400 mt-3 [text-shadow:0_0_16px_rgba(34,197,94,0.55)] break-words">
          {props.exercise.name}
        </h1>
        {props.exercise.target && (
          <p className="font-['Press_Start_2P'] text-lg text-[#a1a1aa] mt-2 capitalize">
            {props.exercise.target}
          </p>
        )}
      </div>
    </header>
  );
};
