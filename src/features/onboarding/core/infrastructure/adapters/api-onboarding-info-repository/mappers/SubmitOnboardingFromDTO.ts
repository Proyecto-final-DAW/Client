import type { OnboardingFormData } from '@features/onboarding/core/domain/models/OnboardingFormData';

import type { SubmitOnboardingDTO } from '../dtos/SubmitOnboardingDTO';

export class SubmitOnboardingFromDTO {
  static fromDTO(data: OnboardingFormData): SubmitOnboardingDTO {
    // Only forward `injuryNotes` when the user actually marked OTHER and
    // typed something — sending an empty string for everyone else would
    // clutter the row and trip the server's `.strict()` schema for
    // unrelated submissions. Trimmed so trailing whitespace doesn't
    // promote a blank field to "non-empty".
    const trimmedNotes = (data.injuryNotes ?? '').trim();
    const includeNotes = data.injuries.includes('OTHER') && trimmedNotes !== '';

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
      ...(includeNotes ? { injuryNotes: trimmedNotes } : {}),
    };
  }
}
