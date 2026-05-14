import type {
  ActivityLevel,
  DaysPerWeek,
  Equipment,
  ExperienceLevel,
  Goal,
  Injury,
  OnboardingFormData,
  Sex,
} from '../../../../domain/models/OnboardingFormData';

export type SubmitOnboardingDTO = {
  name: string;
  birthDate: string;
  weight: OnboardingFormData['weight'];
  height: OnboardingFormData['height'];
  sex: Sex | undefined;
  activityLevel: ActivityLevel | undefined;
  goals: Goal[];
  experienceLevel: ExperienceLevel | undefined;
  equipment: Equipment[];
  daysPerWeek: DaysPerWeek | undefined;
  injuries: Injury[];
};
