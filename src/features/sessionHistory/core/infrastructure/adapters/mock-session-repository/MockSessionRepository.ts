import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';

export class MockSessionRepository implements SessionRepository {
  async getUserSessions(_token: string): Promise<Session[]> {
    return [
      {
        id: '1',
        userId: '1',
        routineId: '1',
        date: new Date('2026-04-20'),
        notes: 'Buen entreno',
        createdAt: new Date('2026-04-20T18:00:00'),
      },
      {
        id: '2',
        userId: '1',
        routineId: '2',
        date: new Date('2026-04-18'),
        notes: null,
        createdAt: new Date('2026-04-18T19:30:00'),
      },
      {
        id: '3',
        userId: '1',
        routineId: '3',
        date: new Date('2026-04-15'),
        notes: 'Pierna fuerte 💀',
        createdAt: new Date('2026-04-15T17:45:00'),
      },
    ];
  }
}
