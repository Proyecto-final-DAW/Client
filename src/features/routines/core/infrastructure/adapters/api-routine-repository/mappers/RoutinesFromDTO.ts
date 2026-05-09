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

const STRETCH_NAME_KEYWORDS = [
  'stretch',
  'rotation',
  'mobility',
  'movilidad',
  'yoga',
  'cat-cow',
];

const CARDIO_NAME_KEYWORDS = ['walk', 'jog', 'run ', 'running', 'cycling'];

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

const toExercise = (dto: GetRoutineExerciseDTO): Exercise => {
  const fallbackCategory = inferCategory(
    dto.exercise_api_id,
    dto.exercise_name ?? ''
  );
  return {
    id: dto.exercise_api_id,
    name: dto.exercise_name ?? '',
    target: '',
    equipment: dto.equipment ?? '',
    difficulty: '',
    imageUrl: '',
    category: dto.category && dto.category !== '' ? dto.category : fallbackCategory,
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
