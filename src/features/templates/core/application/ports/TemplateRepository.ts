import type { RoutineTemplate } from '../../domain/models/RoutineTemplate';

export interface TemplateRepository {
  getAll(): Promise<RoutineTemplate[]>;
  getById(id: string): Promise<RoutineTemplate | null>;
}
