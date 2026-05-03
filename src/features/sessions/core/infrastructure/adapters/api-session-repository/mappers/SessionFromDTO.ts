import type { Session } from '../../../../domain/models/Session';
import type { CreateSessionResponseDTO } from '../dtos/CreateSessionDTO';

export class SessionFromDTO {
  static fromDTO(dto: CreateSessionResponseDTO): Session {
    return {
      id: dto.session.id,
      exercises: dto.session.exercises.map((exercise) => ({
        exerciseId: exercise.exercise_api_id,
        name: exercise.name,
        type: exercise.type,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
        })),
      })),
      createdAt: dto.session.created_at,
    };
  }
}
