import { useEffect, useState } from 'react';

import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../core/domain/models/Routine';
import { useRoutineList } from './useRoutineList';

export const useRoutines = () => {
  const {
    routines: fetchedRoutines,
    loading,
    error,
    refetch,
  } = useRoutineList();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number>(0);
  const [newRoutineName, setNewRoutineName] = useState('');

  useEffect(() => {
    setRoutines(fetchedRoutines);

    if (fetchedRoutines.length > 0) {
      setSelectedRoutineId((currentSelectedId) => {
        const stillExists = fetchedRoutines.some(
          (routine) => routine.id === currentSelectedId
        );

        return stillExists ? currentSelectedId : fetchedRoutines[0].id;
      });
    } else {
      setSelectedRoutineId(0);
    }
  }, [fetchedRoutines]);

  const selectedRoutine =
    routines.find((routine) => routine.id === selectedRoutineId) ?? null;

  const selectRoutine = (routineId: number) => {
    setSelectedRoutineId(routineId);
  };

  const createRoutine = () => {
    const trimmedName = newRoutineName.trim();

    if (!trimmedName) return;

    const newRoutine: Routine = {
      id: Date.now(),
      name: trimmedName,
      exercises: [],
    };

    setRoutines((prev) => [...prev, newRoutine]);
    setSelectedRoutineId(newRoutine.id);
    setNewRoutineName('');
  };

  const deleteRoutine = (routineId: number) => {
    setRoutines((prev) => {
      const remainingRoutines = prev.filter(
        (routine) => routine.id !== routineId
      );

      if (routineId === selectedRoutineId) {
        setSelectedRoutineId(
          remainingRoutines.length > 0 ? remainingRoutines[0].id : 0
        );
      }

      return remainingRoutines;
    });
  };

  const addExerciseToRoutine = (routineId: number, exercise: Exercise) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;

        const alreadyExists = routine.exercises.some(
          (currentExercise) => currentExercise.id === exercise.id
        );

        if (alreadyExists) return routine;

        return {
          ...routine,
          exercises: [...routine.exercises, exercise],
        };
      })
    );
  };

  const removeExercise = (exerciseId: string) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === selectedRoutineId
          ? {
              ...routine,
              exercises: routine.exercises.filter(
                (exercise) => exercise.id !== exerciseId
              ),
            }
          : routine
      )
    );
  };

  const reorderExercises = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== selectedRoutineId) return routine;

        const reordered = [...routine.exercises];
        const [moved] = reordered.splice(fromIndex, 1);

        if (!moved) return routine;

        reordered.splice(toIndex, 0, moved);

        return {
          ...routine,
          exercises: reordered,
        };
      })
    );
  };

  return {
    routines,
    selectedRoutine,
    selectedRoutineId,
    newRoutineName,
    setNewRoutineName,
    loading,
    error,
    refetch,
    createRoutine,
    deleteRoutine,
    selectRoutine,
    removeExercise,
    reorderExercises,
    addExerciseToRoutine,
  };
};
