/**
 * Server-emitted XP movement for a single stat. The post-session modal
 * uses these to render the bar animation: it positions the bar at
 * `beforeXp / before-threshold`, animates through any level-ups
 * (afterLevel - beforeLevel transitions), and lands at
 * `afterXp / after-threshold`. The `delta` shown next to the bar is the
 * raw XP earned post-cap.
 */
export interface SessionGainEntry {
  delta: number;
  beforeXp: number;
  beforeLevel: number;
  afterXp: number;
  afterLevel: number;
}

/**
 * Stat keys as emitted by the server (DB column names). The mapping to
 * client-side names (`endurance` → `resistance`) lives in the modal
 * since this is the only place these come in this form.
 */
export type SessionStatKey =
  | 'strength'
  | 'endurance'
  | 'stamina'
  | 'agility'
  | 'tenacity'
  | 'vigor';

export interface SessionGains {
  totalXp: number;
  streak: number;
  isToday: boolean;
  perStat: Record<SessionStatKey, SessionGainEntry>;
}
