export interface ExerciseProgressPointDTO {
  date: string;
  max_weight: number;
  reps: number;
}

export type GetExerciseProgressDTO = ExerciseProgressPointDTO[];
