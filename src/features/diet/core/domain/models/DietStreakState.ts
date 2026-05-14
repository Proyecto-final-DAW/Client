/**
 * Snapshot of the user's diet-log streak as the server sees it.
 * `loggedToday` is the read-side answer to "should I render the
 * button enabled or disabled?" — derived from `lastDietDate` but
 * surfaced separately so the client doesn't have to redo the
 * date math.
 */
export interface DietStreakState {
  dietStreak: number;
  bestDietStreak: number;
  /** ISO `YYYY-MM-DD` of the last logged day, or null if never logged. */
  lastDietDate: string | null;
  loggedToday: boolean;
}
