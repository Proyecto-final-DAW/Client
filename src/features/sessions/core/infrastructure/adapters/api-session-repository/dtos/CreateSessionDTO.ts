import type { ExerciseType } from '../../../../domain/models/Session';

/**
 * Wire shape of `POST /sessions`. Field names mirror the server contract
 * (`exercise_api_id`, `created_at`) — the mapper translates to the camelCase
 * domain model.
 */
export interface CreateSessionRequestDTO {
  exercises: {
    exercise_api_id: string;
    name: string;
    type: ExerciseType;
    sets: { reps: number; weight: number }[];
  }[];
  date?: string;
}

export interface CreateSessionResponseDTO {
  session: {
    id: number;
    user_id: number;
    exercises: {
      exercise_api_id: string;
      name: string;
      type: ExerciseType;
      sets: { reps: number; weight: number }[];
    }[];
    created_at: string;
  };
}
