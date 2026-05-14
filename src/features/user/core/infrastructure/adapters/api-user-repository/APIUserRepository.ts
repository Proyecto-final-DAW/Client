import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { UserRepository } from '../../../application/ports/UserRepository';
import type { User, RegisterResponse } from '../../../domain/models/User';

export class APIUserRepository implements UserRepository {
  async register(payload: User): Promise<RegisterResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.register, payload);
      const data =
        (response.data as unknown as Record<string, unknown> | undefined) ?? {};

      return {
        message: data.message as string | undefined,
      };
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido completar el registro. Revisa los datos y vuelve a intentarlo.'
        )
      );
    }
  }
}
