import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { API_BASE_URL } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
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
  const [unlockedMilestones, setUnlockedMilestones] = useState<
    UnlockedMilestonePreview[]
  >([]);
  const [gains, setGains] = useState<SessionGains | null>(null);

  // useCallback so the LiveWorkoutView's useEffect deps (and any
  // memoized child) don't think `finish` is a new function on every
  // render. Token is the only meaningful dep — exercises/routineId
  // come in via arguments.
  const finish = useCallback(async (
    routineId: string,
    exercises: WorkoutPayloadExercise[]
  ): Promise<boolean> => {
    if (!token) {
      setError('Sesion no valida.');
      return false;
    }

    if (exercises.length === 0) {
      setError('Registra al menos un set para guardar la sesion.');
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await axios.post<RawSessionResponse>(
        SESSIONS_URL,
        {
          date: todayISO(),
          routine_id: parseRoutineId(routineId),
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

      // Notify any mounted hook that depends on session-derived data
      // so they refresh without a manual reload. Without these the
      // dashboard's "trained today" banner kept saying "no has
      // entrenado hoy" right after a save, and the stats panel kept
      // showing the pre-session XP/levels until the user navigated
      // away and back. Two events because the consumers are split:
      // session listings vs stats values.
      window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
      window.dispatchEvent(new Event(STATS_CHANGED_EVENT));
      return true;
    } catch (err) {
      // Surface the server's first validation issue (path + message) so a
      // 400 from validateBody is actually debuggable from the UI instead
      // of the generic axios "Request failed with status code 400".
      let message = 'Error al guardar la sesion.';
      if (err instanceof AxiosError) {
        const data = err.response?.data as
          | {
              message?: string;
              issues?: Array<{ path?: string; message?: string }>;
            }
          | undefined;
        const issue = data?.issues?.[0];
        if (issue) {
          message = `${data?.message ?? 'Datos invalidos'}: ${issue.path ?? ''} ${issue.message ?? ''}`.trim();
        } else if (data?.message) {
          message = data.message;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [token]);

  return { finish, saving, error, unlockedMilestones, gains };
};
