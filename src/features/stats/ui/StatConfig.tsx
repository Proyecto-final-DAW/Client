import {
  STAT_METADATA,
  STAT_ORDER as STAT_ORDER_DOMAIN,
  statMetadataFor,
  statMetadataKeyFor,
  type StatMetadataEntry,
} from '@features/stats/core/domain/models/StatMetadata';
import type { ComponentType, SVGProps } from 'react';

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

/*
 * Custom pixel-art icons. The whole UI is set in Press Start 2P / VT323
 * (pixel fonts), so rounded heroicons read as out-of-character — they
 * felt like generic SaaS chrome glued onto a retro game. Each glyph
 * here is hand-built from rects/paths in a chunky 24×24 grid so the
 * stat panel looks like an RPG character sheet, not a dashboard widget.
 *
 * Lives in `ui/` (not `core/domain/`) because React types belong on the
 * outer hex ring; the stat metadata (name/colour/description) lives in
 * `core/domain/StatMetadata.ts` and the mapper consumes only that.
 *
 * `currentColor` + `{...props}` lets the StatBar style the icon via
 * `className`/`style`, so accent colours and sizing live in the call
 * site rather than the icon definition.
 */

const SwordIcon: IconCmp = (props) => (
  // Bigger / chunkier than before: blade goes 6-wide × 11-tall (was
  // 4×9), crossguard 18-wide with tips poking out at the sides, and
  // the whole sword now reaches from y=2 to y=23 so it fills the
  // viewbox edge to edge. Previous version looked like a thin
  // toothpick next to the broader pixel-art shield/heart.
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="11" y="2" width="2" height="2" />
    <rect x="10" y="4" width="4" height="2" />
    <rect x="9" y="6" width="6" height="11" />
    <rect x="2" y="17" width="20" height="2" />
    <rect x="11" y="19" width="2" height="3" />
    <rect x="9" y="22" width="6" height="2" />
  </svg>
);

const ShieldIcon: IconCmp = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="4" y="3" width="16" height="2" />
    <rect x="3" y="5" width="18" height="6" />
    <rect x="4" y="11" width="16" height="3" />
    <rect x="5" y="14" width="14" height="2" />
    <rect x="7" y="16" width="10" height="2" />
    <rect x="9" y="18" width="6" height="2" />
    <rect x="11" y="20" width="2" height="2" />
  </svg>
);

const BoltIcon: IconCmp = (props) => (
  // Chunky 3-row staircase bolt with a wide horizontal "kink" in
  // the middle. Previous 2-row stripes read as parallel diagonals
  // (more "5" than ⚡); thicker steps + a 14-wide bridge make the
  // lightning silhouette obvious.
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="14" y="2" width="6" height="3" />
    <rect x="11" y="5" width="6" height="3" />
    <rect x="8" y="8" width="6" height="3" />
    <rect x="5" y="11" width="14" height="3" />
    <rect x="9" y="14" width="6" height="3" />
    <rect x="6" y="17" width="6" height="3" />
    <rect x="3" y="20" width="6" height="2" />
  </svg>
);

const FeatherIcon: IconCmp = (props) => (
  // Diagonal feather leaning top-right → bottom-left. Vanes peak
  // mid-height (rows y=9–11 are widest), then narrow into a 2-px
  // stem at the lower-left corner. The asymmetric slant gives the
  // glyph movement (wind/swoosh read as static stripes; a real
  // feather looks like it's mid-flight).
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="18" y="3" width="3" height="2" />
    <rect x="15" y="5" width="6" height="2" />
    <rect x="12" y="7" width="9" height="2" />
    <rect x="9" y="9" width="11" height="2" />
    <rect x="6" y="11" width="11" height="2" />
    <rect x="4" y="13" width="10" height="2" />
    <rect x="3" y="15" width="8" height="2" />
    <rect x="3" y="17" width="3" height="2" />
    <rect x="3" y="19" width="2" height="2" />
  </svg>
);

const DiamondIcon: IconCmp = (props) => (
  // Faceted gem silhouette: triangular crown, wide girdle (3 rows
  // wide so it reads as the table/widest point), then a stepped
  // pavilion that narrows to a 2-wide point at the bottom. Stat
  // metaphor: forged by constant pressure — the literal description
  // of tenacidad's progression copy.
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="6" y="3" width="12" height="2" />
    <rect x="4" y="5" width="16" height="2" />
    <rect x="2" y="7" width="20" height="3" />
    <rect x="3" y="10" width="18" height="2" />
    <rect x="5" y="12" width="14" height="2" />
    <rect x="7" y="14" width="10" height="2" />
    <rect x="9" y="16" width="6" height="2" />
    <rect x="11" y="18" width="2" height="2" />
  </svg>
);

const HeartIcon: IconCmp = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    shapeRendering="crispEdges"
    {...props}
  >
    <rect x="3" y="4" width="6" height="3" />
    <rect x="15" y="4" width="6" height="3" />
    <rect x="2" y="7" width="20" height="3" />
    <rect x="3" y="10" width="18" height="2" />
    <rect x="5" y="12" width="14" height="2" />
    <rect x="7" y="14" width="10" height="2" />
    <rect x="9" y="16" width="6" height="2" />
    <rect x="11" y="18" width="2" height="2" />
  </svg>
);

/** Icon registry keyed by the same stat keys used in StatMetadata. */
const STAT_ICONS: Record<string, IconCmp> = {
  strength: SwordIcon,
  resistance: ShieldIcon,
  stamina: BoltIcon,
  agility: FeatherIcon,
  tenacity: DiamondIcon,
  vigor: HeartIcon,
};

export type StatConfigEntry = StatMetadataEntry & {
  /** Pixel-art icon — same chunky style across all 6 stats. */
  icon: IconCmp;
};

/**
 * UI-side stat config: metadata + icon binding. Most components want
 * both, so we expose a single record that combines them. The mapper
 * (which lives in the infrastructure layer) imports `STAT_METADATA`
 * directly from the domain instead, to keep React out of the inner
 * hex ring.
 */
export const STAT_CONFIG: Record<string, StatConfigEntry> = Object.fromEntries(
  Object.entries(STAT_METADATA).map(([key, meta]) => {
    const icon = STAT_ICONS[key];
    if (!icon) {
      throw new Error(`StatConfig: missing icon for stat key "${key}"`);
    }
    return [key, { ...meta, icon }];
  })
);

export const STAT_ORDER = STAT_ORDER_DOMAIN;

export const statConfigFor = (statKey: string): StatConfigEntry | undefined =>
  STAT_CONFIG[statMetadataKeyFor(statKey)];

export const statConfigKeyFor = statMetadataKeyFor;

/** Lookup just the icon component for a stat key — used by callers
 *  that already have the metadata and only need the React binding. */
export const statIconFor = (statKey: string): IconCmp | undefined =>
  STAT_ICONS[statMetadataKeyFor(statKey)];

// Re-export the domain helpers so legacy callers can keep importing
// from here without learning two paths.
export { statMetadataFor };
