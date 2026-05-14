import type {
  CharacterState,
  PendingChoiceTier,
} from '../../domain/models/CharacterState';
import type { ClassCatalog } from '../../domain/models/ClassCatalog';

export type CharacterStateOrOnboarding =
  | { kind: 'state'; state: CharacterState }
  | { kind: 'requiresOnboarding' };

export interface CharacterRepository {
  getState(): Promise<CharacterStateOrOnboarding>;
  chooseClass(
    tier: PendingChoiceTier,
    classId: string
  ): Promise<CharacterStateOrOnboarding>;
  /**
   * Returns the full read-only class catalog. Server response is identical
   * for every user and cached aggressively — fine to call once per session.
   */
  getCatalog(): Promise<ClassCatalog>;
}
