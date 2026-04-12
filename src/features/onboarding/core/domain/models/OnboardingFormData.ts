export type ActivityLevel = 'sedentary' | 'light' | 'active' | 'very_active';
export type Goal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'health';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'full_gym' | 'home_weights' | 'bodyweight';
export type DaysPerWeek = '2-3' | '4-5' | '6+';
export type Injury = 'none' | 'knee' | 'back' | 'shoulder' | 'other';

export interface OnboardingFormData {
  name: string;
  birthDate: string;
  weight: string;
  height: string;
  sex?: 'male' | 'female';
  activityLevel?: ActivityLevel;
  goals: Goal[];
  experienceLevel?: ExperienceLevel;
  equipment?: Equipment;
  daysPerWeek?: DaysPerWeek;
  injuries: Injury[];
}

export type FormErrors = Partial<Record<keyof OnboardingFormData, string>>;

export const INITIAL_FORM_DATA: OnboardingFormData = {
  name: '',
  birthDate: '',
  weight: '',
  height: '',
  sex: undefined,
  activityLevel: undefined,
  goals: [],
  experienceLevel: undefined,
  equipment: undefined,
  daysPerWeek: undefined,
  injuries: [],
};
