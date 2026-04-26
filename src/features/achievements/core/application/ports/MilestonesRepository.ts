import type { Milestone } from '../../domain/models/Milestone';

export interface MilestonesRepository {
  getAllWithStatus(token: string): Promise<Milestone[]>;
}
