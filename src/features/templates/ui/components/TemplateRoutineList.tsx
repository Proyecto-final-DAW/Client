import type { TemplateRoutine } from '../../core/domain/models/RoutineTemplate';
import { ExerciseTable } from './ExerciseTable';

type Props = {
  routines: TemplateRoutine[];
};

export const TemplateRoutineList = (props: Props): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-8">
      {props.routines.map((routine, index) => (
        <article
          key={`${routine.name}-${index}`}
          className="flex flex-col gap-3"
        >
          <p className="font-pixel text-[10px] tracking-widest text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.5)]">
            DIA {index + 1}
          </p>
          <h2 className="font-pixel text-[11px] tracking-widest text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]">
            {routine.name}
          </h2>
          <ExerciseTable exercises={routine.exercises} />
        </article>
      ))}
    </div>
  );
};
