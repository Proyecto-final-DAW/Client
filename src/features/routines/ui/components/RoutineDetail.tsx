import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';
import type { Routine } from '../../core/domain/models/Routine';
import { formatRoutineName } from '../formatRoutineName';
import { ExerciseRow } from './ExerciseRow';

type RoutineDetailProps = {
  routine: Routine | null;
  onAddExercise: (exercise: Exercise) => void | Promise<void>;
  onRemoveExercise: (exerciseId: string) => void | Promise<void>;
  onDeleteRoutine: () => void;
};

export const RoutineDetail = ({
  routine,
  onAddExercise,
  onRemoveExercise,
  onDeleteRoutine,
}: RoutineDetailProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  if (!routine) {
    return (
      <section className="relative border-2 border-[#1e1e2e] bg-[#0d0d14] p-6 text-center">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#a1a1aa]">
          ◆ SIN SESION SELECCIONADA
        </p>
        <p className="mt-3 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
          Selecciona una sesion arriba o crea una nueva.
        </p>
      </section>
    );
  }

  const exerciseCount = routine.exercises.length;
  const hasExercises = exerciseCount > 0;

  return (
    <section className="relative border-2 border-green-500/60 bg-[#0d0d14] p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/60" />

      <header className="flex flex-col gap-4 border-b-2 border-[#1e1e2e] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
            ◆ SESION ACTIVA
          </p>
          <h2 className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.5)] break-words">
            {formatRoutineName(routine).toUpperCase()}
          </h2>
          <p className="mt-2 font-['Press_Start_2P'] text-base text-[#a1a1aa]">
            {exerciseCount} {exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className={`inline-flex items-center justify-center gap-2 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 px-3 py-3 transition-colors ${
              editing
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/50 hover:text-green-400'
            }`}
          >
            {editing ? (
              <>
                <XMarkIcon className="h-3 w-3" />
                CERRAR
              </>
            ) : (
              <>
                <PencilIcon className="h-3 w-3" />
                EDITAR
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onDeleteRoutine}
            className="inline-flex items-center justify-center gap-2 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-red-500/40 bg-red-500/10 text-red-400 px-3 py-3 hover:bg-red-500/20 transition-colors"
          >
            <TrashIcon className="h-3 w-3" />
            BORRAR
          </button>
          {hasExercises && (
            <button
              type="button"
              onClick={() => navigate(`/workout/${routine.id}`)}
              className="font-['Press_Start_2P'] text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] whitespace-nowrap"
            >
              ▶ EMPEZAR SESION
            </button>
          )}
        </div>
      </header>

      <div className="mt-5 space-y-2">
        {hasExercises ? (
          routine.exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              editing={editing}
              onRemove={onRemoveExercise}
            />
          ))
        ) : (
          <p className="border-2 border-dashed border-[#27272a] bg-[#0a0a0f] p-4 text-center font-['Press_Start_2P'] text-base text-[#a1a1aa]">
            Esta rutina aun no tiene ejercicios. Pulsa "EDITAR" para añadir el
            primero.
          </p>
        )}
      </div>

      {editing && (
        <div className="mt-6 border-t-2 border-[#1e1e2e] pt-5">
          <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500 mb-3">
            ▸ AÑADIR EJERCICIO
          </p>
          <ExerciseSearch
            onSelectExercise={(exercise) => void onAddExercise(exercise)}
          />
        </div>
      )}
    </section>
  );
};
