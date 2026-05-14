export interface StreakStatus {
  currentStreak: number;
  /** Sessions completed in the current ISO week. */
  sessionsThisWeek: number;
  /** Sessions still needed this week to qualify (0 if already met). */
  sessionsRemaining: number;
  /** Hours until the current ISO week closes (Sunday 23:59 UTC). */
  hoursRemaining: number;
  isAtRisk: boolean;
  /** Weekly target derived from `days_per_week`. */
  target: number;
}
