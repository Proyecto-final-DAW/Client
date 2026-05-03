import { createContext } from 'react';

import type {
  CharacterState,
  PendingChoiceTier,
} from '../features/character/core/domain/models/CharacterState';

export interface CharacterContextValue {
  state: CharacterState | null;
  loading: boolean;
  error: string | null;
  /** True if the user must complete onboarding before the character system is available. */
  requiresOnboarding: boolean;
  refetch: () => Promise<void>;
  /** Resolves to the new state on success, throws with the server message on failure. */
  chooseClass: (
    tier: PendingChoiceTier,
    classId: string
  ) => Promise<CharacterState>;
  choosing: boolean;
}

export const CharacterContext = createContext<
  CharacterContextValue | undefined
>(undefined);
