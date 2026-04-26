export interface WeeklyMetrics {
  daysTrained: number;
  totalExercises: number;
  totalVolume: number;
}

export interface WeeklySummary {
  current: WeeklyMetrics;
  previous: WeeklyMetrics;
}
