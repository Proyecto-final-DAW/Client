import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../../domain/models/OnboardingResponse';

export class MockOnboardingAdapter implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    _token: string
  ): Promise<OnboardingResponse> {
    return {
      user: {
        id: 1,
        email: 'test@gymquest.com',
        name: data.name,
        birth_date: data.birthDate,
        sex: data.sex!,
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        activity_level: data.activityLevel!,
        goal: data.goals[0]!,
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
