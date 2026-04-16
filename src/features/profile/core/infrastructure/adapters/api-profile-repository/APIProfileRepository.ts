import axios from 'axios';
import type { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ProfileRepository } from '../../../application/ports/ProfileRepository';
import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../../domain/models/ProfileData';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export class APIProfileRepository implements ProfileRepository {
  async getProfile(token: string): Promise<ProfileData> {
    try {
      const response = await axios.get(API_ENDPOINTS.profile, {
        headers: authHeaders(token),
      });
      return response.data as ProfileData;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al obtener el perfil'
      );
    }
  }

  async updateProfile(
    token: string,
    data: ProfileUpdateData
  ): Promise<ProfileData> {
    try {
      const response = await axios.put(API_ENDPOINTS.profile, data, {
        headers: authHeaders(token),
      });
      return response.data as ProfileData;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al actualizar el perfil'
      );
    }
  }

  async changePassword(
    token: string,
    data: ChangePasswordData
  ): Promise<{ message: string }> {
    try {
      const response = await axios.put(API_ENDPOINTS.changePassword, data, {
        headers: authHeaders(token),
      });
      return response.data as { message: string };
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      throw new Error(
        err.response?.data?.message || 'Error al cambiar la contrasena'
      );
    }
  }
}
