import { useEffect, useMemo, useRef, useState } from 'react';

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

type PersistedState = {
  currentExerciseIndex: number;
  completedSetsByExerciseId: Record<string, WorkoutSet[]>;
  restDurationSeconds: number;
};

const STORAGE_PREFIX = 'gymquest:workout:';
const storageKey = (routineId: string) => `${STORAGE_PREFIX}${routineId}`;

const loadPersisted = (routineId: string): PersistedState | null => {
  try {
    const raw = localStorage.getItem(storageKey(routineId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      typeof parsed.currentExerciseIndex !== 'number' ||
      typeof parsed.restDurationSeconds !== 'number' ||
      typeof parsed.completedSetsByExerciseId !== 'object'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
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
  const [resumed, setResumed] = useState<boolean>(false);

  // Tracks whether the initial hydration from localStorage has happened for
  // the current routine. Save effects skip until this is true so they can't
  // overwrite a real persisted state with the empty default.
  const hydratedRef = useRef<boolean>(false);

  // Inicializar el mapa de sets cuando llega la rutina (post-fetch).
  // Si hay un estado persistido para esta rutina, lo restauramos.
  useEffect(() => {
    hydratedRef.current = false;
    if (!routine) return;

    const persisted = loadPersisted(routine.id);
    if (persisted) {
      const empty = buildEmptySetsByExercise(routine);
      // Only keep sets for exercises that still exist in the routine — if the
      // routine was edited mid-workout, stale exercise IDs would be ignored.
      const merged: Record<string, WorkoutSet[]> = { ...empty };
      for (const id of Object.keys(persisted.completedSetsByExerciseId)) {
        if (id in merged) {
          merged[id] = persisted.completedSetsByExerciseId[id] ?? [];
        }
      }
      setCompletedSetsByExerciseId(merged);
      setCurrentExerciseIndex(
        Math.min(persisted.currentExerciseIndex, routine.exercises.length - 1)
      );
      setRestDurationSeconds(persisted.restDurationSeconds);
      setStatus('active');
      setResumed(true);
    } else {
      setCompletedSetsByExerciseId(buildEmptySetsByExercise(routine));
      setCurrentExerciseIndex(0);
      setRestDurationSeconds(DEFAULT_REST_SECONDS);
      setStatus('active');
      setResumed(false);
    }

    hydratedRef.current = true;
  }, [routine]);

  // Persist on every relevant state change once hydrated. The rest timer
  // (isResting / restRemainingSeconds) is intentionally NOT persisted — when
  // the user resumes, they shouldn't land mid-countdown of a stale rest.
  useEffect(() => {
    if (!routine || !hydratedRef.current) return;
    if (status !== 'active') return;
    try {
      const payload: PersistedState = {
        currentExerciseIndex,
        completedSetsByExerciseId,
        restDurationSeconds,
      };
      localStorage.setItem(storageKey(routine.id), JSON.stringify(payload));
    } catch {
      // localStorage may be full or unavailable — silently skip; the in-memory
      // state still works for the current session.
    }
  }, [
    routine,
    status,
    currentExerciseIndex,
    completedSetsByExerciseId,
    restDurationSeconds,
  ]);

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

  const clearPersisted = () => {
    if (!routine) return;
    try {
      localStorage.removeItem(storageKey(routine.id));
    } catch {
      // ignore
    }
  };

  const markFinished = () => {
    clearPersisted();
    setStatus('finished');
  };

  const cancelWorkout = () => {
    clearPersisted();
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
    resumed,
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
