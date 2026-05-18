import { API_BASE_URL, API_ENDPOINTS } from '@config/api';
import { cachedGet, invalidateCache } from '@shared/api/cachedGet';
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
      return await cachedGet<ProfileData>(API_ENDPOINTS.profile);
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
      // Profile edits invalidate macros + character display; the
      // dashboard cards also derive from the user row, so bust both.
      // Diet macros are recomputed server-side from weight / activity /
      // goal, so the cached `/diet/:userId` response goes stale on
      // every profile save — prefix-match every `/diet/...` key (covers
      // both `/diet/:userId` and `/diet/state`) so the diet card
      // refreshes without a manual reload.
      invalidateCache(API_ENDPOINTS.profile);
      invalidateCache(API_ENDPOINTS.getDashboardCards);
      invalidateCache(`${API_BASE_URL}/diet/`);
      // The server now mirrors a weight change into `weight_logs` so
      // the body-weight chart can pick it up — drop the cached
      // `/progress/{userId}/weight` (and friends) so the next mount
      // of /progress refetches the new data point instead of waiting
      // out the 60s TTL.
      invalidateCache(`${API_BASE_URL}/progress/`);
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
