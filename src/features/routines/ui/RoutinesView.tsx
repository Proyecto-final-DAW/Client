import { useState } from 'react';

import { ConfirmDialog } from './components/ConfirmDialog';
import { RoutineDetail } from './components/RoutineDetail';
import { RoutineList } from './components/RoutineList';
import { RoutinesHeader } from './components/RoutinesHeader';
import { useRoutineExercises } from './hooks/useRoutineExercises';
import { useRoutines } from './hooks/useRoutines';

export const RoutinesView = (): React.JSX.Element | null => {
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
    routineId: selectedRoutineId,
    refetchRoutines: refetch,
  });

  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);

  if (loading) {
    return <p className="p-6 text-gray-100">Cargando rutinas...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-400">{error}</p>;
  }

  return (
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

          <RoutineDetail
            routine={selectedRoutine}
            selectedRoutineId={selectedRoutineId}
            onAddExercise={addExercise}
            onRemoveExercise={removeExercise}
          />
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
  );
};
