import type { AxiosError } from 'axios';
import axios from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../../domain/models/OnboardingResponse';

function toPayload(data: OnboardingFormData) {
  return {
    name: data.name.trim(),
    birth_date: data.birthDate,
    sex: data.sex!,
    weight: parseFloat(data.weight),
    height: parseFloat(data.height),
    activity_level: data.activityLevel!,
    goal: data.goals[0]!,
  };
}

export class OnboardingApiAdapter implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    token: string
  ): Promise<OnboardingResponse> {
    const payload = toPayload(data);

    try {
      const response = await axios.put(API_ENDPOINTS.onboarding, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al completar el onboarding';
      throw new Error(serverMessage);
    }
  }
}
