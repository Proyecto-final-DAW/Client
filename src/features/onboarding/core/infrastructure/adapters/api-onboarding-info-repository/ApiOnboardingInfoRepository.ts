import type { AxiosError } from 'axios';
import axios from 'axios';

import { API_ENDPOINTS, API_URLS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { ActivityLevel } from '../../../domain/models/OnboardingFormData';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type {
  OnboardingResponse,
  OnboardingResponseUser,
} from '../../../domain/models/OnboardingResponse';

const ACTIVITY_FACTOR_MAP: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  active: 1.725,
  very_active: 1.9,
};

function computeAge(birthDateStr: string): number {
  const today = new Date();
  const birth = new Date(birthDateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function toOnboardingPayload(data: OnboardingFormData) {
  return {
    name: data.name.trim(),
    birthDate: data.birthDate,
    weight: data.weight,
    height: data.height,
    sex: data.sex?.toUpperCase(),
    activityLevel: data.activityLevel?.toUpperCase(),
    goals: data.goals.map((g) => g.toUpperCase()),
    experienceLevel: data.experienceLevel?.toUpperCase(),
    equipment: data.equipment?.toUpperCase(),
    daysPerWeek: data.daysPerWeek,
    injuries: data.injuries.map((i) => i.toUpperCase()),
  };
}

export class OnboardingApiAdapter implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    userId: number,
    token: string
  ): Promise<OnboardingResponse> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    let user: OnboardingResponseUser;
    try {
      const response = await axios.put<OnboardingResponseUser>(
        API_URLS.onboarding(userId),
        toOnboardingPayload(data),
        { headers }
      );
      user = response.data;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al completar el onboarding'
      );
    }

    // Non-fatal: onboarding is already persisted. 409 from stats means
    // the row existed (e.g. retry). Other failures are swallowed so the
    // user can reach the dashboard and retry these steps later.
    try {
      await axios.post(API_ENDPOINTS.statsInit, {}, { headers });
    } catch {
      /* noop */
    }

    try {
      const macrosRes = await axios.post<{ user: OnboardingResponseUser }>(
        API_URLS.macrosCalculate(userId),
        {
          weightKg: parseFloat(data.weight),
          heightCm: parseFloat(data.height),
          age: computeAge(data.birthDate),
          sex: data.sex!.toUpperCase(),
          activityFactor: ACTIVITY_FACTOR_MAP[data.activityLevel!],
          goal: data.goals[0]!.toUpperCase(),
          save: true,
        },
        { headers }
      );
      if (macrosRes.data.user) user = macrosRes.data.user;
    } catch {
      /* noop */
    }

    return { user };
  }
}
