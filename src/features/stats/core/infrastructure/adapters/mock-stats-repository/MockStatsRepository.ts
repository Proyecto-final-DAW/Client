import type { StatsRepository } from '../../../application/ports/StatsRepository';
import { STAT_CONFIG, STAT_ORDER } from '../../../domain/models/StatConfig';
import type { UserStats } from '../../../domain/models/UserStats';

export class MockStatsRepository implements StatsRepository {
  async getStats(): Promise<UserStats> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockData: Record<
      (typeof STAT_ORDER)[number],
      { xp: number; level: number }
    > = {
      strength: { xp: 64, level: 18 },
      resistance: { xp: 22, level: 14 },
      stamina: { xp: 48, level: 16 },
      agility: { xp: 12, level: 10 },
      tenacity: { xp: 30, level: 8 },
      vigor: { xp: 70, level: 12 },
    };

    const pilpilar = STAT_ORDER.map((key) => ({
      name: STAT_CONFIG[key].name,
      value: mockData[key].xp,
      max: 100,
      level: mockData[key].level,
      icon: STAT_CONFIG[key].icon,
      colorVar: STAT_CONFIG[key].colorVar,
    }));

    const heroLevel = Math.round(
      pilpilar.reduce((sum, p) => sum + p.level, 0) / STAT_ORDER.length
    );

    return {
      pilpilar,
      level: heroLevel,
      title: 'Especialista',
    };
  }
}
