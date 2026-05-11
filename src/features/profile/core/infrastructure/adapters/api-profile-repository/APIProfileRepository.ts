import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { ProfileRepository } from '../../../application/ports/ProfileRepository';
import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../../domain/models/ProfileData';

export class APIProfileRepository implements ProfileRepository {
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await axios.get(API_ENDPOINTS.profile);
      return response.data as ProfileData;
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu perfil. Recarga la pagina o intentalo de nuevo.'
        )
      );
    }
  }
  async updateProfile(data: ProfileUpdateData): Promise<ProfileData> {
    try {
      const response = await axios.put(API_ENDPOINTS.profile, data);
      return response.data as ProfileData;
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido guardar tus cambios. Comprueba los datos y vuelve a intentarlo.'
        )
      );
    }
  }
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await axios.put(API_ENDPOINTS.changePassword, data);
      return response.data as { message: string };
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cambiar tu contraseña. Vuelve a intentarlo.'
        )
      );
    }
  }
}
