import type {
  ClassTierStage,
  LegendaryClass,
  NoviceClass,
  SpecializationClass,
  VocationClass,
} from './CharacterClass';

export type PendingChoiceTier = 1 | 2 | 3;

export type PendingChoice =
  | { tier: 1; options: readonly VocationClass[]; recommendedId: string }
  | { tier: 2; options: readonly SpecializationClass[]; recommendedId: string }
  | { tier: 3; options: readonly LegendaryClass[]; recommendedId: string };

export interface CharacterState {
  currentTier: number;
  heroLevel: number;
  novice: NoviceClass;
  vocation: VocationClass | null;
  specialization: SpecializationClass | null;
  legendary: LegendaryClass | null;
  legendaryStage: ClassTierStage;
  isMaestroSupremo: boolean;
  isLeyenda: boolean;
  pendingChoice: PendingChoice | null;
}

export interface Stats {
  strength: number;
  endurance: number;
  stamina: number;
  agility: number;
  tenacity: number;
  vigor: number;
}
