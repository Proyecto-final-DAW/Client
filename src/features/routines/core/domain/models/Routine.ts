import type { Exercise } from '@features/exercises/core/domain/models/Exercise';

export interface Routine {
  id: string;
  name: string;
  description: string | null;
  exercises: Exercise[];
}
