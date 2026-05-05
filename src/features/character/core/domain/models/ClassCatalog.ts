import type {
  LegendaryClass,
  NoviceClass,
  SpecializationClass,
  VocationClass,
} from './CharacterClass';

/**
 * Full read-only class catalog returned by GET /character/catalog.
 *
 * Tiers 4 (TRANSCENDENT), 5 (MAESTRO_SUPREMO) and 6 (LEYENDA) are not
 * surfaced as standalone entries in the catalog: T4 is a stage upgrade of
 * each LegendaryClass (`transcendentName` field), and T5/T6 are singletons
 * derived from server flags. The class-tree view renders them as a fixed
 * tail beyond the catalog data.
 */
export interface ClassCatalog {
  novice: NoviceClass;
  vocations: readonly VocationClass[];
  specializations: readonly SpecializationClass[];
  legendaries: readonly LegendaryClass[];
}
