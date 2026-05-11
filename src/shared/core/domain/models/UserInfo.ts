export interface UserInfo {
  id: number;
  name: string;
  email: string;
  onboarding_completed: boolean;
  // The DB column is nullable, the onboarding wizard fills it but a
  // legacy account or a deleted-and-resubmitted profile may emit null
  // here. Match the server contract so callers don't need a cast.
  birth_date?: string | null;
  sex?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  goals?: string[];
  experience_level?: string;
  equipment?: string[];
  days_per_week?: string;
  injuries?: string[];
  injury_notes?: string | null;
  age?: number;
  sleep_hours?: number;
  daily_calories?: number;
  protein_grams?: number;
  fat_grams?: number;
  carb_grams?: number;
  profileImage?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type LoginResponse = {
  message?: string;
  token: string;
  user: UserInfo;
};
