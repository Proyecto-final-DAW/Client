import type { CardsRepository } from '../core/application/ports/CardsRepository';
import type { WeeklySummaryRepository } from '../core/application/ports/WeeklySummaryRepository';
import { APICardsRepository } from '../core/infrastructure/adapters/api-cards-repository/APICardsRepository';
import { APIWeeklySummaryRepository } from '../core/infrastructure/adapters/api-weekly-summary-repository/APIWeeklySummaryRepository';
import { MockCardsRepository } from '../core/infrastructure/adapters/mock-cards-repository/MockCardsRepository';
import { MockWeeklySummaryRepository } from '../core/infrastructure/adapters/mock-weekly-summary-repository/MockWeeklySummaryRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const REPOSITORIES = {
  api: new APICardsRepository(),
  mock: new MockCardsRepository(),
};

export const WEEKLY_SUMMARY_REPOSITORIES = {
  api: new APIWeeklySummaryRepository(),
  mock: new MockWeeklySummaryRepository(),
};

export const cardsRepository: CardsRepository = REPOSITORIES[ACTIVE_ADAPTER];

export const weeklySummaryRepository: WeeklySummaryRepository =
  WEEKLY_SUMMARY_REPOSITORIES[ACTIVE_ADAPTER];
