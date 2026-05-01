import type {
  LegendaryClass,
  SpecializationClass,
  VocationClass,
} from '../../../../domain/models/CharacterClass';
import type {
  CharacterState,
  PendingChoice,
} from '../../../../domain/models/CharacterState';
import type {
  GetCharacterStateDTO,
  PendingChoiceDTO,
} from '../dtos/GetCharacterStateDTO';

const toPendingChoice = (dto: PendingChoiceDTO): PendingChoice => {
  if (dto.tier === 1) {
    return {
      tier: 1,
      options: dto.options as VocationClass[],
      recommendedId: dto.recommendedId,
    };
  }
  if (dto.tier === 2) {
    return {
      tier: 2,
      options: dto.options as SpecializationClass[],
      recommendedId: dto.recommendedId,
    };
  }
  return {
    tier: 3,
    options: dto.options as LegendaryClass[],
    recommendedId: dto.recommendedId,
  };
};

export class CharacterStateFromDTO {
  static fromDTO(dto: GetCharacterStateDTO): CharacterState {
    return {
      currentTier: dto.currentTier,
      heroLevel: dto.heroLevel,
      novice: dto.novice,
      vocation: dto.vocation,
      specialization: dto.specialization,
      legendary: dto.legendary,
      legendaryStage: dto.legendaryStage,
      isMaestroSupremo: dto.isMaestroSupremo,
      isLeyenda: dto.isLeyenda,
      pendingChoice: dto.pendingChoice
        ? toPendingChoice(dto.pendingChoice)
        : null,
    };
  }
}
