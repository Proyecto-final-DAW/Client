/**
 * Wire shape of `GET /users/stats`. Mirrors the flat row returned by
 * `statsService.findByUserId` — the column names match the DB schema, so
 * the mapper is responsible for translating to the camelCase domain.
 *
 * Each stat has both an XP value (0–99 within the current level) and a
 * lifetime LEVEL (1–99). The display surfaces the level.
 */
export interface GetStatsDTO {
  id: number;
  user_id: number;
  strength: number;
  endurance: number;
  stamina: number;
  agility: number;
  tenacity: number;
  vigor: number;
  strength_level: number;
  endurance_level: number;
  stamina_level: number;
  agility_level: number;
  tenacity_level: number;
  vigor_level: number;
  streak: number;
  best_streak: number;
  last_session_date: string | null;
  updated_at: string;
}
