import type { StatsRepository } from '../../../application/ports/StatsRepository';
import {
  STAT_METADATA,
  STAT_ORDER,
} from '../../../domain/models/StatMetadata';
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

    const pillar = STAT_ORDER.map((key) => ({
      key,
      name: STAT_METADATA[key].name,
      value: mockData[key].xp,
      // Mirror server's xpThresholdForLevel(level) = 100 + level * 15.
      // Keeping the mock in sync with the API mapper so the bars and
      // "X / Y XP" labels read consistently in dev.
      max: 100 + mockData[key].level * 15,
      level: mockData[key].level,
      accentColor: STAT_METADATA[key].accentColor,
      description: STAT_METADATA[key].description,
    }));

    const heroLevel = Math.round(
      pillar.reduce((sum, p) => sum + p.level, 0) / STAT_ORDER.length
    );

    return {
      pillar,
      level: heroLevel,
      title: 'Especialista',
    };
  }
}
