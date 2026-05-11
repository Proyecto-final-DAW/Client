import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { OnboardingRepository } from '../../../application/ports/OnboardingRepository';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type {
  OnboardingResponse,
  OnboardingResponseUser,
} from '../../../domain/models/OnboardingResponse';
import { OnboardingResponseUserFromDTO } from './mappers/OnboardingResponseUserFromDTO';
import { SubmitOnboardingFromDTO } from './mappers/SubmitOnboardingFromDTO';

/**
 * `PUT /onboarding/:userId/submit` returns the user row directly
 * (matches `OnboardingResponseUser`). The previous `<User | Response>`
 * union was misleading — the server has never wrapped this payload —
 * and forced an `as` cast immediately downstream. Narrowed to the
 * single shape the server actually emits.
 */
export class ApiOnboardingInfoRepository implements OnboardingRepository {
  async submitOnboarding(
    data: OnboardingFormData,
    userId: number
  ): Promise<OnboardingResponse> {
    try {
      const response = await axios.put<OnboardingResponseUser>(
        API_ENDPOINTS.onboarding(userId),
        SubmitOnboardingFromDTO.fromDTO(data)
      );
      return {
        user: OnboardingResponseUserFromDTO.fromDTO(response.data),
      };
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido completar la configuracion inicial. Vuelve a intentarlo en un momento.'
        )
      );
    }
  }
}
