import type { Exercise } from '../../core/domain/models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-200">
      <img
        src={exercise.gifUrl}
        alt={exercise.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-3 flex flex-col gap-1">
        <p className="text-white font-semibold text-sm capitalize">
          {exercise.name}
        </p>
        <span className="text-xs text-gray-400 capitalize">
          {exercise.target}
        </span>
      </div>
    </div>
  );
};
