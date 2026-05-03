import type { StatsRepository } from '../../../application/ports/StatsRepository';
import { STAT_CONFIG, STAT_ORDER } from '../../../domain/models/StatConfig';
import type { UserStats } from '../../../domain/models/UserStats';

export class MockStatsRepository implements StatsRepository {
  async getStats(): Promise<UserStats> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockValues: Record<string, number> = {
      fuerza: 88,
      resistencia: 78,
      estamina: 82,
      agilidad: 70,
      tenacidad: 60,
      vigor: 65,
    };

    return {
      pilpilar: STAT_ORDER.map((key) => ({
        name: STAT_CONFIG[key].name,
        value: mockValues[key],
        max: 100,
        icon: STAT_CONFIG[key].icon,
        colorVar: STAT_CONFIG[key].colorVar,
      })),
      level: 14,
      title: 'Caballero del Hierro',
    };
  }
}
