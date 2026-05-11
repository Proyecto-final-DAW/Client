import { API_BASE_URL } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
import axios from 'axios';
import { useState } from 'react';

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

// Encoded into the synthetic `tpl-<bucket>-<slug>` id so the routine
// reader (RoutinesFromDTO.inferCategory) can resurrect the category
// when the bundled catalog has no match. Without this, every templated
// routine_exercises row reads as `category: 'strength'` and the
// SetLogger renders weight+reps even on stretch / mobility days.
const muscleGroupBucket = (muscleGroup: string): 'stretch' | 'cardio' | '' => {
  const normalized = muscleGroup.toLowerCase();
  if (normalized.includes('movilidad') || normalized.includes('estiramiento')) {
    return 'stretch';
  }
  if (normalized === 'cardio') return 'cardio';
  return '';
};

const buildExerciseApiId = (exercise: TemplateExercise): string => {
  const bucket = muscleGroupBucket(exercise.muscleGroup);
  const slug = slugify(exercise.name);
  return bucket ? `tpl-${bucket}-${slug}` : `tpl-${slug}`;
};

const toRoutineExercisePayload = (
  exercise: TemplateExercise,
  index: number
) => ({
  exercise_api_id: buildExerciseApiId(exercise),
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
      setError('Tu sesion ha caducado. Vuelve a iniciar sesion.');
      return false;
    }

    setApplying(true);
    setError(null);

    // Track the ids of routines created so far. If a later POST fails
    // (network blip, server 500), we fire compensating DELETEs in
    // reverse order so the user doesn't end up with half a template
    // applied — orphan "Dia 1" / "Dia 2" rows that they then have to
    // hunt down and delete by hand. Best-effort cleanup: if a delete
    // itself fails (rare) we still surface the original error.
    const createdRoutineIds: number[] = [];
    const auth = { headers: { Authorization: `Bearer ${token}` } } as const;

    try {
      for (let i = 0; i < template.routines.length; i++) {
        const routine = template.routines[i];
        const response = await axios.post<{ id: number }>(
          ROUTINES_URL,
          {
            name: buildRoutineName(routine.name, i),
            description: template.name,
            exercises: routine.exercises.map(toRoutineExercisePayload),
          },
          auth
        );
        if (response.data?.id != null) {
          createdRoutineIds.push(response.data.id);
        }
      }
      return true;
    } catch (err) {
      // Compensating rollback. We can't wrap this in a server-side
      // transaction (no atomic "apply template" endpoint exists), so
      // the cleanup is client-driven.
      for (const id of [...createdRoutineIds].reverse()) {
        try {
          await axios.delete(`${ROUTINES_URL}/${id}`, auth);
        } catch {
          // Swallow — the original error is the one the user needs to
          // see. A leftover orphan from a delete-failure is recoverable
          // manually; the alternative (drop the original error) is not.
        }
      }
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
