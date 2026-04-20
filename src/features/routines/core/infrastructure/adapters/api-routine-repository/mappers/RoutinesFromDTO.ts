import type { Routine } from '../../../../domain/models/Routine';
import type { GetRoutineDTO } from '../dtos/GetRoutineDTO';

export class RoutineFromDTO {
  static fromDTO(dto: GetRoutineDTO): Routine {
    return {
      id: dto.id,
      name: dto.name,
      exercises: dto.exercises,
    };
  }

  static fromDTOList(dtoList: GetRoutineDTO[]): Routine[] {
    return dtoList.map((dto) => this.fromDTO(dto));
  }
}
