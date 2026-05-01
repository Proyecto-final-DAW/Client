import type { TemplateExercise } from './TemplateExercise';

export type TemplateGoal = 'GAIN_MUSCLE' | 'LOSE_FAT' | 'MAINTAIN' | 'HEALTH';
export type TemplateEquipment = 'FULL_GYM' | 'HOME_WEIGHTS' | 'BODYWEIGHT';
export type TemplateLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type TemplateRoutine = {
  name: string;
  exercises: TemplateExercise[];
};

export type RoutineTemplate = {
  id: string;
  name: string;
  description: string;
  goal: TemplateGoal;
  equipment: TemplateEquipment;
  level: TemplateLevel;
  daysPerWeek: number;
  estimatedDurationMin: number;
  routines: TemplateRoutine[];
};
