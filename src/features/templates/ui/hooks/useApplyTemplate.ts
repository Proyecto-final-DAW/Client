import axios from 'axios';
import { useState } from 'react';

import { API_BASE_URL } from '../../../../config/api';
import { useAuth } from '../../../../context/hooks/useAuth';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import type { TemplateExercise } from '../../core/domain/models/TemplateExercise';

const ROUTINES_URL = `${API_BASE_URL}/routines`;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseReps = (reps: string): number | undefined => {
  const match = reps.match(/\d+/);
  if (!match) return undefined;
  const value = Number(match[0]);
  return Number.isInteger(value) && value > 0 ? value : undefined;
};

const toRoutineExercisePayload = (
  exercise: TemplateExercise,
  index: number
) => ({
  exercise_api_id: `tpl-${slugify(exercise.name)}`,
  exercise_name: exercise.name,
  sets: exercise.sets,
  reps: parseReps(exercise.reps),
  order_index: index,
});

export const useApplyTemplate = () => {
  const { token } = useAuth();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async (template: RoutineTemplate): Promise<boolean> => {
    if (!token) {
      setError('Sesión no válida.');
      return false;
    }

    setApplying(true);
    setError(null);

    try {
      for (const routine of template.routines) {
        await axios.post(
          ROUTINES_URL,
          {
            name: `${template.name} — ${routine.name}`,
            description: template.description,
            exercises: routine.exercises.map(toRoutineExercisePayload),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al crear las rutinas a partir de la plantilla.';
      setError(message);
      return false;
    } finally {
      setApplying(false);
    }
  };

  return { apply, applying, error };
};
