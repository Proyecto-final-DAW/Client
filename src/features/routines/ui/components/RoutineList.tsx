import type { Routine } from '../../core/domain/models/Routine';
import { CreateRoutineForm } from './CreateRoutineForm';
import { RoutineCard } from './RoutineCard';

type RoutineListProps = {
  routines: Routine[];
  selectedRoutineId: string;
  onCreateRoutine: (name: string) => void | Promise<void>;
  onSelectRoutine: (routineId: string) => void;
  onDeleteRoutine: (routineId: string) => void;
};

export const RoutineList = ({
  routines,
  selectedRoutineId,
  onCreateRoutine,
  onSelectRoutine,
  onDeleteRoutine,
}: RoutineListProps) => {
  return (
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
          <RoutineCard
            key={routine.id}
            routine={routine}
            isSelected={selectedRoutineId === routine.id}
            onSelect={onSelectRoutine}
            onDelete={onDeleteRoutine}
          />
        ))}
      </div>

      <CreateRoutineForm onCreateRoutine={onCreateRoutine} />
    </aside>
  );
};
