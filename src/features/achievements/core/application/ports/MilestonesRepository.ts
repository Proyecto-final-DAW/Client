import type { Milestone } from '../../domain/models/Milestone';

export interface MilestonesRepository {
  getAllWithStatus(): Promise<Milestone[]>;
}
