export interface OnboardingResponseUser {
  id: number;
  email: string;
  name: string;
  // Server can emit `birth_date` as null when the user hasn't set it
  // yet (the wizard requires it, but the column is nullable on the DB
  // so a profile-edit-only user round-trips here too). Optional to
  // mirror reality.
  birth_date?: string | null;
  profileImage?: string | null;
  sex?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  goals?: string[];
  experience_level?: string;
  equipment?: string[];
  days_per_week?: string;
  injuries?: string[];
  /** Free-text detail surfaced when the user marks 'OTHER' in the
   *  injuries step. Migration `20260507203852_users_injury_notes.sql`
   *  added the column server-side; without this field the response
   *  would silently drop the value the user just typed in onboarding. */
  injury_notes?: string | null;
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
