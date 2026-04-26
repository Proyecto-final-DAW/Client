export type ExerciseType = 'strength' | 'cardio' | 'explosive' | 'stretch';

export interface SessionSet {
  reps: number;
  weight: number;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  type: ExerciseType;
  sets: SessionSet[];
}

export interface Session {
  id: number;
  exercises: SessionExercise[];
  createdAt: string;
}

export interface CreateSessionInput {
  exercises: SessionExercise[];
  date?: string;
}
