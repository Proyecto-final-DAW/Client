import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type {
  CreateSessionInput,
  Session,
} from '../../../domain/models/Session';

export class MockSessionRepository implements SessionRepository {
  private nextId = 1;

  async createSession(input: CreateSessionInput): Promise<Session> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const createdAt = input.date
      ? new Date(input.date).toISOString()
      : new Date().toISOString();

    return {
      id: this.nextId++,
      exercises: input.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        type: exercise.type,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
        })),
      })),
      createdAt,
    };
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
}
