/**
 * Domain types for the character class system. Mirrored from the server's
 * `src/data/classes.ts` — same identifiers, same shape.
 */

export type StatKey =
  | 'strength'
  | 'endurance'
  | 'stamina'
  | 'agility'
  | 'tenacity'
  | 'vigor';

export const STAT_KEYS: readonly StatKey[] = [
  'strength',
  'endurance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
] as const;

export type LinageId =
  | 'GUERRERO'
  | 'PALADIN'
  | 'CAZADOR'
  | 'PICARO'
  | 'MONJE'
  | 'DRUIDA';

export type ClassTierStage = 'NORMAL' | 'TRASCENDENTE';

export interface NoviceClass {
  id: 'ESCUDERO';
  tier: 0;
  name: string;
  frase: string;
}

export interface VocationClass {
  id: LinageId;
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
  linage: LinageId;
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
  trascendenteName: string;
  trascendenteFrase: string;
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
