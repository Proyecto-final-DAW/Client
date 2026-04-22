export interface UserInfo {
  id: number;
  name: string;
  email: string;
  onboarding_completed: boolean;
  birth_date?: string;
  sex?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  goals?: string[];
  experience_level?: string;
  equipment?: string;
  days_per_week?: string;
  injuries?: string[];
  age?: number;
  sleep_hours?: number;
  daily_calories?: number;
  protein_grams?: number;
  fat_grams?: number;
  carb_grams?: number;
  profileImage?: string;
  created_at?: string;
  updated_at?: string;
}

export type LoginResponse = {
  message?: string;
  token: string;
  user: UserInfo;
};
