import type { ExerciseType } from '../../../../domain/models/Session';

export interface CreateSessionRequestDTO {
  exercises: {
    exerciseId: string;
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
      exerciseId: string;
      name: string;
      type: ExerciseType;
      sets: { reps: number; weight: number }[];
    }[];
    created_at: string;
  };
}
