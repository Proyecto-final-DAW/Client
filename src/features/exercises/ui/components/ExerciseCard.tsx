import { API_BASE_URL } from '../../../../config/api';
import type { Exercise } from '../../core/domain/models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  expert: 'Avanzado',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-400 border-green-400',
  intermediate: 'text-yellow-400 border-yellow-400',
  expert: 'text-red-400 border-red-400',
};

export const ExerciseCard = (props: ExerciseCardProps): React.JSX.Element => {
  const diffColor =
    DIFFICULTY_COLORS[props.exercise.difficulty] ??
    'text-gray-400 border-gray-400';
  const diffLabel =
    DIFFICULTY_LABEL[props.exercise.difficulty] ?? props.exercise.difficulty;
  const imgSrc = `${API_BASE_URL}${props.exercise.imageUrl}`;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col hover:border-blue-500 transition-colors duration-200">
      <img
        src={imgSrc}
        alt={props.exercise.name}
        className="w-full h-44 object-cover bg-gray-900"
        loading="lazy"
      />
      <div className="p-3 flex flex-col gap-2">
        <p className="text-white font-semibold text-sm capitalize">
          {props.exercise.name}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full capitalize">
            {props.exercise.target}
          </span>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
            {props.exercise.equipment}
          </span>
          <span
            className={`text-xs font-medium border px-2 py-0.5 rounded-full capitalize ${diffColor}`}
          >
            {diffLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
