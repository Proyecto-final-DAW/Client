import type { CardsRepository } from '../core/application/ports/CardsRepository';
import { APICardsRepository } from '../core/infrastructure/adapters/api-cards-repository/APICardsRepository';
import { MockCardsRepository } from '../core/infrastructure/adapters/mock-cards-repository/MockCardsRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const REPOSITORIES = {
  api: new APICardsRepository(),
  mock: new MockCardsRepository(),
};

export const cardsRepository: CardsRepository = REPOSITORIES[ACTIVE_ADAPTER];
