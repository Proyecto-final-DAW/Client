import { useState } from 'react';

import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import type {
  ExerciseType,
  SessionExercise,
  SessionSet,
} from '../../core/domain/models/Session';

export interface SessionExerciseDraft {
  exerciseId: string;
  name: string;
  type: ExerciseType;
  sets: SessionSet[];
}

const DEFAULT_TYPE: ExerciseType = 'strength';
const EMPTY_SET: SessionSet = { reps: 0, weight: 0 };

const todayISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const exerciseToDraft = (exercise: Exercise): SessionExerciseDraft => ({
  exerciseId: exercise.id,
  name: exercise.name,
  type: DEFAULT_TYPE,
  sets: [{ ...EMPTY_SET }],
});

export const useSessionForm = (initialExercises: Exercise[] = []) => {
  const [exercises, setExercises] = useState<SessionExerciseDraft[]>(() =>
    initialExercises.map(exerciseToDraft)
  );
  const [date, setDate] = useState<string>(todayISO);

  const addExercise = (exercise: Exercise) => {
    setExercises((current) => {
      const alreadyExists = current.some(
        (item) => item.exerciseId === exercise.id
      );
      if (alreadyExists) return current;

      return [...current, exerciseToDraft(exercise)];
    });
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((current) =>
      current.filter((item) => item.exerciseId !== exerciseId)
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((current) =>
      current.map((item) =>
        item.exerciseId === exerciseId
          ? { ...item, sets: [...item.sets, { ...EMPTY_SET }] }
          : item
      )
    );
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises((current) =>
      current.map((item) => {
        if (item.exerciseId !== exerciseId) return item;
        if (item.sets.length <= 1) return item;

        return {
          ...item,
          sets: item.sets.filter((_, index) => index !== setIndex),
        };
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setIndex: number,
    field: keyof SessionSet,
    value: number
  ) => {
    setExercises((current) =>
      current.map((item) => {
        if (item.exerciseId !== exerciseId) return item;

        return {
          ...item,
          sets: item.sets.map((set, index) =>
            index === setIndex ? { ...set, [field]: value } : set
          ),
        };
      })
    );
  };

  const reset = (nextExercises: Exercise[] = []) => {
    setExercises(nextExercises.map(exerciseToDraft));
    setDate(todayISO());
  };

  const validate = (): { valid: boolean; message?: string } => {
    if (exercises.length === 0) {
      return { valid: false, message: 'Añade al menos un ejercicio' };
    }

    for (const exercise of exercises) {
      if (exercise.sets.length === 0) {
        return {
          valid: false,
          message: `"${exercise.name}" no tiene series`,
        };
      }

      for (const set of exercise.sets) {
        if (!Number.isFinite(set.reps) || set.reps <= 0) {
          return {
            valid: false,
            message: `Las repeticiones de "${exercise.name}" deben ser mayores que 0`,
          };
        }

        if (!Number.isFinite(set.weight) || set.weight < 0) {
          return {
            valid: false,
            message: `El peso de "${exercise.name}" no puede ser negativo`,
          };
        }
      }
    }

    return { valid: true };
  };

  const toPayload = (): {
    exercises: SessionExercise[];
    date: string;
  } => ({
    date,
    exercises: exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      type: exercise.type,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
    })),
  });

  return {
    exercises,
    date,
    setDate,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    reset,
    validate,
    toPayload,
  };
};
