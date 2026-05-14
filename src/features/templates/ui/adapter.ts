import type { TemplateRepository } from '../core/application/ports/TemplateRepository';
import { MockTemplateRepository } from '../core/infrastructure/adapters/mock-template-repository/MockTemplateRepository';

export const ACTIVE_ADAPTER: 'mock' = 'mock';

export const REPOSITORIES = {
  mock: new MockTemplateRepository(),
};

export const templateRepository: TemplateRepository =
  REPOSITORIES[ACTIVE_ADAPTER];
