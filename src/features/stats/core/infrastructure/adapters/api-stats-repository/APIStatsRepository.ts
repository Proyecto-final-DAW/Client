import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { StatsRepository } from '../../../application/ports/StatsRepository';
import type { UserStats } from '../../../domain/models/UserStats';
import type { GetStatsDTO } from './dtos/GetStatsDTO';
import { StatsFromDTO } from './mappers/StatsFromDTO';

export class APIStatsRepository implements StatsRepository {
  async getStats(): Promise<UserStats> {
    try {
      const response = await axios.get<GetStatsDTO>(API_ENDPOINTS.getStats);

      return StatsFromDTO.fromDTO(response.data);
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
