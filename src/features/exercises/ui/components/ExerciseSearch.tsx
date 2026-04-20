import type { Exercise } from '../../core/domain/models/Exercise';
import { MUSCLE_OPTIONS, useExerciseSearch } from '../hooks/useExerciseSearch';
import { ExerciseCard } from './ExerciseCard';

type ExerciseSearchProps = {
  onSelectExercise?: (exercise: Exercise) => void;
};

export const ExerciseSearch = ({
  onSelectExercise,
}: ExerciseSearchProps): React.JSX.Element => {
  const {
    search,
    setSearch,
    muscle,
    setMuscle,
    exercises,
    loading,
    error,
    page,
    totalPages,
    goToPage,
  } = useExerciseSearch();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-white outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
          className="rounded-lg bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MUSCLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {error && !loading && (
        <div className="py-8 text-center text-red-400">{error}</div>
      )}

      {!loading && !error && exercises.length === 0 && (search || muscle) && (
        <div className="py-8 text-center text-gray-400">
          No se encontraron ejercicios
        </div>
      )}

      {!loading && !error && !search && !muscle && (
        <div className="py-8 text-center text-gray-400">
          Busca un ejercicio o selecciona un grupo muscular
        </div>
      )}

      {!loading && !error && exercises.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={onSelectExercise}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
