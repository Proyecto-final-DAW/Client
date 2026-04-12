import { Bars3Icon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { ExerciseSearch } from './features/exercises/ui/components/ExerciseSearch';

type Exercise = {
  id: number;
  name: string;
  muscle: string;
};

type Routine = {
  id: number;
  name: string;
  exercises: Exercise[];
};

const initialRoutines: Routine[] = [
  {
    id: 1,
    name: 'Push Day',
    exercises: [
      { id: 1, name: 'Press banca', muscle: 'Pecho' },
      { id: 2, name: 'Press inclinado mancuernas', muscle: 'Pecho' },
      { id: 3, name: 'Fondos', muscle: 'Tríceps' },
      { id: 4, name: 'Elevaciones laterales', muscle: 'Hombro' },
    ],
  },
  {
    id: 2,
    name: 'Pierna',
    exercises: [
      { id: 5, name: 'Sentadilla', muscle: 'Cuádriceps' },
      { id: 6, name: 'Prensa', muscle: 'Pierna' },
      { id: 7, name: 'Peso muerto rumano', muscle: 'Isquios' },
    ],
  },
  {
    id: 3,
    name: 'Espalda y bíceps',
    exercises: [
      { id: 8, name: 'Dominadas', muscle: 'Espalda' },
      { id: 9, name: 'Remo con barra', muscle: 'Espalda' },
      { id: 10, name: 'Curl bíceps', muscle: 'Bíceps' },
    ],
  },
];

export const Rutinas = (): React.JSX.Element => {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(
    initialRoutines[0].id
  );
  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>(
    initialRoutines[0].exercises
  );
  const [newRoutineName, setNewRoutineName] = useState('');

  const selectedRoutine =
    routines.find((routine) => routine.id === selectedRoutineId) ?? routines[0];

  const handleSelectRoutine = (routine: Routine) => {
    setSelectedRoutineId(routine.id);
    setVisibleExercises(routine.exercises);
  };

  const handleDeleteExercise = (exerciseId: number) => {
    setVisibleExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const handleDeleteRoutine = (id: number) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== id));
    if (id === selectedRoutineId) {
      const remaining = routines.filter((r) => r.id !== id);

      if (remaining.length > 0) {
        setSelectedRoutineId(remaining[0].id);
        setVisibleExercises(remaining[0].exercises);
      } else {
        setSelectedRoutineId(0);
        setVisibleExercises([]);
      }
    }
  };
  const handleCreateRoutine = () => {
    const trimmedName = newRoutineName.trim();

    if (!trimmedName) return;

    const newRoutine: Routine = {
      id: Date.now(),
      name: trimmedName,
      exercises: [],
    };

    setRoutines((prev) => [...prev, newRoutine]);
    setSelectedRoutineId(newRoutine.id);
    setVisibleExercises([]);
    setNewRoutineName('');
  };

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-400">Rutinas</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Tus entrenamientos
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Crea, organiza y reutiliza tus rutinas semanales.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Lista de rutinas</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Selecciona una rutina para ver sus ejercicios.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {routines.map((routine) => (
                <article
                  key={routine.id}
                  className={`rounded-2xl border bg-zinc-950/70 p-4 transition ${
                    selectedRoutineId === routine.id
                      ? 'border-emerald-500/60'
                      : 'border-zinc-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-100">
                        {routine.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {routine.exercises.length} ejercicios
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      Rutina
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        if (
                          confirm('¿Seguro que quieres borrar esta rutina?')
                        ) {
                          handleDeleteRoutine(routine.id);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Borrar
                    </button>

                    <button
                      onClick={() => handleSelectRoutine(routine)}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Usar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-4">
              <p className="mb-3 text-sm font-medium text-zinc-300">
                Crear nueva rutina
              </p>

              <label className="mb-2 block text-sm text-zinc-400">
                Nombre de la rutina
              </label>

              <input
                type="text"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Ej. Torso / Full Body / Push Day"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-500"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCreateRoutine}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  Guardar
                </button>

                <button
                  onClick={() => setNewRoutineName('')}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium text-emerald-400">
                  Rutina seleccionada
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {selectedRoutine.name}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Organiza los ejercicios, elimina los que no quieras y añade
                  nuevos desde el buscador.
                </p>
              </div>

              <div className="space-y-3">
                {visibleExercises.map((exercise, index) => (
                  <article
                    key={exercise.id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-emerald-400">
                        {index + 1}
                      </div>

                      <button className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
                        <Bars3Icon className="h-5 w-5" />
                      </button>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100">
                          {exercise.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {exercise.muscle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Buscar ejercicios
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Añadir ejercicio
                  </h2>
                </div>
              </div>

              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3">
                <ExerciseSearch />
              </div>
            </section>
          </main>
        </div>
      </div>
    </section>
  );
};
