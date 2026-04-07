import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';
import type {
  LoginResponse,
  RegisterResponse,
} from '../../../domain/models/UserInfo';

export class APIUserInfoRepository implements UserInfoRepository {
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
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });
      return response.data as LoginResponse;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(serverMessage);
    }
  }
}
