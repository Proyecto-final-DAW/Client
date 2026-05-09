/**
 * Vigor pillar XP movement caused by a successful diet log. Mirrors
 * the per-stat shape used by the post-session modal so the same bar
 * animation can render here — only one pillar is involved (vigor),
 * so this is a single entry rather than a record.
 *
 * `null` is returned by the repo when the call was a no-op (already
 * logged today). The card uses null to suppress the popup.
 */
export interface DietLogGains {
  delta: number;
  beforeXp: number;
  beforeLevel: number;
  afterXp: number;
  afterLevel: number;
  /** Server-computed daily streak after this log, for the popup header. */
  streak: number;
}

export interface DietLogResult {
  state: import('./DietStreakState').DietStreakState;
  gains: DietLogGains | null;
}
