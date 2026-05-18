import { API_BASE_URL, API_ENDPOINTS } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
import { invalidateCache } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { SESSION_CHANGED_EVENT } from '../../../sessionHistory/ui/hooks/useSessionHistory';
import { STATS_CHANGED_EVENT } from '../../../stats/ui/hooks/useStats';
import type { SessionGains } from '../../core/domain/models/SessionGains';
import type { UnlockedMilestonePreview } from '../../core/domain/models/WorkoutSummaryData';
import type { WorkoutPayloadExercise } from './useWorkoutState';

const SESSIONS_URL = `${API_BASE_URL}/sessions`;

const todayISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseRoutineId = (id: string): number | null => {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

type RawSessionResponse = {
  newMilestones?: Array<{
    id: number;
    name: string;
    description: string;
    icon: string;
  }>;
  gains?: SessionGains;
};

export const useFinishWorkout = () => {
  const { token } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Stable server code (not the user-facing message) so the parent can
  // branch on the failure cause — chiefly to detect
  // `SESSION_ALREADY_LOGGED_TODAY` and discard the persisted workout
  // state (otherwise the orphaned sets reappear on next mount and the
  // user keeps retrying a save that can never succeed today).
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [unlockedMilestones, setUnlockedMilestones] = useState<
    UnlockedMilestonePreview[]
  >([]);
  const [gains, setGains] = useState<SessionGains | null>(null);

  // useCallback so the LiveWorkoutView's useEffect deps (and any
  // memoized child) don't think `finish` is a new function on every
  // render. Token is the only meaningful dep — exercises/routineId
  // come in via arguments.
  // Returns a structured result: `ok` for the happy path branch and
  // `code` so the caller can react to specific failures (e.g. wipe
  // the persisted workout on SESSION_ALREADY_LOGGED_TODAY) *in the
  // same tick*, without waiting for the next render that propagates
  // the `errorCode` state.
  const finish = useCallback(
    async (
      routineId: string,
      exercises: WorkoutPayloadExercise[]
    ): Promise<{ ok: boolean; code?: string }> => {
      if (!token) {
        setError('Tu sesion ha caducado. Vuelve a iniciar sesion.');
        return { ok: false };
      }

      if (exercises.length === 0) {
        setError('Registra al menos un set para guardar la sesion.');
        return { ok: false };
      }

      const numericRoutineId = parseRoutineId(routineId);
      if (numericRoutineId === null) {
        setError(
          'No hemos podido identificar tu rutina. Vuelve a la lista de rutinas y entra de nuevo.'
        );
        return { ok: false };
      }

      setSaving(true);
      setError(null);
      setErrorCode(null);

      try {
        const response = await axios.post<RawSessionResponse>(
          SESSIONS_URL,
          {
            date: todayISO(),
            routine_id: numericRoutineId,
            exercises,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const milestones = response.data.newMilestones ?? [];
        setUnlockedMilestones(
          milestones.map((milestone) => ({
            id: milestone.id,
            name: milestone.name,
            description: milestone.description,
            icon: milestone.icon,
          }))
        );
        setGains(response.data.gains ?? null);

        // A session save invalidates every cached read that derives
        // from `sessions` or `stats`. Bust them so the silent refetch
        // triggered by the events below pulls fresh data instead of
        // returning the pre-save snapshot from the in-memory cache.
        invalidateCache(API_ENDPOINTS.getStats);
        invalidateCache(API_ENDPOINTS.getStatsHistory);
        invalidateCache(API_ENDPOINTS.getDashboardCards);
        invalidateCache(API_ENDPOINTS.getWeeklySummary);
        invalidateCache(API_ENDPOINTS.getStreakStatus);
        invalidateCache(API_ENDPOINTS.getTrainingDays);
        invalidateCache(API_ENDPOINTS.getCharacterState);
        invalidateCache(API_ENDPOINTS.getSessionHistory);
        invalidateCache(API_ENDPOINTS.getMilestonesUnlocked);
        // Progress endpoints are URL-scoped by userId; drop the whole
        // `/progress/` prefix so both the list of performed exercises
        // and every per-exercise PR chart refetch on next mount of
        // /progress. Without this, the exercise the user just trained
        // wouldn't appear in the dropdown (if it was a new exercise)
        // and existing PRs wouldn't reflect the latest sets for 60s.
        invalidateCache(`${API_BASE_URL}/progress/`);

        // Notify any mounted hook that depends on session-derived data
        // so they refresh without a manual reload. Without these the
        // dashboard's "trained today" banner kept saying "no has
        // entrenado hoy" right after a save, and the stats panel kept
        // showing the pre-session XP/levels until the user navigated
        // away and back. Two events because the consumers are split:
        // session listings vs stats values.
        window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
        window.dispatchEvent(new Event(STATS_CHANGED_EVENT));
        return { ok: true };
      } catch (err) {
        // Map known server codes (SESSION_ALREADY_LOGGED_TODAY → "ya
        // entrenaste hoy", 429, 5xx, network) through the shared helper.
        // Zod path/message leaks ("body.exercises.0.sets.2.reps") used to
        // bubble up here verbatim — that's a developer signal, not user
        // copy. The catch-all is now a friendly Spanish sentence with a
        // recovery hint, matching the rest of the adapters.
        const fallback =
          err instanceof AxiosError && err.response?.status === 400
            ? 'No hemos podido guardar la sesion. Comprueba que el peso y las repeticiones son numeros validos.'
            : 'No hemos podido guardar la sesion. Comprueba tu conexion y vuelve a intentarlo.';
        setError(mapAxiosError(err, fallback));
        // Capture the stable server code so the parent can react to
        // specific failures (today is the only one that needs a
        // dedicated path — wipe the workout state instead of letting
        // the user retry the same save forever).
        let code: string | undefined;
        if (err instanceof AxiosError) {
          const raw = err.response?.data?.code;
          if (typeof raw === 'string') {
            code = raw;
            setErrorCode(raw);
          }
        }
        return { ok: false, code };
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  return { finish, saving, error, errorCode, unlockedMilestones, gains };
};
