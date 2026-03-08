export interface OnboardingResponse {
  user: {
    id: number;
    email: string;
    name: string;
    birth_date: string;
    sex?: string;
    weight?: number;
    height?: number;
    activity_level?: string;
    goal?: string;
    age?: number;
    sleep_hours?: number;
    daily_calories?: number;
    protein_grams?: number;
    fat_grams?: number;
    carb_grams?: number;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
  };
}
