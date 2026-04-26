import type { Session } from '../../domain/models/Session';

export interface SessionRepository {
  getUserSessions(token?: string): Promise<Session[]>;
}
