export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';
export type Goal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'health';

export interface OnboardingFormData {
  name: string;
  birthDate: string;
  weight: string;
  height: string;
  sex?: 'male' | 'female' | null;
  activityLevel?: ActivityLevel | null;
  goal?: Goal | null;
}

export type FormErrors = Partial<Record<keyof OnboardingFormData, string>>;

export const INITIAL_FORM_DATA: OnboardingFormData = {
  name: '',
  birthDate: '',
  weight: '',
  height: '',
  sex: null,
  activityLevel: null,
  goal: null,
};
