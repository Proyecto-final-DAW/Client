import type { OnboardingFormData } from '../../../../domain/models/OnboardingFormData';
import type { SubmitOnboardingDTO } from '../dtos/SubmitOnboardingDTO';

export class SubmitOnboardingFromDTO {
  static fromDTO(data: OnboardingFormData): SubmitOnboardingDTO {
    return {
      name: data.name.trim(),
      birthDate: data.birthDate,
      weight: data.weight,
      height: data.height,
      sex: data.sex,
      activityLevel: data.activityLevel,
      goals: data.goals,
      experienceLevel: data.experienceLevel,
      equipment: data.equipment,
      daysPerWeek: data.daysPerWeek,
      injuries: data.injuries,
    };
  }
}
