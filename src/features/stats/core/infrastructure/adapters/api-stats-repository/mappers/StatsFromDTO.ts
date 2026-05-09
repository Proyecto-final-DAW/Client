import { STAT_CONFIG, STAT_ORDER } from '@features/stats/core/domain/models/StatConfig';
import type { StatPilar } from '@features/stats/core/domain/models/StatPilar';
import type { UserStats } from '@features/stats/core/domain/models/UserStats';
import type { GetStatsDTO } from '../dtos/GetStatsDTO';

/**
 * Mirrors the server's `xpThresholdForLevel` from
 * progression.service.ts (`100 + level * 15`). Hardcoding the
 * formula client-side keeps the bar fill and the "X / Y XP" label
 * accurate without a network round-trip; if the server formula
 * changes, both places need updating — the duplication is
 * intentional and noted at the server too. The previous flat 100 cap
 * over-filled the bar at low levels and under-filled at high ones.
 */
const xpThresholdForLevel = (level: number): number => 100 + level * 15;

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
    const pillar: StatPilar[] = STAT_ORDER.map((key) => {
      const config = STAT_CONFIG[key];
      const picker = STAT_PICKER[key];
      const level = picker.level(dto);
      return {
        name: config.name,
        value: picker.xp(dto),
        max: xpThresholdForLevel(level),
        level,
        icon: config.icon,
        accentColor: config.accentColor,
        description: config.description,
      };
    });

    const heroLevel = Math.round(
      pillar.reduce((sum, p) => sum + p.level, 0) / STAT_ORDER.length
    );

    return {
      pillar,
      level: heroLevel,
      title: titleFor(heroLevel),
    };
  }
}
