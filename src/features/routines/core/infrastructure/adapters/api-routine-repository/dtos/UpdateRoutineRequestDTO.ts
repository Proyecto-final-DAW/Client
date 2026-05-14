export interface UpdateRoutineExerciseRequestDTO {
  exercise_api_id: string;
  exercise_name?: string | null;
  sets?: number | null;
  reps?: number | null;
  order_index?: number | null;
}

export interface UpdateRoutineRequestDTO {
  name?: string;
  description?: string | null;
  exercises?: UpdateRoutineExerciseRequestDTO[];
}
