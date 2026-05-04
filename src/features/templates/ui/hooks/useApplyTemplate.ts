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

// Templates encode day labels inconsistently — some as "Dia A — Empuje",
// others as "Tren superior — Fuerza", others as bare "Push" or "Circuito A
// — Tren completo". We normalize all of them into a short, scannable form:
// "Dia N · <body part>" where N is the routine's 1-based position in the
// template and the body part is the meaningful descriptor with intro
// prefixes ("Dia A —", "Circuito A —") and methodology suffixes
// (" — Fuerza", " — Hipertrofia") stripped. The full template name lives in
// `description`, so the per-day label stays scannable.
const stripIntroPrefix = (name: string): string =>
  name
    .replace(/^(?:Dia|Circuito)\s+[A-Za-z0-9]+(?:\s*[—\-·:]\s*)?/i, '')
    .trim();

// Drop the methodology / variant suffix after the first " — ". Keeps "Tren
// inferior" out of "Tren inferior — Hipertrofia". Single-word names ("Push",
// "Empuje") are unaffected.
const stripMethodologySuffix = (name: string): string => {
  const idx = name.indexOf(' — ');
  return idx === -1 ? name : name.slice(0, idx).trim();
};

// "Tren superior A" → "Tren superior". Single trailing capital letter is
// almost always the variant marker the templates already used.
const stripVariantSuffix = (name: string): string =>
  name.replace(/\s+[A-Z]$/, '').trim();

const buildRoutineName = (routineName: string, index: number): string => {
  const cleaned = stripVariantSuffix(
    stripMethodologySuffix(stripIntroPrefix(routineName))
  );
  const dayNumber = index + 1;
  return cleaned ? `Dia ${dayNumber} · ${cleaned}` : `Dia ${dayNumber}`;
};

export const useApplyTemplate = () => {
  const { token } = useAuth();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async (template: RoutineTemplate): Promise<boolean> => {
    if (!token) {
      setError('Sesion no valida.');
      return false;
    }

    setApplying(true);
    setError(null);

    try {
      for (let i = 0; i < template.routines.length; i++) {
        const routine = template.routines[i];
        await axios.post(
          ROUTINES_URL,
          {
            name: buildRoutineName(routine.name, i),
            description: template.name,
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
