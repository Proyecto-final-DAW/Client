export type Sex = 'MALE' | 'FEMALE';
export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHT'
  | 'MODERATE'
  | 'ACTIVE'
  | 'VERY_ACTIVE';
export type Goal = 'LOSE_FAT' | 'GAIN_MUSCLE' | 'MAINTAIN' | 'HEALTH';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type Equipment = 'FULL_GYM' | 'HOME_WEIGHTS' | 'BODYWEIGHT';
export type DaysPerWeek = '2-3' | '4-5' | '6+';
export type Injury = 'NONE' | 'KNEE' | 'BACK' | 'SHOULDER' | 'OTHER';

export interface OnboardingFormData {
  name: string;
  birthDate: string;
  weight: string;
  height: string;
  sex?: Sex;
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
