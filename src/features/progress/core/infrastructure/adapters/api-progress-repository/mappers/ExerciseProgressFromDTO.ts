import type { ExerciseProgressPoint } from '../../../../domain/models/ExerciseProgressPoint';
import type { GetExerciseProgressDTO } from '../dtos/GetExerciseProgressDTO';

export class ExerciseProgressFromDTO {
  static fromDTO(dto: GetExerciseProgressDTO): ExerciseProgressPoint[] {
    return dto.map((point) => ({
      date: point.date,
      maxWeight: point.max_weight,
      reps: point.reps,
    }));
  }
}
