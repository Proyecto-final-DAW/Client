import type { Routine } from '../../domain/models/Routine';

export interface RoutineRepository {
  getRoutines(token: string): Promise<Routine[]>;
}
