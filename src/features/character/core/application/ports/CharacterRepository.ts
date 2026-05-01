import type {
  CharacterState,
  PendingChoiceTier,
} from '../../domain/models/CharacterState';

export interface CharacterRepository {
  getState(token?: string): Promise<CharacterState>;
  chooseClass(
    tier: PendingChoiceTier,
    classId: string,
    token?: string
  ): Promise<CharacterState>;
}
