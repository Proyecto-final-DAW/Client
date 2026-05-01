import type { TemplateExercise } from '../../core/domain/models/TemplateExercise';

type Props = {
  exercises: TemplateExercise[];
};

const formatRest = (seconds: number): string => {
  if (seconds === 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder === 0 ? `${minutes}min` : `${minutes}m ${remainder}s`;
};

export const ExerciseTable = (props: Props): React.JSX.Element => {
  return (
    <div className="overflow-x-auto border-2 border-[#1e1e2e] bg-[#0d0d14]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-[#1e1e2e] bg-[#18181b]">
            <th className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] px-3 py-3 w-10">
              #
            </th>
            <th className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] px-3 py-3">
              EJERCICIO
            </th>
            <th className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] px-3 py-3 hidden sm:table-cell">
              GRUPO
            </th>
            <th className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] px-3 py-3 text-center">
              SETS × REPS
            </th>
            <th className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] px-3 py-3 text-center">
              DESCANSO
            </th>
          </tr>
        </thead>
        <tbody>
          {props.exercises.map((exercise, index) => (
            <tr
              key={`${exercise.name}-${index}`}
              className="border-b border-[#1e1e2e] last:border-b-0"
            >
              <td className="font-['VT323'] text-base text-[#71717a] px-3 py-3">
                {index + 1}
              </td>
              <td className="font-['VT323'] text-lg text-[#e4e4e7] px-3 py-3">
                {exercise.name}
              </td>
              <td className="font-['VT323'] text-base text-[#a1a1aa] px-3 py-3 hidden sm:table-cell">
                {exercise.muscleGroup}
              </td>
              <td className="font-['VT323'] text-lg text-green-400 px-3 py-3 text-center whitespace-nowrap">
                {exercise.sets} × {exercise.reps}
              </td>
              <td className="font-['VT323'] text-base text-[#a1a1aa] px-3 py-3 text-center whitespace-nowrap">
                {formatRest(exercise.restSeconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
