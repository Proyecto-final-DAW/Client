/**
 * Wire shape of `GET /users/stats`. Mirrors the flat row returned by
 * `statsService.findByUserId` — the column names match the DB schema, so
 * the mapper is responsible for translating to the camelCase domain.
 *
 * Each stat has both an XP value (0–99 within the current level) and a
 * lifetime LEVEL (1–99). The display surfaces the level.
 *
 * The streak / diet fields below were added by the May 2026 migrations
 * (`stats_diet_columns`, `stats_qualifying_week`) and are now mirrored
 * here so the DTO matches what the server actually serialises. Server
 * casts the date columns to text (see `stats.service.findByUserId`),
 * so they're calendar strings (`YYYY-MM-DD`) rather than ISO timestamps.
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
  /** ISO Monday of the most recent week the user hit `days_per_week`. */
  last_qualifying_week_monday?: string | null;
  diet_streak?: number;
  best_diet_streak?: number;
  /** YYYY-MM-DD string (cast to text server-side, see stats.service). */
  last_diet_date?: string | null;
  updated_at: string;
}
