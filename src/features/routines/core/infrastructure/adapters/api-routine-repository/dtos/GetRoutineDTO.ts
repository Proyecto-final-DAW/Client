export interface GetRoutineExerciseDTO {
  id: number;
  routine_id: number;
  exercise_api_id: string;
  exercise_name: string | null;
  sets: number | null;
  reps: number | null;
  order_index: number | null;
  /** Hydrated server-side from the bundled catalog. Optional because
   *  legacy routine_exercises rows could exist without a catalog match. */
  category?: string;
  equipment?: string;
}

export interface GetRoutineDTO {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  exercises: GetRoutineExerciseDTO[];
}
