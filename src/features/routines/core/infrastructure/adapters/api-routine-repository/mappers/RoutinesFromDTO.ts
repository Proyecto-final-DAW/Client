import type { Exercise } from '../../../../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../../../domain/models/Routine';
import type {
  GetRoutineDTO,
  GetRoutineExerciseDTO,
} from '../dtos/GetRoutineDTO';

const toExercise = (dto: GetRoutineExerciseDTO): Exercise => ({
  id: dto.exercise_api_id,
  name: dto.exercise_name ?? '',
  target: '',
  equipment: '',
  difficulty: '',
  imageUrl: '',
});

export class RoutinesFromDTO {
  static fromDTO(dto: GetRoutineDTO): Routine {
    return {
      id: String(dto.id),
      name: dto.name,
      exercises: dto.exercises.map(toExercise),
    };
  }

  static fromDTOList(dtoList: GetRoutineDTO[]): Routine[] {
    return dtoList.map((dto) => this.fromDTO(dto));
  }
}
