import type { WeeklySummary } from '../../domain/models/WeeklySummary';

export interface WeeklySummaryRepository {
  getWeeklySummary(): Promise<WeeklySummary>;
}
