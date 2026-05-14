export interface GetStreakStatusDTO {
  currentStreak: number;
  sessionsThisWeek: number;
  sessionsRemaining: number;
  hoursRemaining: number;
  isAtRisk: boolean;
  target: number;
}
