import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Routine } from '../../../routines/core/domain/models/Routine';
import {
  findCardioActivity,
  type CardioActivity,
} from '../../core/domain/models/CardioActivity';
import type { WorkoutSet } from '../../core/domain/models/WorkoutSet';
import type { WorkoutStatus } from '../../core/domain/models/WorkoutStatus';

export const REST_PRESETS_SECONDS = [60, 90, 120, 180] as const;
export const DEFAULT_REST_SECONDS = 90;

/** Catalog exercises ride as 'strength' (the server overrides per-id);
 *  cardio log entries ride as 'cardio' / 'explosive' / 'stretch' and the
 *  server trusts the client's type because the id won't be in the
 *  catalog. */
export type WorkoutPayloadExerciseType =
  | 'strength'
  | 'cardio'
  | 'explosive'
  | 'stretch';

/**
 * Wire shape for a single set inside a session payload. The server
 * validator accepts `duration_seconds` only when the set comes from a
 * stretch / mobility exercise (reps may be 0 in that case); for
 * weighted / bodyweight cadence sets the field stays absent.
 */
export type WorkoutPayloadSet = {
  reps: number;
  weight: number;
  duration_seconds?: number;
};

export type WorkoutPayloadExercise = {
  exercise_api_id: string;
  name: string;
  type: WorkoutPayloadExerciseType;
  sets: WorkoutPayloadSet[];
  duration_minutes?: number;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  distance_km?: number;
};

const setToWire = (set: WorkoutSet): WorkoutPayloadSet => {
  if (set.durationSeconds !== undefined && set.durationSeconds !== null) {
    return {
      reps: set.reps,
      weight: set.weight,
      duration_seconds: set.durationSeconds,
    };
  }
  return { reps: set.reps, weight: set.weight };
};

type PersistedState = {
  currentExerciseIndex: number;
  completedSetsByExerciseId: Record<string, WorkoutSet[]>;
  restDurationSeconds: number;
  /** Optional cardio entry the user logged at the summary screen. Persisted
   *  so resuming a workout after a refresh keeps any partially-typed entry. */
  cardio?: CardioActivity | null;
};

const STORAGE_PREFIX = 'gymquest:workout:';
// Scope the key by user id so user A's in-progress workout never
// surfaces to user B on the same browser. Earlier the key was just
// `gymquest:workout:<routineId>`, and a sequence "user A starts a
// workout, logs out, user B logs in, opens the same routine id" would
// hand B user A's sets. Including userId makes the keys disjoint.
const storageKey = (userId: string | number, routineId: string) =>
  `${STORAGE_PREFIX}${userId}:${routineId}`;
const STORAGE_PREFIX_REGEX = /^gymquest:workout:/;

/** Wipe every persisted workout key. Called on logout to make sure
 *  the next user on the same browser gets a clean slate even if
 *  they happen to open a routine the previous user was working on. */
export const clearAllPersistedWorkouts = (): void => {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && STORAGE_PREFIX_REGEX.test(key)) toRemove.push(key);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
};

const loadPersisted = (
  userId: string | number,
  routineId: string
): PersistedState | null => {
  try {
    const raw = localStorage.getItem(storageKey(userId, routineId));
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
  const { user } = useAuth();
  // No persistence at all when there's no authenticated user — the
  // hook still works in-memory but won't write anything to
  // localStorage that another user could later read.
  const userKey = user?.id ?? null;

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
  const [cardio, setCardio] = useState<CardioActivity | null>(null);

  // Tracks whether the initial hydration from localStorage has happened for
  // the current routine. Save effects skip until this is true so they can't
  // overwrite a real persisted state with the empty default.
  const hydratedRef = useRef<boolean>(false);

  // Inicializar el mapa de sets cuando llega la rutina (post-fetch).
  // Si hay un estado persistido para esta rutina, lo restauramos.
  useEffect(() => {
    hydratedRef.current = false;
    if (!routine) return;

    const persisted = userKey ? loadPersisted(userKey, routine.id) : null;
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
      setCardio(persisted.cardio ?? null);
      setStatus('active');
      setResumed(true);
    } else {
      setCompletedSetsByExerciseId(buildEmptySetsByExercise(routine));
      setCurrentExerciseIndex(0);
      setRestDurationSeconds(DEFAULT_REST_SECONDS);
      setCardio(null);
      setStatus('active');
      setResumed(false);
    }

    hydratedRef.current = true;
  }, [routine, userKey]);

  // Persist on every relevant state change once hydrated. The rest timer
  // (isResting / restRemainingSeconds) is intentionally NOT persisted — when
  // the user resumes, they shouldn't land mid-countdown of a stale rest.
  useEffect(() => {
    if (!routine || !hydratedRef.current || !userKey) return;
    if (status !== 'active') return;
    try {
      const payload: PersistedState = {
        currentExerciseIndex,
        completedSetsByExerciseId,
        restDurationSeconds,
        cardio,
      };
      localStorage.setItem(
        storageKey(userKey, routine.id),
        JSON.stringify(payload)
      );
    } catch {
      // localStorage may be full or unavailable — silently skip; the in-memory
      // state still works for the current session.
    }
  }, [
    routine,
    userKey,
    status,
    currentExerciseIndex,
    completedSetsByExerciseId,
    restDurationSeconds,
    cardio,
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
    if (!routine || !userKey) return;
    try {
      localStorage.removeItem(storageKey(userKey, routine.id));
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
    const strengthEntries: WorkoutPayloadExercise[] = routine.exercises
      .map<WorkoutPayloadExercise>((exercise) => ({
        exercise_api_id: exercise.id,
        name: exercise.name,
        type: 'strength',
        sets: (completedSetsByExerciseId[exercise.id] ?? []).map(setToWire),
      }))
      .filter((exercise) => exercise.sets.length > 0);

    // Append the optional cardio log entry (HIIT, bike, yoga…) as an
    // extra session_exercise. Synthetic id `cardio:<ID>` so the server
    // skips the catalog lookup and trusts the client-provided type
    // (see resolveExerciseTypes on the server).
    if (cardio && cardio.durationMinutes > 0) {
      const meta = findCardioActivity(cardio.activityId);
      if (meta) {
        strengthEntries.push({
          exercise_api_id: `cardio:${cardio.activityId}`,
          name: meta.label,
          type: meta.statType,
          sets: [],
          duration_minutes: cardio.durationMinutes,
          intensity: cardio.intensity,
          ...(cardio.distanceKm !== undefined && cardio.distanceKm > 0
            ? { distance_km: cardio.distanceKm }
            : {}),
        });
      }
    }

    return strengthEntries;
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
    cardio,
    setCardio,
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
