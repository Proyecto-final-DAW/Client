import { STAT_CONFIG, STAT_ORDER } from '../../../../domain/models/StatConfig';
import type { StatPilar } from '../../../../domain/models/StatPilar';
import type { UserStats } from '../../../../domain/models/UserStats';
import type { GetStatsDTO } from '../dtos/GetStatsDTO';

export class StatsFromDTO {
  static fromDTO(dto: GetStatsDTO): UserStats {
    const pilpilar: StatPilar[] = STAT_ORDER.map((key) => {
      const config = STAT_CONFIG[key];
      return {
        name: config.name,
        value: dto.stats[key],
        max: 100,
        icon: config.icon,
        colorVar: config.colorVar,
      };
    });

    return {
      pilpilar,
      level: dto.level,
      title: dto.title,
    };
  }
}
