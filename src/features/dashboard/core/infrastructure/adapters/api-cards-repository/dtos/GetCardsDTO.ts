/**
 * Wire shape of `GET /users/cards`. Mirrors `cards.service.getCards` on the
 * server (last_workout_days_ago + training_days are pre-computed there).
 */
export interface GetCardsDTO {
  streak: number | null;
  weeklyTarget: number;
  sessionsThisWeek: number;
  lastWorkoutDaysAgo: number | null;
  trainingDays: string[];
}
