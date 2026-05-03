export interface ProfileData {
  id: number;
  name: string;
  email: string;
  age: number | null;
  birth_date: string | null;
  sex: 'MALE' | 'FEMALE' | null;
  weight: number | null;
  height: number | null;
  activity_level: string | null;
  goals: string[];
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
