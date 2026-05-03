import type { Exercise } from '../../../../exercises/core/domain/models/Exercise';

export interface Routine {
  id: string;
  name: string;
  description: string | null;
  exercises: Exercise[];
}
