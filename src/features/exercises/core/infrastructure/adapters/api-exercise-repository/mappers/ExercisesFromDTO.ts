import type { Exercise } from '@features/exercises/core/domain/models/Exercise';
import type { GetExercisesDTO } from '../dtos/GetExercisesDTO';

export class ExercisesFromDTO {
  static fromDTO(dto: GetExercisesDTO): Exercise {
    return {
      id: dto.id,
      name: dto.name,
      target: dto.target,
      equipment: dto.equipment,
      difficulty: dto.difficulty,
      imageUrl: dto.imageUrl,
      category: dto.category ?? '',
    };
  }

  static fromDTOList(dtos: GetExercisesDTO[]): Exercise[] {
    return dtos.map((dto) => ExercisesFromDTO.fromDTO(dto));
  }
}
