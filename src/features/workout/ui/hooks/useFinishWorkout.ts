import axios from 'axios';
import { useState } from 'react';

import { API_BASE_URL } from '../../../../config/api';
import { useAuth } from '../../../../context/hooks/useAuth';
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
};

export const useFinishWorkout = () => {
  const { token } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedMilestones, setUnlockedMilestones] = useState<
    UnlockedMilestonePreview[]
  >([]);

  const finish = async (
    routineId: string,
    exercises: WorkoutPayloadExercise[]
  ): Promise<boolean> => {
    if (!token) {
      setError('Sesión no válida.');
      return false;
    }

    if (exercises.length === 0) {
      setError('Registra al menos un set para guardar la sesión.');
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
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al guardar la sesión.';
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { finish, saving, error, unlockedMilestones };
};
