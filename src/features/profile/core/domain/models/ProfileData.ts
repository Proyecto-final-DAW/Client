export interface ProfileData {
  id: number;
  name: string;
  email: string;
  age: number | null;
  birth_date: string | null;
  sex: 'MALE' | 'FEMALE' | 'NON_BINARY' | null;
  weight: number | null;
  height: number | null;
  activity_level: string | null;
  goals: string[];
  experience_level: string | null;
  equipment: string[];
  days_per_week: string | null;
  injuries: string[];
  sleep_hours: number | null;
  daily_calories: number | null;
  protein_grams: number | null;
  fat_grams: number | null;
  carb_grams: number | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  streak: number;
  best_streak: number;
  total_sessions: number;
}

export interface ProfileUpdateData {
  name?: string;
  weight?: number;
  height?: number;
  age?: number;
  activity_level?: string;
  goals?: string[];
  sleep_hours?: number;
  sex?: 'MALE' | 'FEMALE' | 'NON_BINARY';
  experience_level?: string;
  equipment?: string[];
  days_per_week?: string;
  injuries?: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
  SEDENTARY: 'Sedentario',
  LIGHT: 'Ligero',
  MODERATE: 'Moderado',
  ACTIVE: 'Activo',
  VERY_ACTIVE: 'Muy activo',
};

export const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: 'Perder grasa',
  GAIN_MUSCLE: 'Ganar musculo',
  MAINTAIN: 'Mantener',
  HEALTH: 'Salud general',
};

export const ACTIVITY_LEVEL_OPTIONS = Object.entries(ACTIVITY_LEVEL_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const GOAL_OPTIONS = Object.entries(GOAL_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  FULL_GYM: 'Gimnasio completo',
  HOME_WEIGHTS: 'Pesas en casa',
  BODYWEIGHT: 'Solo peso corporal',
};

export const DAYS_PER_WEEK_LABELS: Record<string, string> = {
  '2-3': '2-3 dias',
  '4-5': '4-5 dias',
  '6+': '6 o mas',
};

export const INJURY_LABELS: Record<string, string> = {
  NONE: 'Ninguna',
  KNEE: 'Rodilla',
  BACK: 'Espalda',
  SHOULDER: 'Hombro',
  OTHER: 'Otra',
};

export const SEX_LABELS: Record<string, string> = {
  MALE: 'Hombre',
  FEMALE: 'Mujer',
  NON_BINARY: 'No binario',
};

export const EXPERIENCE_LEVEL_OPTIONS = Object.entries(
  EXPERIENCE_LEVEL_LABELS
).map(([value, label]) => ({ value, label }));

export const EQUIPMENT_OPTIONS = Object.entries(EQUIPMENT_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const DAYS_PER_WEEK_OPTIONS = Object.entries(DAYS_PER_WEEK_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const INJURY_OPTIONS = Object.entries(INJURY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const SEX_OPTIONS = Object.entries(SEX_LABELS).map(([value, label]) => ({
  value,
  label,
}));
