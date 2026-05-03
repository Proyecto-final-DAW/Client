import type { Exercise } from '../../core/domain/models/Exercise';
import { MUSCLE_OPTIONS, useExerciseSearch } from '../hooks/useExerciseSearch';
import { ExerciseCard } from './ExerciseCard';

type ExerciseSearchProps = {
  onSelectExercise?: (exercise: Exercise) => void;
};

const inputClass =
  "flex-1 bg-[#12121a] border-2 border-[#1e1e2e] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:border-green-500/70 focus:outline-none transition-colors";

const selectClass =
  "bg-[#12121a] border-2 border-[#1e1e2e] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#e4e4e7] focus:border-green-500/70 focus:outline-none transition-colors [color-scheme:dark]";

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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="exercise-search" className="sr-only">
          Buscar ejercicio
        </label>
        <input
          id="exercise-search"
          type="text"
          placeholder="BUSCAR EJERCICIO…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <label htmlFor="exercise-muscle" className="sr-only">
          Filtrar por grupo muscular
        </label>
        <select
          id="exercise-muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
          className={selectClass}
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
          <div className="h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <p className="border-2 border-red-500/40 bg-red-500/10 p-3 text-center font-['Press_Start_2P'] text-base text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && exercises.length === 0 && (search || muscle) && (
        <p className="border-2 border-dashed border-[#27272a] bg-[#0a0a0f] p-4 text-center font-['Press_Start_2P'] text-base text-[#a1a1aa]">
          No se encontraron ejercicios.
        </p>
      )}

      {!loading && !error && !search && !muscle && (
        <p className="border-2 border-dashed border-[#27272a] bg-[#0a0a0f] p-4 text-center font-['Press_Start_2P'] text-base text-[#a1a1aa]">
          Busca un ejercicio o selecciona un grupo muscular.
        </p>
      )}

      {!loading && !error && exercises.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
              aria-label="Paginacion de ejercicios"
              className="flex flex-wrap justify-center items-center gap-2"
            >
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 transition-colors"
              >
                ◀
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const active = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    aria-label={`Pagina ${p}`}
                    aria-current={active ? 'page' : undefined}
                    className={`min-w-[2rem] font-['Press_Start_2P'] text-[9px] tracking-widest border-2 px-2 py-2 transition-colors ${
                      active
                        ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                        : 'border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 transition-colors"
              >
                ▶
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};
