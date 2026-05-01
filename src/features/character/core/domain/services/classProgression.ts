/**
 * Pure progression helpers — mirror of server's
 *   server/src/services/classProgression.service.ts
 *
 * Used client-side for preview calculations (e.g. showing the recommended
 * class in the modal without an extra round-trip).
 */

import type { LinageId, StatKey } from '../models/CharacterClass';
import { STAT_KEYS } from '../models/CharacterClass';
import type { Stats } from '../models/CharacterState';

export const heroLevel = (stats: Stats): number => {
  const allMaxed = STAT_KEYS.every((key) => stats[key] === 99);
  if (allMaxed) return 100;
  const sum = STAT_KEYS.reduce((acc, key) => acc + stats[key], 0);
  return Math.round(sum / 6);
};

export const minStat = (stats: Stats): number =>
  Math.min(...STAT_KEYS.map((key) => stats[key]));

const sortedStats = (stats: Stats): StatKey[] =>
  [...STAT_KEYS].sort((a, b) => stats[b] - stats[a]);

export const dominantStat = (stats: Stats): StatKey => sortedStats(stats)[0];

export const secondaryStat = (stats: Stats, excluding: StatKey): StatKey => {
  const ordered = sortedStats(stats);
  return ordered.find((key) => key !== excluding) ?? ordered[0];
};

// ───── Tier gate predicates ─────

export const meetsT1Gate = (stats: Stats): boolean =>
  STAT_KEYS.some((key) => stats[key] >= 5);

export const meetsT2Gate = (
  stats: Stats,
  dominant: StatKey,
  secondary: StatKey
): boolean => stats[dominant] >= 15 && stats[secondary] >= 10;

export const meetsT3Gate = (
  stats: Stats,
  dominant: StatKey,
  secondary: StatKey
): boolean =>
  heroLevel(stats) >= 25 && stats[dominant] >= 35 && stats[secondary] >= 22;

export const meetsT4Gate = (stats: Stats): boolean => minStat(stats) >= 50;

export const meetsT5Gate = (stats: Stats): boolean => minStat(stats) >= 80;

export const meetsT6Gate = (stats: Stats): boolean =>
  STAT_KEYS.every((key) => stats[key] === 99);

// ───── Re-export helpers used by callers ─────

export type { LinageId, StatKey };
