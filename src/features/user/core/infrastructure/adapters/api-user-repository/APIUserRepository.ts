import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { UserRepository } from '../../../application/ports/UserRepository';
import type { RegisterResponse } from '../../../domain/models/User';

export class APIUserRepository implements UserRepository {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.register, {
        name,
        email,
        password,
      });
      const data = response.data as unknown as Record<string, unknown>;

      const token = data.token as string | undefined;
      const user =
        (data.user as RegisterResponse['user'] | undefined) ??
        ({
          id: data.id,
          name: data.name,
          email: data.email,
          onboarding_completed: data.onboarding_completed ?? false,
          created_at: data.created_at,
          updated_at: data.updated_at,
        } as RegisterResponse['user']);

      if (!token) {
        throw new Error(
          'No pudimos completar el registro. Intenta nuevamente en unos segundos.'
        );
      }

      if (!user || user.id == null || !user.email) {
        throw new Error(
          'No pudimos completar el registro. Intenta nuevamente.'
        );
      }

      return {
        message: data.message as string | undefined,
        token,
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al registrar usuario'
      );
    }
  }
}
