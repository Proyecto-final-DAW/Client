// src/features/stats/ui/adapter.ts

import type { StatsRepository } from '../core/application/ports/StatsRepository';
import { APIStatsRepository } from '../core/infrastructure/adapters/api-stats-repository/APIStatsRepository';
import { MockStatsRepository } from '../core/infrastructure/adapters/mock-stats-repository/MockStatsRepository';

const USE_MOCK = true; // Cambia a false cuando el backend tenga el endpoint listo

export const statsRepository: StatsRepository = USE_MOCK
  ? new MockStatsRepository()
  : new APIStatsRepository();
