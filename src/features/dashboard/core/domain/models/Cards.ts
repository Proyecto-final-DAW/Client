export interface Cards {
  streak: number;
  /** User's weekly training target (`days_per_week` floor, ≥1). */
  weeklyTarget: number;
  /** Distinct training days completed in the current ISO week. */
  sessionsThisWeek: number;
  lastWorkoutDaysAgo: number;
  trainingDays: string[];
}
