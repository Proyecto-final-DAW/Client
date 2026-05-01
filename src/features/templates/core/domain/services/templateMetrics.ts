import type { RoutineTemplate } from '../models/RoutineTemplate';

export const countExercises = (template: RoutineTemplate): number =>
  template.routines.reduce(
    (total, routine) => total + routine.exercises.length,
    0
  );
