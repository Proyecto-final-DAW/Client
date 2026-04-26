import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AddExercisePanel } from './components/AddExercisePanel';
import { SessionDatePicker } from './components/SessionDatePicker';
import { SessionExerciseCard } from './components/SessionExerciseCard';
import { SessionHeader } from './components/SessionHeader';
import { SessionToast } from './components/SessionToast';
import { useCreateSession } from './hooks/useCreateSession';
import { useRoutinePreload } from './hooks/useRoutinePreload';
import { useSessionForm } from './hooks/useSessionForm';

export const NewSessionView = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const routineId = searchParams.get('routineId');

  const {
    loading: loadingRoutine,
    error: routineError,
    routine,
    exercises: routineExercises,
  } = useRoutinePreload(routineId);

  const form = useSessionForm();
  const createSession = useCreateSession();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [preloaded, setPreloaded] = useState<boolean>(false);

  useEffect(() => {
    if (preloaded) return;
    if (loadingRoutine) return;
    if (routineExercises.length === 0) return;

    form.reset(routineExercises);
    setPreloaded(true);
  }, [loadingRoutine, routineExercises, preloaded, form]);

  const handleSave = async () => {
    setValidationError(null);

    const validation = form.validate();
    if (!validation.valid) {
      setValidationError(validation.message ?? 'Formulario inválido');
      return;
    }

    const payload = form.toPayload();
    const success = await createSession.submit(payload);

    if (success) {
      form.reset(routineId ? routineExercises : []);
      setPreloaded(routineId !== null);
    }
  };

  if (loadingRoutine) {
    return <p className="p-6 text-gray-100">Cargando rutina...</p>;
  }

  if (routineError) {
    return <p className="p-6 text-red-400">{routineError}</p>;
  }

  return (
    <section className="min-h-screen text-gray-100">
      <div className="mx-auto max-w-5xl p-6">
        <SessionHeader routineName={routine?.name} />

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm">
          <SessionDatePicker value={form.date} onChange={form.setDate} />
        </div>

        <div className="space-y-6">
          {form.exercises.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950/40 p-8 text-center text-sm text-gray-400">
              Aún no has añadido ejercicios. Búscalos abajo para empezar.
            </div>
          )}

          {form.exercises.map((exercise, index) => (
            <SessionExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              index={index}
              onAddSet={() => form.addSet(exercise.exerciseId)}
              onRemoveSet={(setIndex) =>
                form.removeSet(exercise.exerciseId, setIndex)
              }
              onUpdateSet={(setIndex, field, value) =>
                form.updateSet(exercise.exerciseId, setIndex, field, value)
              }
              onRemoveExercise={() => form.removeExercise(exercise.exerciseId)}
            />
          ))}
        </div>

        <div className="mt-6">
          <AddExercisePanel onSelectExercise={form.addExercise} />
        </div>

        {(validationError || createSession.error) && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {validationError ?? createSession.error}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={createSession.saving}
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createSession.saving ? 'Guardando...' : 'Guardar sesión'}
          </button>
        </div>
      </div>

      <SessionToast
        open={createSession.saved}
        message="Sesión guardada correctamente"
        onClose={createSession.dismiss}
      />
    </section>
  );
};
