import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';

type Props = {
  exercise: Exercise;
  setNumber: number;
};

export const ExerciseHeader = (props: Props): React.JSX.Element => {
  return (
    <header className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5">
      <PixelCorners size="md" className="border-green-500/60" />

      <p className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
        SET {props.setNumber}
      </p>
      <h1 className="font-['Press_Start_2P'] text-base sm:text-lg leading-relaxed text-green-400 mt-2 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
        {props.exercise.name}
      </h1>
      {props.exercise.target && (
        <p className="font-['VT323'] text-base text-[#71717a] mt-1">
          {props.exercise.target}
        </p>
      )}
    </header>
  );
};
