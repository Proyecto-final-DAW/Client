export interface WeeklyMetricsDTO {
  daysTrained: number;
  totalExercises: number;
  totalVolume: number;
}

export interface GetWeeklySummaryDTO {
  current: WeeklyMetricsDTO;
  previous: WeeklyMetricsDTO;
}
