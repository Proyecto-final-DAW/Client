import type { UserInfo } from '../../../../../shared/core/domain/models/UserInfo';
import type { RoutineTemplate } from '../models/RoutineTemplate';

const DAYS_RANGE_MIDPOINT: Record<string, number> = {
  '2-3': 2.5,
  '4-5': 4.5,
  '6+': 6,
};

// Templates within this many days of the user's midpoint count as a match.
// 4-5 → midpoint 4.5 → templates with daysPerWeek 4 or 5 (delta ≤ 0.5).
const DAYS_TOLERANCE = 1;

export const hasRecommendableProfile = (user: UserInfo | null): boolean => {
  if (!user) return false;
  const hasEquipment = (user.equipment ?? []).length > 0;
  return Boolean(hasEquipment && user.experience_level);
};

const matchesDaysPreference = (
  template: RoutineTemplate,
  user: UserInfo
): boolean => {
  if (!user.days_per_week) return true;
  const midpoint = DAYS_RANGE_MIDPOINT[user.days_per_week];
  if (midpoint === undefined) return true;
  return Math.abs(template.daysPerWeek - midpoint) <= DAYS_TOLERANCE;
};

const LEVEL_RANK: Record<string, number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

const scoreTemplate = (template: RoutineTemplate, user: UserInfo): number => {
  let score = 0;

  if ((user.equipment ?? []).includes(template.equipment)) score += 5;
  if (user.goals && user.goals.includes(template.goal)) score += 3;

  // Level matching with directional penalty: a beginner getting an advanced
  // routine is much worse than the reverse (an advanced user can scale down
  // a beginner template easily, but a beginner pushed into an advanced plan
  // can hurt themselves). Mismatch by one tier loses fewer points than two.
  const userLevelRank = LEVEL_RANK[user.experience_level ?? ''];
  const templateLevelRank = LEVEL_RANK[template.level];
  if (userLevelRank !== undefined && templateLevelRank !== undefined) {
    const delta = templateLevelRank - userLevelRank;
    if (delta === 0) score += 6;
    else if (delta === 1) score -= 4;
    else if (delta >= 2) score -= 10;
    else if (delta === -1) score -= 1;
    else if (delta <= -2) score -= 3;
  }

  // Tie-break inside the days-tolerance window: prefer the closest day count.
  if (user.days_per_week) {
    const midpoint = DAYS_RANGE_MIDPOINT[user.days_per_week];
    if (midpoint !== undefined) {
      score -= Math.abs(template.daysPerWeek - midpoint);
    }
  }

  return score;
};

/**
 * Recommends templates ranked by goal/equipment/level match.
 *
 * `days_per_week` is treated as a hard filter: a template's daysPerWeek must
 * be within ±1 day of any user-selected range midpoint. Falls back to the
 * unfiltered list only if the days filter would leave nothing to suggest.
 */
export const recommendTemplates = (
  templates: RoutineTemplate[],
  user: UserInfo | null,
  limit: number = 3
): RoutineTemplate[] => {
  if (!hasRecommendableProfile(user) || !user) return [];

  const withinDays = templates.filter((t) => matchesDaysPreference(t, user));
  const pool = withinDays.length > 0 ? withinDays : templates;

  return [...pool]
    .map((template) => ({ template, score: scoreTemplate(template, user) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.template);
};
