import { useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ConfirmDialog } from './components/ConfirmDialog';
import { RoutineDetail } from './components/RoutineDetail';
import { RoutineList } from './components/RoutineList';
import { RoutinesHeader } from './components/RoutinesHeader';
import { useRoutineExercises } from './hooks/useRoutineExercises';
import { useRoutines } from './hooks/useRoutines';

export const RoutinesView = (): React.JSX.Element => {
  const {
    routines,
    selectedRoutine,
    selectedRoutineId,
    loading,
    error,
    refetch,
    createRoutine,
    deleteRoutine,
    selectRoutine,
  } = useRoutines();

  const { addExercise, removeExercise } = useRoutineExercises({
    routine: selectedRoutine,
    refetchRoutines: refetch,
  });

  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={routines}
      onRetry={refetch}
      loadingLabel="CARGANDO RUTINAS"
    >
      {(routines) => (
        <section className="min-h-screen text-gray-100">
          <div className="mx-auto max-w-7xl p-6">
            <RoutinesHeader />

            <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
              <RoutineList
                routines={routines}
                selectedRoutineId={selectedRoutineId}
                onCreateRoutine={createRoutine}
                onSelectRoutine={selectRoutine}
                onDeleteRoutine={setRoutineToDelete}
              />

              {routines.length === 0 ? (
                <EmptyState
                  icon="⚔"
                  title="Sin rutinas"
                  description="Crea tu primera rutina con el formulario de la izquierda."
                />
              ) : (
                <RoutineDetail
                  routine={selectedRoutine}
                  onAddExercise={addExercise}
                  onRemoveExercise={removeExercise}
                />
              )}
            </div>

            <ConfirmDialog
              open={routineToDelete !== null}
              title="Eliminar rutina"
              description="¿Seguro que quieres borrar esta rutina?"
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
