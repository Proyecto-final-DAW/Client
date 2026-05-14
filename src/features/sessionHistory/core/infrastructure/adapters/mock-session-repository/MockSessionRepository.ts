import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';

export class MockSessionRepository implements SessionRepository {
  async getUserSessions(): Promise<Session[]> {
    // Match the API mapper exactly: the server has no `notes` column
    // on `sessions`, so SessionsFromDTO hardcodes `notes: null`. Mock
    // values like "Buen entreno" / "Pierna fuerte 💀" looked great in
    // dev and silently disappeared in prod — exactly the kind of
    // drift mocks should never have.
    return [
      {
        id: '1',
        userId: '1',
        routineId: '1',
        date: new Date('2026-04-20'),
        notes: null,
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
        notes: null,
        createdAt: new Date('2026-04-15T17:45:00'),
      },
    ];
  }
}
