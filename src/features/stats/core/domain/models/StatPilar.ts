/**
 * Six-stat character pillar — the runtime shape that StatBar / StatsPanel
 * consume. Domain-level: framework-free. The icon binding used to live
 * here as a React `ComponentType`, which leaked React into the inner
 * hexagonal ring; the binding now lives in `stats/ui/StatConfig.tsx`
 * and the renderer resolves it via the stat key (the StatPilar's `name`
 * + a key, or via the parent component which holds the key directly).
 */
export interface StatPilar {
  /**
   * Stable key (`strength`, `resistance`, `stamina`, ...). Used by the
   * UI to resolve the icon component without leaking React types into
   * the domain. Mirrors the keys in `StatMetadata.STAT_ORDER`.
   */
  key: string;
  /** Localised display name shown to the user (e.g. "Fuerza"). */
  name: string;
  /** Current XP within the level (0 → max). */
  value: number;
  /** XP needed to reach the next level. */
  max: number;
  /** Lifetime level (1 → 99). */
  level: number;
  /** Hex color used only for the stat's icon (identity). Bars use green. */
  accentColor: string;
  /** One-sentence explanation surfaced as a tooltip in StatBar. */
  description: string;
}
