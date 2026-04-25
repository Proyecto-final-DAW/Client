export interface OnboardingResponseUser {
  id: number;
  email: string;
  name: string;
  birth_date: string;
  profileImage?: string | null;
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
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingResponse {
  token?: string;
  user: OnboardingResponseUser;
}
