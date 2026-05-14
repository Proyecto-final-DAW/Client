/**
 * Visual config for the profile chips/badges that render the user's
 * onboarding selections (goals, equipment, level, etc.). Mapping each
 * enum value to an emoji + accent color turns plain text labels into
 * RPG-style badges without changing the underlying data.
 *
 * The emoji set is the same one used in the onboarding wizard so the
 * choices the user makes there are recognisable when they show up
 * here.
 */

export interface BadgeConfig {
  icon: string;
  /** Hex tint applied to the badge border, label color and a faint
   *  inner glow. Picked to roughly match the meaning of the value
   *  (red=intense/danger, green=health/growth, etc.). */
  color: string;
}

export const GOAL_BADGES: Record<string, BadgeConfig> = {
  LOSE_FAT: { icon: '🔥', color: '#ef4444' },
  GAIN_MUSCLE: { icon: '💪', color: '#22c55e' },
  MAINTAIN: { icon: '⚖️', color: '#3b82f6' },
  HEALTH: { icon: '❤️', color: '#a855f7' },
};

export const EXPERIENCE_BADGES: Record<string, BadgeConfig> = {
  BEGINNER: { icon: '⭐', color: '#22c55e' },
  INTERMEDIATE: { icon: '⭐⭐', color: '#eab308' },
  ADVANCED: { icon: '⭐⭐⭐', color: '#f97316' },
};

export const EQUIPMENT_BADGES: Record<string, BadgeConfig> = {
  FULL_GYM: { icon: '🏋', color: '#22c55e' },
  HOME_WEIGHTS: { icon: '🏠', color: '#3b82f6' },
  BODYWEIGHT: { icon: '🤸', color: '#eab308' },
};

export const ACTIVITY_BADGES: Record<string, BadgeConfig> = {
  SEDENTARY: { icon: '🪑', color: '#71717a' },
  LIGHT: { icon: '🚶', color: '#3b82f6' },
  MODERATE: { icon: '🏃', color: '#22c55e' },
  ACTIVE: { icon: '💪', color: '#eab308' },
  VERY_ACTIVE: { icon: '🔥', color: '#f97316' },
};

export const INJURY_BADGES: Record<string, BadgeConfig> = {
  NONE: { icon: '✅', color: '#22c55e' },
  KNEE: { icon: '🦵', color: '#eab308' },
  BACK: { icon: '🧍', color: '#eab308' },
  SHOULDER: { icon: '💪', color: '#eab308' },
  OTHER: { icon: '⚠️', color: '#f97316' },
};

export const SEX_BADGES: Record<string, BadgeConfig> = {
  MALE: { icon: '♂', color: '#3b82f6' },
  FEMALE: { icon: '♀', color: '#ec4899' },
  NON_BINARY: { icon: '◇', color: '#a855f7' },
};

export const DAYS_PER_WEEK_BADGES: Record<string, BadgeConfig> = {
  '2-3': { icon: '📅', color: '#3b82f6' },
  '4-5': { icon: '📅', color: '#22c55e' },
  '6+': { icon: '🔥', color: '#f97316' },
};
