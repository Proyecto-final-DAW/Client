import type { Exercise } from '../../../../domain/models/Exercise';
import type { GetExercisesDTO } from '../dtos/GetExercisesDTO';

export class ExercisesFromDTO {
  static fromDTO(dto: GetExercisesDTO): Exercise {
    return {
      name: dto.name,
      gifUrl: dto.gifUrl,
      target: dto.target,
    };
  }

  static fromDTOList(dtos: GetExercisesDTO[]): Exercise[] {
    return dtos.map((dto) => ExercisesFromDTO.fromDTO(dto));
  }
}
