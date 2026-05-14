/**
 * Domain types for the character class system.
 *
 * The server is the single source of truth for the catalog (38 classes,
 * see `server/src/data/classes.ts`). The client receives the populated
 * vocation/specialization/legendary objects inside `GET /character/state`
 * and the choice options inside `pendingChoice.options`, so it does not
 * need to keep a local mirror of the catalog.
 */

export type StatKey =
  | 'strength'
  | 'endurance'
  | 'stamina'
  | 'agility'
  | 'tenacity'
  | 'vigor';

export const STAT_KEYS = [
  'strength',
  'endurance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
] as const satisfies readonly StatKey[];

export type LineageId =
  | 'GUERRERO'
  | 'PALADIN'
  | 'CAZADOR'
  | 'PICARO'
  | 'MONJE'
  | 'DRUIDA';

export type ClassTierStage = 'NORMAL' | 'TRANSCENDENT';

export type ClassTier = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface NoviceClass {
  id: 'ESCUDERO';
  tier: 0;
  name: string;
  frase: string;
}

export interface VocationClass {
  id: LineageId;
  tier: 1;
  name: string;
  frase: string;
  dominantStat: StatKey;
}

export interface SpecializationClass {
  id: string;
  tier: 2;
  name: string;
  frase: string;
  lineage: LineageId;
  secondaryStat: StatKey;
  legendaryOptions: readonly [string, string];
}

export interface LegendaryClass {
  id: string;
  tier: 3;
  name: string;
  frase: string;
  iconHint: string;
  requiredStats: readonly StatKey[];
  transcendentName: string;
  transcendentFrase: string;
}

export interface SupremoClass {
  id: 'MAESTRO_SUPREMO';
  tier: 5;
  name: string;
  frase: string;
}

export interface LeyendaClass {
  id: 'LEYENDA';
  tier: 6;
  name: string;
  frase: string;
}

export type CharacterClass =
  | NoviceClass
  | VocationClass
  | SpecializationClass
  | LegendaryClass
  | SupremoClass
  | LeyendaClass;
