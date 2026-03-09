import { MUSCLE_OPTIONS, useExerciseSearch } from '../hooks/useExerciseSearch';
import { ExerciseCard } from './ExerciseCard';

export const ExerciseSearch = () => {
  const { search, setSearch, muscle, setMuscle, exercises, loading, error } =
    useExerciseSearch();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <select
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.name} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
};
