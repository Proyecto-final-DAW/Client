import { Pagination } from '@shared/components/Pagination';
import { PixelSelect } from '@shared/components/PixelSelect';

import type { Exercise } from '../../core/domain/models/Exercise';
import { MUSCLE_OPTIONS, useExerciseSearch } from '../hooks/useExerciseSearch';
import { ExerciseCard } from './ExerciseCard';

type ExerciseSearchProps = {
  onSelectExercise?: (exercise: Exercise) => void;
  /**
   * Catalog ids of exercises already in the target routine. Cards
   * matching one of these render the "AÑADIDO" inert state instead
   * of inviting another tap. Undefined or empty = picker mode (every
   * card is selectable).
   */
  addedIds?: ReadonlySet<string>;
};

const inputClass =
  'flex-1 bg-subtle border-2 border-border px-3 py-2.5 font-pixel text-[10px] text-ink placeholder:text-ink-disabled focus:border-green-500/70 focus:outline-none transition-colors';

export const ExerciseSearch = ({
  onSelectExercise,
  addedIds,
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
        {/* Native `<select>` was rendering with the browser default
            popup (white text on system blue) that completely broke the
            pixel-art aesthetic on demo. PixelSelect is the
            green-bordered drop-down used in the rest of the app
            (templates filters, etc.) — same component, same look. */}
        <PixelSelect
          value={muscle}
          options={MUSCLE_OPTIONS}
          placeholder="Todos"
          onChange={setMuscle}
          ariaLabel="Filtrar por grupo muscular"
          className="w-full sm:w-56"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <p className="border-2 border-red-500/40 bg-red-500/10 p-3 text-center font-pixel text-base text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && exercises.length === 0 && (search || muscle) && (
        <p className="border-2 border-dashed border-border-muted bg-page p-4 text-center font-pixel text-base text-ink-muted">
          No se encontraron ejercicios.
        </p>
      )}

      {!loading && !error && !search && !muscle && (
        <p className="border-2 border-dashed border-border-muted bg-page p-4 text-center font-pixel text-base text-ink-muted">
          Busca un ejercicio o selecciona un grupo muscular.
        </p>
      )}

      {!loading && !error && exercises.length > 0 && (
        <>
          {/* 2 cols on mobile (was 1 — a 9-card single column scrolled
              ~2000px). Cards self-cap at max-w-[260px] so the densest
              breakpoint still leaves white-space around each tile. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 sm:px-4 lg:grid-cols-4 lg:gap-8 lg:px-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={onSelectExercise}
                added={addedIds?.has(exercise.id)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
            ariaLabel="Paginacion de ejercicios"
          />
        </>
      )}
    </div>
  );
};
