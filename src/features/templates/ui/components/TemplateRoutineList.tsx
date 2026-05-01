import type { TemplateRoutine } from '../../core/domain/models/RoutineTemplate';
import { ExerciseTable } from './ExerciseTable';

type Props = {
  routines: TemplateRoutine[];
};

export const TemplateRoutineList = (props: Props): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-6">
      {props.routines.map((routine, index) => (
        <article
          key={`${routine.name}-${index}`}
          className="flex flex-col gap-3"
        >
          <h2 className="font-['Press_Start_2P'] text-[11px] tracking-widest text-green-400">
            {routine.name}
          </h2>
          <ExerciseTable exercises={routine.exercises} />
        </article>
      ))}
    </div>
  );
};
