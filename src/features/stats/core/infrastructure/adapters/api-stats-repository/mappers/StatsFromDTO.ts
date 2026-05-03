import { STAT_CONFIG, STAT_ORDER } from '../../../../domain/models/StatConfig';
import type { StatPilar } from '../../../../domain/models/StatPilar';
import type { UserStats } from '../../../../domain/models/UserStats';
import type { GetStatsDTO } from '../dtos/GetStatsDTO';

/**
 * The stat config keys are the client-facing names (`strength`, `resistance`,
 * `stamina`, …). The server emits `endurance` instead of `resistance` (the
 * column name in DB), so we explicitly translate.
 */
const STAT_LEVEL_PICKER: Record<
  (typeof STAT_ORDER)[number],
  (dto: GetStatsDTO) => number
> = {
  strength: (dto) => dto.strength_level,
  resistance: (dto) => dto.endurance_level,
  stamina: (dto) => dto.stamina_level,
  agility: (dto) => dto.agility_level,
  tenacity: (dto) => dto.tenacity_level,
  vigor: (dto) => dto.vigor_level,
};

const MAX_LEVEL = 99;

const titleFor = (level: number): string => {
  if (level >= 80) return 'Maestro Supremo';
  if (level >= 50) return 'Trascendente';
  if (level >= 25) return 'Legendario';
  if (level >= 15) return 'Especialista';
  if (level >= 5) return 'Iniciado';
  return 'Novato';
};

export class StatsFromDTO {
  static fromDTO(dto: GetStatsDTO): UserStats {
    const pilpilar: StatPilar[] = STAT_ORDER.map((key) => {
      const config = STAT_CONFIG[key];
      const value = STAT_LEVEL_PICKER[key](dto);
      return {
        name: config.name,
        value,
        max: MAX_LEVEL,
        icon: config.icon,
        colorVar: config.colorVar,
      };
    });

    const total = pilpilar.reduce((sum, p) => sum + p.value, 0);
    const level = Math.round(total / STAT_ORDER.length);

    return {
      pilpilar,
      level,
      title: titleFor(level),
    };
  }
}
