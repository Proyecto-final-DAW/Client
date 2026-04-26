import type { CreateSessionInput, Session } from '../../domain/models/Session';

export interface SessionRepository {
  createSession(input: CreateSessionInput): Promise<Session>;
}
