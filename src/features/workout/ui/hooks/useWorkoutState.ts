import { useEffect, useMemo, useState } from 'react';

import type { Routine } from '../../../routines/core/domain/models/Routine';
import type { WorkoutSet } from '../../core/domain/models/WorkoutSet';
import type { WorkoutStatus } from '../../core/domain/models/WorkoutStatus';

export const REST_PRESETS_SECONDS = [60, 90, 120, 180] as const;
export const DEFAULT_REST_SECONDS = 90;

export type WorkoutPayloadExercise = {
  exercise_api_id: string;
  name: string;
  type: 'strength';
  sets: WorkoutSet[];
};

const buildEmptySetsByExercise = (
  routine: Routine
): Record<string, WorkoutSet[]> =>
  routine.exercises.reduce<Record<string, WorkoutSet[]>>((acc, exercise) => {
    acc[exercise.id] = [];
    return acc;
  }, {});

export const useWorkoutState = (routine: Routine | null) => {
  const [status, setStatus] = useState<WorkoutStatus>('active');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSetsByExerciseId, setCompletedSetsByExerciseId] = useState<
    Record<string, WorkoutSet[]>
  >(() => (routine ? buildEmptySetsByExercise(routine) : {}));
  const [restDurationSeconds, setRestDurationSeconds] =
    useState<number>(DEFAULT_REST_SECONDS);
  const [restRemainingSeconds, setRestRemainingSeconds] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);

  // Inicializar el mapa de sets cuando llega la rutina (post-fetch)
  useEffect(() => {
    if (routine) {
      setCompletedSetsByExerciseId(buildEmptySetsByExercise(routine));
      setCurrentExerciseIndex(0);
      setStatus('active');
    }
  }, [routine]);

  // Tick del temporizador de descanso
  useEffect(() => {
    if (!isResting) return;

    const intervalId = setInterval(() => {
      setRestRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isResting]);

  // Auto-cierre del descanso al llegar a cero
  useEffect(() => {
    if (isResting && restRemainingSeconds === 0) {
      setIsResting(false);
    }
  }, [isResting, restRemainingSeconds]);

  const currentExercise = routine?.exercises[currentExerciseIndex] ?? null;
  const currentExerciseSets = currentExercise
    ? (completedSetsByExerciseId[currentExercise.id] ?? [])
    : [];

  const isFirstExercise = currentExerciseIndex === 0;
  const isLastExercise =
    routine !== null && currentExerciseIndex === routine.exercises.length - 1;

  const totalSets = useMemo(
    () =>
      Object.values(completedSetsByExerciseId).reduce(
        (sum, sets) => sum + sets.length,
        0
      ),
    [completedSetsByExerciseId]
  );

  const totalVolume = useMemo(
    () =>
      Object.values(completedSetsByExerciseId).reduce(
        (sum, sets) =>
          sum + sets.reduce((s, set) => s + set.reps * set.weight, 0),
        0
      ),
    [completedSetsByExerciseId]
  );

  const exercisesWithSetsCount = useMemo(
    () =>
      Object.values(completedSetsByExerciseId).filter((sets) => sets.length > 0)
        .length,
    [completedSetsByExerciseId]
  );

  const completeSet = (set: WorkoutSet) => {
    if (!currentExercise) return;
    setCompletedSetsByExerciseId((current) => ({
      ...current,
      [currentExercise.id]: [...(current[currentExercise.id] ?? []), set],
    }));
    setRestRemainingSeconds(restDurationSeconds);
    setIsResting(true);
  };

  const removeLastSet = () => {
    if (!currentExercise) return;
    setCompletedSetsByExerciseId((current) => {
      const sets = current[currentExercise.id] ?? [];
      if (sets.length === 0) return current;
      return {
        ...current,
        [currentExercise.id]: sets.slice(0, -1),
      };
    });
  };

  const nextExercise = () => {
    if (!routine) return;
    if (currentExerciseIndex >= routine.exercises.length - 1) return;
    setCurrentExerciseIndex((index) => index + 1);
    setIsResting(false);
  };

  const previousExercise = () => {
    if (currentExerciseIndex === 0) return;
    setCurrentExerciseIndex((index) => index - 1);
    setIsResting(false);
  };

  const startRest = (seconds: number = restDurationSeconds) => {
    setRestRemainingSeconds(seconds);
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestRemainingSeconds(0);
  };

  const setRestPreset = (seconds: number) => {
    setRestDurationSeconds(seconds);
    if (isResting) {
      setRestRemainingSeconds(seconds);
    }
  };

  const beginFinishing = () => {
    setStatus('finishing');
  };

  const markFinished = () => {
    setStatus('finished');
  };

  const cancelWorkout = () => {
    setStatus('cancelled');
  };

  const buildPayloadExercises = (): WorkoutPayloadExercise[] => {
    if (!routine) return [];
    return routine.exercises
      .map<WorkoutPayloadExercise>((exercise) => ({
        exercise_api_id: exercise.id,
        name: exercise.name,
        type: 'strength',
        sets: completedSetsByExerciseId[exercise.id] ?? [],
      }))
      .filter((exercise) => exercise.sets.length > 0);
  };

  return {
    status,
    currentExercise,
    currentExerciseIndex,
    currentExerciseSets,
    isFirstExercise,
    isLastExercise,
    totalSets,
    totalVolume,
    exercisesWithSetsCount,
    isResting,
    restRemainingSeconds,
    restDurationSeconds,
    completedSetsByExerciseId,
    completeSet,
    removeLastSet,
    nextExercise,
    previousExercise,
    startRest,
    skipRest,
    setRestPreset,
    beginFinishing,
    markFinished,
    cancelWorkout,
    buildPayloadExercises,
  };
};
