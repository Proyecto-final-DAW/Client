import type { CharacterRepository } from '../core/application/ports/CharacterRepository';
import { APICharacterRepository } from '../core/infrastructure/adapters/api-character-repository/APICharacterRepository';
import { MockCharacterRepository } from '../core/infrastructure/adapters/mock-character-repository/MockCharacterRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APICharacterRepository(),
  mock: new MockCharacterRepository(),
};

export const characterRepository: CharacterRepository =
  ADAPTERS[ACTIVE_ADAPTER];
