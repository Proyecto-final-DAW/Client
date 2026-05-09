import type { PerformedExercise } from '@features/progress/core/domain/models/PerformedExercise';
import type { GetPerformedExercisesDTO } from '../dtos/GetPerformedExercisesDTO';

export class PerformedExercisesFromDTO {
  static fromDTO(dto: GetPerformedExercisesDTO): PerformedExercise[] {
    return dto.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }
}
