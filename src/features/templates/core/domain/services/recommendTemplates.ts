import type { UserInfo } from '../../../../../shared/core/domain/models/UserInfo';
import type { RoutineTemplate } from '../models/RoutineTemplate';

const DAYS_RANGE_MIDPOINT: Record<string, number> = {
  '2-3': 2.5,
  '4-5': 4.5,
  '6+': 6,
};

export const hasRecommendableProfile = (user: UserInfo | null): boolean => {
  if (!user) return false;
  return Boolean(user.equipment && user.experience_level);
};

const scoreTemplate = (template: RoutineTemplate, user: UserInfo): number => {
  let score = 0;

  if (template.equipment === user.equipment) score += 5;

  if (template.level === user.experience_level) score += 3;

  if (user.goals && user.goals.includes(template.goal)) score += 3;

  if (user.days_per_week) {
    const userMidpoint = DAYS_RANGE_MIDPOINT[user.days_per_week];
    if (userMidpoint !== undefined) {
      score -= Math.abs(template.daysPerWeek - userMidpoint);
    }
  }

  return score;
};

export const recommendTemplates = (
  templates: RoutineTemplate[],
  user: UserInfo | null,
  limit: number = 3
): RoutineTemplate[] => {
  if (!hasRecommendableProfile(user) || !user) return [];

  return [...templates]
    .map((template) => ({ template, score: scoreTemplate(template, user) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.template);
};
