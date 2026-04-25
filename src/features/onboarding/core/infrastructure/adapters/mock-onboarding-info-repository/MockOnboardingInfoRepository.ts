import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../../domain/models/OnboardingResponse';

export class MockOnboardingAdapter implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    userId: number,
    _token: string
  ): Promise<OnboardingResponse> {
    return {
      user: {
        id: userId,
        email: 'test@gymquest.com',
        name: data.name,
        birth_date: data.birthDate,
        sex: data.sex?.toUpperCase(),
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        activity_level: data.activityLevel?.toUpperCase(),
        goals: data.goals.map((g) => g.toUpperCase()),
        experience_level: data.experienceLevel?.toUpperCase(),
        equipment: data.equipment?.toUpperCase(),
        days_per_week: data.daysPerWeek,
        injuries: data.injuries.map((i) => i.toUpperCase()),
        daily_calories: 2000,
        protein_grams: 150,
        fat_grams: 65,
        carb_grams: 250,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}
