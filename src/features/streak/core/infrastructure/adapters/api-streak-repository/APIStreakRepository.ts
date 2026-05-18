import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

import type { StreakRepository } from '../../../application/ports/StreakRepository';
import type { StreakStatus } from '../../../domain/models/StreakStatus';
import type { GetStreakStatusDTO } from './dtos/GetStreakStatusDTO';
import { StreakStatusFromDTO } from './mappers/StreakStatusFromDTO';

export class APIStreakRepository implements StreakRepository {
  async getStatus(_token?: string): Promise<StreakStatus> {
    try {
      // 30s TTL. The token parameter used to be threaded through as an
      // explicit Authorization header, but the global axios interceptor
      // in `@config/api` already attaches `Bearer <jwt>` from
      // localStorage on every request — passing it again here was a
      // no-op that prevented us from going through the cache wrapper.
      const data = await cachedGet<GetStreakStatusDTO>(
        API_ENDPOINTS.getStreakStatus
      );

      return StreakStatusFromDTO.fromDTO(data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu racha. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
