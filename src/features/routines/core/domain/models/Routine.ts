import type { Exercise } from '../../../../exercises/core/domain/models/Exercise';

export interface Routine {
  id: number;
  name: string;
  exercises: Exercise[];
}
