import type { AxiosError } from 'axios';
import axios from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type {
  OnboardingResponse,
  OnboardingResponseUser,
} from '../../../domain/models/OnboardingResponse';

function toOnboardingPayload(data: OnboardingFormData) {
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

export class ApiOnboardingInfoRepository implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    userId: number,
    token: string
  ): Promise<OnboardingResponse> {
    try {
      const response = await axios.put<
        OnboardingResponseUser | OnboardingResponse
      >(API_ENDPOINTS.onboarding(userId), toOnboardingPayload(data), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return { user: response.data as OnboardingResponseUser };
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al completar el onboarding'
      );
    }
  }
}
