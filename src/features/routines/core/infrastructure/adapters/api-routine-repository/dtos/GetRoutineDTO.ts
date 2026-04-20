import type { Exercise } from '../../../../../../exercises/core/domain/models/Exercise';

export interface GetRoutineDTO {
  id: number;
  name: string;
  exercises: Exercise[];
}
