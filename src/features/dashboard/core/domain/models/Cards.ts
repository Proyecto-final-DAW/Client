export interface Cards {
  streak: number;
  /** User's weekly training target (`days_per_week` floor, ≥1). */
  weeklyTarget: number;
  /** Distinct training days completed in the current ISO week. */
  sessionsThisWeek: number;
  /**
   * Days since the user's last training session. `null` for users
   * who have never trained — distinct from 0 ("trained today"). The
   * mapper used to coerce this to 0 with `?? 0`, which made a
   * brand-new user appear as if they had trained today; downstream
   * code now branches on `null` explicitly.
   */
  lastWorkoutDaysAgo: number | null;
  trainingDays: string[];
}
