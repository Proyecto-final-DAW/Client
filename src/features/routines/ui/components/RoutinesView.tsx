import { PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';
import { ConfirmDialog } from '../confirmDialog';
import { useRoutines } from '../hooks/useRoutines';

export const RoutinesView = (): React.JSX.Element | null => {
  const {
    routines,
    selectedRoutine,
    selectedRoutineId,
    newRoutineName,
    setNewRoutineName,
    loading,
    error,
    createRoutine,
    deleteRoutine,
    selectRoutine,
    removeExercise,
    addExerciseToRoutine,
  } = useRoutines();
  const [routineToDelete, setRoutineToDelete] = useState<number | null>(null);
  if (loading) {
    return <p className="p-6 text-gray-100">Cargando rutinas...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-400">{error}</p>;
  }

  return (
    <section className="min-h-screen text-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-400">Rutinas</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Tus entrenamientos
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Crea, organiza y reutiliza tus rutinas semanales.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Lista de rutinas</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Selecciona una rutina para ver sus ejercicios.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {routines.map((routine) => (
                <article
                  key={routine.id}
                  className={`rounded-2xl border bg-gray-950/70 p-4 transition ${
                    selectedRoutineId === routine.id
                      ? 'border-blue-500/60'
                      : 'border-gray-800 hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-100">
                        {routine.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {routine.exercises.length} ejercicios
                      </p>
                    </div>

                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                      Rutina
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setRoutineToDelete(routine.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Borrar
                    </button>

                    <button
                      onClick={() => selectRoutine(routine.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-gray-950 transition hover:bg-blue-400"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Usar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-gray-700 bg-gray-950/40 p-4">
              <p className="mb-3 text-sm font-medium text-gray-300">
                Crear nueva rutina
              </p>

              <label className="mb-2 block text-sm text-gray-400">
                Nombre de la rutina
              </label>

              <input
                type="text"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Ej. Torso / Full Body / Push Day"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-blue-500"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={createRoutine}
                  className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-blue-400"
                >
                  Guardar
                </button>

                <button
                  onClick={() => setNewRoutineName('')}
                  className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-400">
                  Rutina seleccionada
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {selectedRoutine?.name ?? 'Sin rutina seleccionada'}
                </h2>
              </div>

              <div className="space-y-3">
                {selectedRoutine?.exercises.map((exercise, index) => (
                  <article
                    key={exercise.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-blue-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-100">
                          {exercise.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    Buscar ejercicios
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Añadir ejercicio
                  </h2>
                </div>
              </div>

              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-700 bg-gray-950 px-4 py-3">
                <ExerciseSearch
                  onSelectExercise={(exercise) => {
                    if (!selectedRoutineId) return;
                    addExerciseToRoutine(selectedRoutineId, exercise);
                  }}
                />
              </div>
            </section>
            <ConfirmDialog
              open={routineToDelete !== null}
              title="Eliminar rutina"
              description="¿Seguro que quieres borrar esta rutina?"
              onCancel={() => setRoutineToDelete(null)}
              onConfirm={() => {
                if (routineToDelete === null) return;
                deleteRoutine(routineToDelete);
                setRoutineToDelete(null);
              }}
            />
          </main>
        </div>
      </div>
    </section>
  );
};
