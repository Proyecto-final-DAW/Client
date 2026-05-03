import type { StatsRepository } from '../../../application/ports/StatsRepository';
import { STAT_CONFIG, STAT_ORDER } from '../../../domain/models/StatConfig';
import type { UserStats } from '../../../domain/models/UserStats';

export class MockStatsRepository implements StatsRepository {
  async getStats(): Promise<UserStats> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Keys must match STAT_ORDER (English), not Spanish, otherwise the
    // lookup returns undefined and the bars render at 0.
    const mockValues: Record<(typeof STAT_ORDER)[number], number> = {
      strength: 24,
      resistance: 18,
      stamina: 22,
      agility: 14,
      tenacity: 12,
      vigor: 16,
    };

    return {
      pilpilar: STAT_ORDER.map((key) => ({
        name: STAT_CONFIG[key].name,
        value: mockValues[key],
        max: 99,
        icon: STAT_CONFIG[key].icon,
        colorVar: STAT_CONFIG[key].colorVar,
      })),
      level: 18,
      title: 'Especialista',
    };
  }
}
