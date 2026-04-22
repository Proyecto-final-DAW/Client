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
      return response.data as RegisterResponse;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al registrar usuario';
      throw new Error(serverMessage);
    }
  }
}
