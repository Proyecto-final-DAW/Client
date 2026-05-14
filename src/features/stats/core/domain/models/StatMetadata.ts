/**
 * Stat metadata — pure data shared between the mapper (infrastructure
 * layer) and the UI. Lives in `core/domain/` so the inner hex ring
 * stays React-free; the icon binding is registered separately in
 * `stats/ui/StatIcons.tsx` and resolved by stat key at render time.
 *
 * The previous unified `StatConfig.tsx` carried the icons too, which
 * made the domain depend on `react` (the audit flagged this as the
 * one boundary leak in the codebase). Splitting the data out lets the
 * mapper stay in the inner ring while the UI keeps its rich icons.
 */

export interface StatMetadataEntry {
  /** Display name in Spanish (shown in the UI). */
  name: string;
  /**
   * Accent color applied only to the icon (identity per stat).
   * Bars are unified to green for visual calm — see StatBar.
   */
  accentColor: string;
  /**
   * One-sentence explanation surfaced as a tooltip on the StatBar so a
   * fitness novice can see what kind of training feeds each pillar
   * without leaving the panel.
   */
  description: string;
}

export const STAT_METADATA: Record<string, StatMetadataEntry> = {
  strength: {
    name: 'Fuerza',
    accentColor: '#f97316',
    description:
      'Sube con ejercicios de fuerza: pesos libres, maquinas, calistenia con carga.',
  },
  resistance: {
    name: 'Resistencia',
    accentColor: '#22c55e',
    description:
      'Sube con cardio sostenido: correr, bici, remo, sesiones largas.',
  },
  stamina: {
    name: 'Estamina',
    accentColor: '#ec4899',
    description:
      'Sube con ejercicios explosivos: pliometria, halterofilia, sprints.',
  },
  agility: {
    name: 'Agilidad',
    accentColor: '#3b82f6',
    description:
      'Sube con flexibilidad y movilidad: estiramientos, yoga, tecnica.',
  },
  tenacity: {
    name: 'Tenacidad',
    accentColor: '#a855f7',
    description: 'Sube por consistencia: cada dia seguido entrenando suma.',
  },
  vigor: {
    name: 'Vigor',
    accentColor: '#eab308',
    description: 'Sube con descanso, dieta y volumen total acumulado.',
  },
};

export const STAT_ORDER = [
  'strength',
  'resistance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
] as const;

/**
 * Server `endurance` ↔ client `resistance` bridge. The character /
 * stats domain on the server uses `endurance` (matches the BE DB
 * column `endurance_level`), but this metadata — the source of truth
 * for icons + accent colors — keys the same pillar under `resistance`
 * (the Spanish-localised display name "Resistencia" starts with R,
 * and renaming the key everywhere would touch every mapper).
 */
export const STAT_METADATA_KEY: Record<string, string> = {
  strength: 'strength',
  endurance: 'resistance',
  stamina: 'stamina',
  agility: 'agility',
  tenacity: 'tenacity',
  vigor: 'vigor',
};

export const statMetadataKeyFor = (statKey: string): string =>
  STAT_METADATA_KEY[statKey] ?? statKey;

export const statMetadataFor = (
  statKey: string
): StatMetadataEntry | undefined => STAT_METADATA[statMetadataKeyFor(statKey)];
