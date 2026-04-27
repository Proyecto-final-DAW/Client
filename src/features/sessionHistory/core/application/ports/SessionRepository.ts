import type { Session } from '../../domain/models/Session';

export interface SessionRepository {
  getUserSessions(): Promise<Session[]>;
}
