import { ExercisesFromDTO } from '../../../../../../exercises/core/infrastructure/adapters/api-exercise-repository/mappers/ExercisesFromDTO';
import type { Routine } from '../../../../domain/models/Routine';
import type { GetRoutineDTO } from '../dtos/GetRoutineDTO';

export class RoutinesFromDTO {
  static fromDTO(dto: GetRoutineDTO): Routine {
    return {
      id: dto.id,
      name: dto.name,
      exercises: ExercisesFromDTO.fromDTOList(dto.exercises),
    };
  }

  static fromDTOList(dtoList: GetRoutineDTO[]): Routine[] {
    return dtoList.map((dto) => this.fromDTO(dto));
  }
}
