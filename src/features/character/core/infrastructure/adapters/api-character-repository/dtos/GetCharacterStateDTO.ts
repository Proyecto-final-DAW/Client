import type {
  ClassTierStage,
  LegendaryClass,
  NoviceClass,
  SpecializationClass,
  VocationClass,
} from '../../../../domain/models/CharacterClass';

export interface PendingChoiceDTO {
  tier: 1 | 2 | 3;
  options: VocationClass[] | SpecializationClass[] | LegendaryClass[];
  recommendedId: string;
}

export interface GetCharacterStateDTO {
  currentTier: number;
  heroLevel: number;
  novice: NoviceClass;
  vocation: VocationClass | null;
  specialization: SpecializationClass | null;
  legendary: LegendaryClass | null;
  legendaryStage: ClassTierStage;
  isMaestroSupremo: boolean;
  isLeyenda: boolean;
  pendingChoice: PendingChoiceDTO | null;
}
