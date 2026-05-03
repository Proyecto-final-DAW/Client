import type {
  CharacterState,
  PendingChoiceTier,
} from '../../domain/models/CharacterState';

export type CharacterStateOrOnboarding =
  | { kind: 'state'; state: CharacterState }
  | { kind: 'requiresOnboarding' };

export interface CharacterRepository {
  getState(): Promise<CharacterStateOrOnboarding>;
  chooseClass(
    tier: PendingChoiceTier,
    classId: string
  ): Promise<CharacterStateOrOnboarding>;
}
