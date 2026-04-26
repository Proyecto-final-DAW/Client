import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type {
  Progress,
  RegisterWeightInput,
} from '../../../domain/models/Progress';

const SEED_HISTORY: Progress[] = [
  { date: new Date('2026-04-01'), weight: 72 },
  { date: new Date('2026-04-05'), weight: 71.5 },
  { date: new Date('2026-04-10'), weight: 71 },
  { date: new Date('2026-04-15'), weight: 70.8 },
  { date: new Date('2026-04-20'), weight: 70.5 },
];

export class MockProgressRepository implements ProgressRepository {
  private history: Progress[] = structuredClone(SEED_HISTORY);

  async getWeightHistory(
    _userId: number,
    _token?: string
  ): Promise<Progress[]> {
    await this.delay();

    return structuredClone(this.history);
  }

  async registerWeight(
    _userId: number,
    input: RegisterWeightInput,
    _token?: string
  ): Promise<Progress> {
    await this.delay();

    const entry: Progress = {
      date: new Date(input.date),
      weight: input.weight,
    };

    this.history = [...this.history, entry];

    return structuredClone(entry);
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
