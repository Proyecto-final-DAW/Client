import { useMemo, useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { EmptyState } from '../../../shared/components/EmptyState';
import { hasTrainedToday } from '../../../shared/utils/date';
import { useSessionHistory } from '../../sessionHistory/ui/hooks/useSessionHistory';
import { CreateRoutineForm } from './components/CreateRoutineForm';
import { RoutineDetail } from './components/RoutineDetail';
import { RoutinesHeader } from './components/RoutinesHeader';
import { RoutineSwitcher } from './components/RoutineSwitcher';
import { useRoutineExercises } from './hooks/useRoutineExercises';
import { useRoutines } from './hooks/useRoutines';

// Monday-anchored start of the current week, at 00:00 local time.
const startOfThisWeek = (): Date => {
  const d = new Date();
  const dayOfWeek = d.getDay(); // 0=Sun..6=Sat
  const offsetFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - offsetFromMonday);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const RoutinesView = (): React.JSX.Element => {
  const {
    routines,
    selectedRoutine,
    selectedRoutineId,
    loading,
    error,
    refetch,
    replaceRoutine,
    createRoutine,
    deleteRoutine,
    selectRoutine,
  } = useRoutines();

  const { sessions } = useSessionHistory();

  const doneThisWeekIds = useMemo<ReadonlySet<string>>(() => {
    if (!sessions) return new Set();
    const weekStart = startOfThisWeek();
    return new Set(
      sessions
        .filter((s) => s.routineId && s.date >= weekStart)
        .map((s) => String(s.routineId))
    );
  }, [sessions]);

  // Surface "ya entrenaste hoy" here too — the post-save 409 was
  // correct but a frustrating wall to hit AFTER logging every set, so
  // we gate the CTA up front. Same local-day comparison helper as
  // LiveWorkoutView's direct-URL guard.
  const trainedToday = useMemo<boolean>(
    () => (sessions ? hasTrainedToday(sessions) : false),
    [sessions]
  );

  const { addExercise, removeExercise, moveExercise } = useRoutineExercises({
    routine: selectedRoutine,
    onRoutineUpdated: replaceRoutine,
  });

  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={routines}
      onRetry={refetch}
      loadingLabel="CARGANDO SESIONES"
    >
      {(routines) => (
        <section className="text-ink">
          <div className="mx-auto max-w-5xl">
            <RoutinesHeader />

            {routines.length === 0 ? (
              <div className="space-y-4">
                <EmptyState
                  icon="⚔"
                  title="Sin sesiones"
                  description="Crea tu primera sesión o aplica una rutina entera."
                  cta={{
                    label: 'Crear sesión',
                    onClick: () => setCreating(true),
                  }}
                  secondaryCta={{
                    label: 'Ver rutinas',
                    to: '/templates',
                  }}
                />
                <CreateRoutineForm
                  open={creating}
                  onCreateRoutine={createRoutine}
                  onClose={() => setCreating(false)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <RoutineSwitcher
                  routines={routines}
                  selectedRoutineId={selectedRoutineId}
                  doneThisWeekIds={doneThisWeekIds}
                  onSelect={selectRoutine}
                  onCreateNew={() => setCreating(true)}
                />

                <CreateRoutineForm
                  open={creating}
                  onCreateRoutine={createRoutine}
                  onClose={() => setCreating(false)}
                />

                <RoutineDetail
                  routine={selectedRoutine}
                  trainedToday={trainedToday}
                  onAddExercise={addExercise}
                  onRemoveExercise={removeExercise}
                  onMoveExercise={moveExercise}
                  onDeleteRoutine={() =>
                    selectedRoutine && setRoutineToDelete(selectedRoutine.id)
                  }
                />
              </div>
            )}

            <ConfirmDialog
              open={routineToDelete !== null}
              title="Eliminar sesión"
              description="¿Seguro que quieres borrar esta sesión? Esta acción no se puede deshacer."
              onCancel={() => setRoutineToDelete(null)}
              onConfirm={() => {
                if (routineToDelete === null) return;
                void deleteRoutine(routineToDelete);
                setRoutineToDelete(null);
              }}
            />
          </div>
        </section>
      )}
    </AsyncState>
  );
};
