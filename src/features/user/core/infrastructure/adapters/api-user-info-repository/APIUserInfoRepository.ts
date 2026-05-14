import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import type { LoginResponse } from '@shared/core/domain/models/UserInfo';
import axios from 'axios';

import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';

export class APIUserInfoRepository implements UserInfoRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });
      const data = response.data as unknown as Record<string, unknown>;

      const token = data.token as string | undefined;
      const user =
        (data.user as LoginResponse['user'] | undefined) ??
        ({
          id: data.id,
          name: data.name,
          email: data.email,
          onboarding_completed: data.onboarding_completed ?? false,
          profileImage: data.profileImage,
          created_at: data.created_at,
          updated_at: data.updated_at,
        } as LoginResponse['user']);

      if (!token) {
        throw new Error(
          'No hemos podido iniciar sesion. Revisa los datos y vuelve a intentarlo.'
        );
      }

      return {
        message: (data.message as string) ?? 'OK',
        token,
        user,
      };
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido iniciar sesion. Revisa los datos y vuelve a intentarlo.'
        )
      );
    }
  }
}
