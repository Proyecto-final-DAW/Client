/**
 * Display labels for the diet view — Spanish copy for goal and
 * activity-level enums. Per-macro food examples used to live here too
 * (`MACRO_FOOD_EXAMPLES`) but have moved to `macroExamples.ts` where
 * they're generated dynamically from the calculated gram targets.
 */

export const GOAL_LABEL: Record<string, string> = {
  LOSE_FAT: 'Perder grasa',
  GAIN_MUSCLE: 'Ganar musculo',
  MAINTAIN: 'Mantener',
  HEALTH: 'Salud general',
};

export const ACTIVITY_LABEL: Record<string, string> = {
  SEDENTARY: 'Sedentario',
  LIGHT: 'Actividad ligera',
  MODERATE: 'Actividad moderada',
  ACTIVE: 'Activo',
  VERY_ACTIVE: 'Muy activo',
};
