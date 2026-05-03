type Props = {
  currentExerciseIndex: number;
  totalExercises: number;
  onCancel: () => void;
};

export const WorkoutProgressBar = (props: Props): React.JSX.Element => {
  const { currentExerciseIndex, totalExercises, onCancel } = props;
  const completedCount = currentExerciseIndex;
  const progressPercent =
    totalExercises === 0
      ? 0
      : Math.round((completedCount / totalExercises) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]">
          EJERCICIO {currentExerciseIndex + 1} / {totalExercises}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="font-['Press_Start_2P'] text-[8px] tracking-widest text-red-400 hover:text-red-300 transition-colors"
        >
          ✕ CANCELAR
        </button>
      </div>

      <div
        className="h-2 border-2 border-[#1e1e2e] bg-[#0d0d14] overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del entrenamiento"
      >
        <div
          className="h-full bg-green-500 transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
