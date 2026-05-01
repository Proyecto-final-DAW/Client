import type { TemplateRepository } from '../../../application/ports/TemplateRepository';
import type { RoutineTemplate } from '../../../domain/models/RoutineTemplate';
import { TEMPLATES } from './templates';

export class MockTemplateRepository implements TemplateRepository {
  async getAll(): Promise<RoutineTemplate[]> {
    await this.delay();
    return TEMPLATES;
  }

  async getById(id: string): Promise<RoutineTemplate | null> {
    await this.delay();
    return TEMPLATES.find((template) => template.id === id) ?? null;
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
