import type { Exercise } from '@features/exercises/core/domain/models/Exercise';
import type { Routine } from '@features/routines/core/domain/models/Routine';

import type {
  GetRoutineDTO,
  GetRoutineExerciseDTO,
} from '../dtos/GetRoutineDTO';

/**
 * Catalog-id prefixes encoded by `useApplyTemplate` so the SetLogger
 * can pick the right input mode without a routine_exercises schema
 * change. `tpl-stretch-...` came in to fix mobility days defaulting to
 * weight + reps because synthetic template ids never match the bundled
 * catalog (so server hydration falls back to `category: 'strength'`).
 */
const TEMPLATE_PREFIX_TO_CATEGORY: Array<{
  prefix: string;
  category: string;
}> = [
  { prefix: 'tpl-stretch-', category: 'stretching' },
  { prefix: 'tpl-cardio-', category: 'cardio' },
];

// Plank / hollow-hold / l-sit are isometric so they belong with stretch
// (duration-only logger) rather than weighted reps. The previous list
// missed them and "Front plank" rendered with kg + reps inputs.
const STRETCH_NAME_KEYWORDS = [
  'stretch',
  'rotation',
  'mobility',
  'movilidad',
  'estiramiento',
  'yoga',
  'cat-cow',
  'plank',
  'plancha',
  'hollow',
  'l-sit',
  'wall sit',
];

// Cardio names extended past the original walk/jog/run set. Templates
// reference treadmill / elliptical / rowing machines and the user's
// Spanish copy ("cinta", "eliptica", "bici", "remo", "comba") never
// matched the English-only list — every gym-cardio entry fell back to
// the weighted strength logger.
const CARDIO_NAME_KEYWORDS = [
  'walk',
  'caminar',
  'jog',
  'trote',
  'run ',
  'running',
  'correr',
  'cycling',
  'bicicleta',
  'bici',
  'treadmill',
  'cinta',
  'elliptical',
  'eliptica',
  'rowing',
  'remo',
  'jump rope',
  'comba',
  'saltar cuerda',
];

// Calisthenics names the user predictably hits with no equipment. Each
// keyword is specific enough to avoid catching a weighted variant
// (e.g. "bodyweight squat" / "jump squat" instead of bare "squat" which
// would mis-flag a barbell back squat).
const BODYWEIGHT_NAME_KEYWORDS = [
  'push-up',
  'pushup',
  'push up',
  'pull-up',
  'pullup',
  'pull up',
  'chin-up',
  'chinup',
  'sit-up',
  'situp',
  'bodyweight squat',
  'air squat',
  'jump squat',
  'split squat',
  'pistol squat',
  'lunge',
  'zancada',
  'burpee',
  'crunch',
  'abdominal',
  'mountain climber',
  'escalador',
  'glute bridge',
  'puente de gluteo',
  'jumping jack',
  'inverted row',
  'remo invertido',
  'pike push',
  'bear crawl',
  'handstand',
  'flutter kick',
  'leg raise',
  'bird dog',
  'superman',
];

/**
 * Best-effort category recovery for ids the server didn't hydrate
 * (synthetic template ids, custom routine entries, legacy rows). Drives
 * the live SetLogger's input mode only — XP classification still goes
 * through the server-side resolveExerciseTypes path.
 */
const inferCategory = (apiId: string, name: string): string => {
  for (const entry of TEMPLATE_PREFIX_TO_CATEGORY) {
    if (apiId.startsWith(entry.prefix)) return entry.category;
  }
  const haystack = name.toLowerCase();
  if (STRETCH_NAME_KEYWORDS.some((k) => haystack.includes(k))) {
    return 'stretching';
  }
  if (CARDIO_NAME_KEYWORDS.some((k) => haystack.includes(k))) return 'cardio';
  return '';
};

/**
 * Name-based bodyweight detector. Only runs when the server failed to
 * hydrate equipment from the catalog (template / custom / legacy
 * exercises). Returning 'body only' makes the SetLogger drop the
 * weight stepper for moves the user clearly does without a barbell —
 * the screenshot showed "Push-up" rendering a PESO (KG) input because
 * `tpl-push-up` doesn't resolve in the bundled dataset, so equipment
 * came back empty and the mode fell through to 'weighted'.
 */
const inferEquipment = (name: string): string => {
  const haystack = name.toLowerCase();
  if (BODYWEIGHT_NAME_KEYWORDS.some((k) => haystack.includes(k))) {
    return 'body only';
  }
  return '';
};

const toExercise = (dto: GetRoutineExerciseDTO): Exercise => {
  const fallbackCategory = inferCategory(
    dto.exercise_api_id,
    dto.exercise_name ?? ''
  );
  const fallbackEquipment = inferEquipment(dto.exercise_name ?? '');
  return {
    id: dto.exercise_api_id,
    name: dto.exercise_name ?? '',
    target: '',
    equipment:
      dto.equipment && dto.equipment !== ''
        ? dto.equipment
        : fallbackEquipment,
    difficulty: '',
    imageUrl: '',
    category:
      dto.category && dto.category !== '' ? dto.category : fallbackCategory,
    // Default to 3 sets when the routine_exercises row never had a
    // value (legacy rows, AÑADIR-EJERCICIO additions that didn't ask
    // the user for a set count). Without a default the live workout
    // can't warn the user about going over / under their prescription
    // — it just silently lets them log 6 sets of a 3-set move. A
    // conservative 3 matches the most common gym programming and
    // produces a sensible "SET 1 / 3" header even for legacy data.
    targetSets: dto.sets ?? 3,
  };
};

export class RoutinesFromDTO {
  static fromDTO(dto: GetRoutineDTO): Routine {
    return {
      id: String(dto.id),
      name: dto.name,
      description: dto.description,
      exercises: dto.exercises.map(toExercise),
    };
  }

  static fromDTOList(dtoList: GetRoutineDTO[]): Routine[] {
    return dtoList.map((dto) => this.fromDTO(dto));
  }
}
