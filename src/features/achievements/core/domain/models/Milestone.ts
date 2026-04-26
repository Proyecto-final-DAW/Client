export type ConditionType =
  | 'STAT_LEVEL'
  | 'STREAK'
  | 'TOTAL_SESSIONS'
  | 'TOTAL_WEIGHT';

export interface Milestone {
  id: number;
  name: string;
  description: string;
  conditionType: ConditionType;
  conditionValue: number;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}
