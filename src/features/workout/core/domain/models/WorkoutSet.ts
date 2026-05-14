export type WorkoutSet = {
  reps: number;
  weight: number;
  /** Hold time for stretch / mobility sets. Null on cadence-based
   *  sets so reps stays the source of truth there. */
  durationSeconds?: number | null;
};
