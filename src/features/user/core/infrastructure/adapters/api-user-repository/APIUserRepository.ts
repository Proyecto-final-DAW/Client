import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
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
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message ?? 'Error al registrar usuario'
      );
    }
  }
}
