import { STAT_CONFIG, STAT_ORDER } from '../../../../domain/models/StatConfig';
import type { StatPilar } from '../../../../domain/models/StatPilar';
import type { UserStats } from '../../../../domain/models/UserStats';
import type { GetStatsDTO } from '../dtos/GetStatsDTO';

const XP_PER_LEVEL = 100;

/**
 * The stat config keys are the client-facing names (`strength`, `resistance`,
 * `stamina`, …). The server emits `endurance` instead of `resistance` (the
 * column name in DB), so we explicitly translate.
 */
const STAT_PICKER: Record<
  (typeof STAT_ORDER)[number],
  { xp: (dto: GetStatsDTO) => number; level: (dto: GetStatsDTO) => number }
> = {
  strength: { xp: (d) => d.strength, level: (d) => d.strength_level },
  resistance: { xp: (d) => d.endurance, level: (d) => d.endurance_level },
  stamina: { xp: (d) => d.stamina, level: (d) => d.stamina_level },
  agility: { xp: (d) => d.agility, level: (d) => d.agility_level },
  tenacity: { xp: (d) => d.tenacity, level: (d) => d.tenacity_level },
  vigor: { xp: (d) => d.vigor, level: (d) => d.vigor_level },
};

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
      const picker = STAT_PICKER[key];
      return {
        name: config.name,
        value: picker.xp(dto),
        max: XP_PER_LEVEL,
        level: picker.level(dto),
        icon: config.icon,
        colorVar: config.colorVar,
      };
    });

    const heroLevel = Math.round(
      pilpilar.reduce((sum, p) => sum + p.level, 0) / STAT_ORDER.length
    );

    return {
      pilpilar,
      level: heroLevel,
      title: titleFor(heroLevel),
    };
  }
}
