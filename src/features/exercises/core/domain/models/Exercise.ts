export interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  difficulty: string;
  imageUrl: string;
  /**
   * Free-exercise-db classification used by the live workout to pick
   * inputs: `strength` / `powerlifting` / `strongman` → weight + reps,
   * `stretching` → duration, `cardio` / `plyometrics` /
   * `olympic weightlifting` → handled via the cardio entry. Empty when
   * the exercise didn't come from the catalog (custom routine entries
   * fall back to weight + reps).
   */
  category: string;
  /**
   * Routine-context-only. Prescribed sets coming from the
   * `routine_exercises.sets` row, surfaced in the live workout header
   * as "SET 1 / N" and used by the next-exercise confirmation to flag
   * an early skip or an over-prescribed run. Undefined for catalog
   * browse hits (which carry no per-routine prescription).
   */
  targetSets?: number;
}
