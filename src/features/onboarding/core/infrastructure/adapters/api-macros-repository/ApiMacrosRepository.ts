import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { MacrosRepository } from '../../../application/ports/MacrosRepository';
import type {
  ActivityLevel,
  OnboardingFormData,
} from '../../../domain/models/OnboardingFormData';

const ACTIVITY_FACTOR_MAP: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
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

export class ApiMacrosRepository implements MacrosRepository {
  async calculateMacros(
    data: OnboardingFormData,
    userId: number
  ): Promise<void> {
    try {
      const response = await axios.post(API_ENDPOINTS.calculateMacros(userId), {
        weightKg: parseFloat(data.weight),
        heightCm: parseFloat(data.height),
        age: computeAge(data.birthDate),
        sex: data.sex,
        activityFactor: ACTIVITY_FACTOR_MAP[data.activityLevel!],
        goal: data.goals[0],
        save: true,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al calcular los macros';
      throw new Error(serverMessage);
    }
  }
}
