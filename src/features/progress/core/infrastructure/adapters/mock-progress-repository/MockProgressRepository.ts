import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { Progress } from '../../../domain/models/Progress';

export class MockProgressRepository implements ProgressRepository {
  async getWeightHistory(
    _userId: string,
    _token?: string
  ): Promise<Progress[]> {
    return [
      {
        date: new Date('2026-04-01'),
        weight: '72',
      },
      {
        date: new Date('2026-04-05'),
        weight: '71.5',
      },
      {
        date: new Date('2026-04-10'),
        weight: '71',
      },
      {
        date: new Date('2026-04-15'),
        weight: '70.8',
      },
      {
        date: new Date('2026-04-20'),
        weight: '70.5',
      },
    ];
  }
}
