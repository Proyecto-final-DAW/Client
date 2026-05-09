import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PixelCorners } from '@shared/components/PixelCorners';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import { ExerciseSearch } from '../../../exercises/ui/components/ExerciseSearch';
import type { Routine } from '../../core/domain/models/Routine';
import { formatRoutineName } from '../formatRoutineName';
import { ExerciseRow } from './ExerciseRow';

type RoutineDetailProps = {
  routine: Routine | null;
  /**
   * True iff the user already saved a session today. Mirrors the
   * server's one-session-per-day rule (POST /sessions returns 409) so
   * the gate is communicated up-front rather than after the user has
   * logged every set and pressed save — the previous failure mode.
   */
  trainedToday?: boolean;
  onAddExercise: (exercise: Exercise) => void | Promise<void>;
  onRemoveExercise: (exerciseId: string) => void | Promise<void>;
  onMoveExercise?: (
    exerciseId: string,
    direction: 'up' | 'down'
  ) => void | Promise<void>;
  onDeleteRoutine: () => void;
};

export const RoutineDetail = ({
  routine,
  trainedToday = false,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onDeleteRoutine,
}: RoutineDetailProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);

  // Re-open the "AÑADIR EJERCICIO" panel every time the user enters edit
  // mode. Without this, collapsing it once and exiting edit would leave it
  // hidden on next entry, with no obvious way to add exercises.
  useEffect(() => {
    if (editing) setSearchOpen(true);
  }, [editing]);

  if (!routine) {
    return (
      <section className="relative border-2 border-border bg-card p-6 text-center">
        <PixelCorners size="md" className="border-green-500/30" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
          ◆ SIN SESION SELECCIONADA
        </p>
        <p className="mt-3 font-pixel text-base text-ink-muted">
          Selecciona una sesion arriba o crea una nueva.
        </p>
      </section>
    );
  }

  const exerciseCount = routine.exercises.length;
  const hasExercises = exerciseCount > 0;

  return (
    <section className="relative border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/60" />

      <header className="border-b-2 border-border pb-5">
        <div className="min-w-0">
          <p className="font-pixel text-[9px] tracking-widest text-green-500">
            ◆ SESION ACTIVA
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.5)] break-words">
            {formatRoutineName(routine).toUpperCase()}
          </h2>
          <p className="mt-2 font-pixel text-[10px] tracking-wider text-ink-muted">
            {exerciseCount} {exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}
          </p>
        </div>

        {hasExercises &&
          (trainedToday ? (
            <button
              type="button"
              disabled
              className="mt-4 w-full font-pixel text-[11px] tracking-widest bg-green-500/15 text-green-400/70 border-b-4 border-green-500/30 px-5 py-3.5 cursor-default inline-flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="h-4 w-4" />
              ENTRENO COMPLETADO HOY
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/workout/${routine.id}`)}
              className="mt-4 w-full font-pixel text-[11px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-[1.0625rem] transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
            >
              ▶ EMPEZAR SESION
            </button>
          ))}

        {/* Bumped from text-[8px] / py-2 (~28px tall) to text-[9px] /
            py-2.5 with thicker border so the touch target clears the
            ~36px floor. Also added gap-2.5 so the icon doesn't kiss
            the text on narrow viewports. */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className={`inline-flex items-center gap-2 font-pixel text-[9px] tracking-widest border-2 px-3 py-2.5 transition-colors ${
              editing
                ? 'border-green-500/60 bg-green-500/10 text-green-400'
                : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
            }`}
          >
            {editing ? (
              <>
                <XMarkIcon className="h-3.5 w-3.5" />
                CERRAR EDICION
              </>
            ) : (
              <>
                <PencilIcon className="h-3.5 w-3.5" />
                EDITAR
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onDeleteRoutine}
            className="inline-flex items-center gap-2 font-pixel text-[9px] tracking-widest border-2 border-border bg-card text-ink-muted px-3 py-2.5 hover:border-red-500/50 hover:text-red-400 transition-colors"
          >
            <TrashIcon className="h-3 w-3" />
            BORRAR
          </button>
        </div>
      </header>

      <div className="mt-5 space-y-2">
        {hasExercises ? (
          routine.exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              total={exerciseCount}
              editing={editing}
              onRemove={onRemoveExercise}
              onMove={onMoveExercise}
            />
          ))
        ) : (
          <p className="border-2 border-dashed border-border-muted bg-page p-4 text-center font-pixel text-base text-ink-muted">
            Esta rutina aun no tiene ejercicios. Pulsa "EDITAR" para añadir el
            primero.
          </p>
        )}
      </div>

      {editing && (
        <div className="mt-6 border-t-2 border-border pt-5">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            className="mb-3 flex w-full items-center justify-between gap-3 font-pixel text-[9px] tracking-widest text-green-500 transition-colors hover:text-green-400"
          >
            <span>{searchOpen ? '▾' : '▸'} AÑADIR EJERCICIO</span>
            <span className="font-pixel text-[8px] text-ink-muted">
              {searchOpen ? 'OCULTAR' : 'MOSTRAR'}
            </span>
          </button>
          {searchOpen && (
            <ExerciseSearch
              onSelectExercise={(exercise) => void onAddExercise(exercise)}
            />
          )}
        </div>
      )}
    </section>
  );
};
