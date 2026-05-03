import type { OnboardingResponseUser } from '../../../../domain/models/OnboardingResponse';

export class OnboardingResponseUserFromDTO {
  static fromDTO(dto: OnboardingResponseUser): OnboardingResponseUser {
    return {
      ...dto,
      name: dto.name?.trim?.() ? dto.name.trim() : dto.name,
      onboarding_completed: Boolean(dto.onboarding_completed),
    };
  }
}
