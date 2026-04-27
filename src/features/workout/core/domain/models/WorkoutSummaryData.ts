export type UnlockedMilestonePreview = {
  id: number;
  name: string;
  description: string;
  icon: string;
};

export type WorkoutSummaryData = {
  totalVolume: number;
  totalSets: number;
  totalExercises: number;
  newMilestones: UnlockedMilestonePreview[];
};
