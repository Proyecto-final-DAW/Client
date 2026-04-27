import type { RoutineTemplate } from '../core/domain/models/RoutineTemplate';

export const countExercises = (template: RoutineTemplate): number =>
  template.routines.reduce(
    (total, routine) => total + routine.exercises.length,
    0
  );
