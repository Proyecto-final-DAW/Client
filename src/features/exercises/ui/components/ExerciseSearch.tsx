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
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="exercise-search" className="sr-only">
          Buscar ejercicio
        </label>
        <input
          id="exercise-search"
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <label htmlFor="exercise-muscle" className="sr-only">
          Filtrar por grupo muscular
        </label>
        <select
          id="exercise-muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="text-red-400 text-center py-8">{error}</div>
      )}

      {!loading && !error && exercises.length === 0 && (search || muscle) && (
        <div className="text-gray-400 text-center py-8">
          No se encontraron ejercicios
        </div>
      )}

      {!loading && !error && !search && !muscle && (
        <div className="text-gray-400 text-center py-8">
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
            <nav
              aria-label="Paginación de ejercicios"
              className="flex justify-center items-center gap-2"
            >
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-label={`Página ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-8 h-8 rounded-lg text-sm transition-colors ${
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
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};
