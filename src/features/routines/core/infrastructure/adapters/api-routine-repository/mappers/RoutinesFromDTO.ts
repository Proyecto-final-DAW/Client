import type { Routine } from '../../../../domain/models/Routine';
import type { GetRoutineDTO } from '../dtos/GetRoutineDTO';
import type { GetRoutineExercisesDTO } from '../dtos/GetRoutineExercisesDTO';

export class RoutineFromDTO {
  static fromDTO(dto: GetRoutineDTO): Routine {
    return {
      id: dto.id,
      name: dto.name,
      exercises: (dto.exercises as unknown as GetRoutineExercisesDTO[]).map(
        (exerciseDto) => ({
          id: exerciseDto.id,
          name: exerciseDto.exercise_name,
        })
      ),
    };
  }

  static fromDTOList(dtoList: GetRoutineDTO[]): Routine[] {
    return dtoList.map((dto) => this.fromDTO(dto));
  }
}
