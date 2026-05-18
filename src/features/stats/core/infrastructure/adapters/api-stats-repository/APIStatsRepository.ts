import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

import type { StatsRepository } from '../../../application/ports/StatsRepository';
import type { UserStats } from '../../../domain/models/UserStats';
import type { GetStatsDTO } from './dtos/GetStatsDTO';
import { StatsFromDTO } from './mappers/StatsFromDTO';

export class APIStatsRepository implements StatsRepository {
  async getStats(): Promise<UserStats> {
    try {
      // 30s TTL. Workout/diet writes call `invalidateCache` against
      // `API_ENDPOINTS.getStats` so the next read returns fresh data
      // immediately after the user logs a session or a meal.
      const data = await cachedGet<GetStatsDTO>(API_ENDPOINTS.getStats);

      return StatsFromDTO.fromDTO(data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tus estadisticas. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
