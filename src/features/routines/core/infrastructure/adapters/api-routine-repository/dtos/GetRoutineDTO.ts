import type { GetExercisesDTO } from '../../../../../../exercises/core/infrastructure/adapters/api-exercise-repository/dtos/GetExercisesDTO';

export interface GetRoutineDTO {
  id: string;
  name: string;
  exercises: GetExercisesDTO[];
}
