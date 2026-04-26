import type { ConditionType } from '../../../../domain/models/Milestone';

export interface MilestoneDTO {
  id: number;
  name: string;
  description: string;
  condition_type: ConditionType;
  condition_value: number;
  icon: string;
}

export interface UnlockedMilestoneDTO extends MilestoneDTO {
  unlocked_at: string;
}

export type GetAllMilestonesDTO = MilestoneDTO[];
export type GetUnlockedMilestonesDTO = UnlockedMilestoneDTO[];
