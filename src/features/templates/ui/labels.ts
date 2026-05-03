import type {
  TemplateEquipment,
  TemplateGoal,
  TemplateLevel,
} from '../core/domain/models/RoutineTemplate';

export const GOAL_LABELS: Record<TemplateGoal, string> = {
  GAIN_MUSCLE: 'Ganar musculo',
  LOSE_FAT: 'Perder grasa',
  MAINTAIN: 'Mantenimiento',
  HEALTH: 'Salud',
};

export const EQUIPMENT_LABELS: Record<TemplateEquipment, string> = {
  FULL_GYM: 'Gimnasio',
  HOME_WEIGHTS: 'Casa con pesos',
  BODYWEIGHT: 'Sin material',
};

export const LEVEL_LABELS: Record<TemplateLevel, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

export const GOAL_OPTIONS: { value: TemplateGoal | ''; label: string }[] = [
  { value: '', label: 'Todos los objetivos' },
  { value: 'GAIN_MUSCLE', label: GOAL_LABELS.GAIN_MUSCLE },
  { value: 'LOSE_FAT', label: GOAL_LABELS.LOSE_FAT },
  { value: 'MAINTAIN', label: GOAL_LABELS.MAINTAIN },
  { value: 'HEALTH', label: GOAL_LABELS.HEALTH },
];

export const EQUIPMENT_OPTIONS: {
  value: TemplateEquipment | '';
  label: string;
}[] = [
  { value: '', label: 'Todo el equipamiento' },
  { value: 'FULL_GYM', label: EQUIPMENT_LABELS.FULL_GYM },
  { value: 'HOME_WEIGHTS', label: EQUIPMENT_LABELS.HOME_WEIGHTS },
  { value: 'BODYWEIGHT', label: EQUIPMENT_LABELS.BODYWEIGHT },
];

export const LEVEL_OPTIONS: { value: TemplateLevel | ''; label: string }[] = [
  { value: '', label: 'Todos los niveles' },
  { value: 'BEGINNER', label: LEVEL_LABELS.BEGINNER },
  { value: 'INTERMEDIATE', label: LEVEL_LABELS.INTERMEDIATE },
  { value: 'ADVANCED', label: LEVEL_LABELS.ADVANCED },
];

export const totalExercises = (count: number, days: number): string => {
  const exerciseLabel = count === 1 ? 'ejercicio' : 'ejercicios';
  const dayLabel = days === 1 ? 'dia' : 'dias';
  return `${count} ${exerciseLabel} · ${days} ${dayLabel}/semana`;
};
