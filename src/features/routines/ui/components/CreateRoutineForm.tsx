import { useState } from 'react';

type CreateRoutineFormProps = {
  onCreateRoutine: (name: string) => void | Promise<void>;
};

export const CreateRoutineForm = ({
  onCreateRoutine,
}: CreateRoutineFormProps) => {
  const [newRoutineName, setNewRoutineName] = useState('');

  const handleCreateRoutine = async () => {
    const trimmedName = newRoutineName.trim();

    if (!trimmedName) return;

    await onCreateRoutine(trimmedName);
    setNewRoutineName('');
  };

  return (
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
        onChange={(event) => setNewRoutineName(event.target.value)}
        placeholder="Ej. Torso / Full Body / Push Day"
        className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-blue-500"
      />

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleCreateRoutine}
          className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-blue-400"
        >
          Guardar
        </button>

        <button
          type="button"
          onClick={() => setNewRoutineName('')}
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
