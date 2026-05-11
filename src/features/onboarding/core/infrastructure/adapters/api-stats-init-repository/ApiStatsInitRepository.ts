import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import type { AxiosError } from 'axios';
import axios from 'axios';

import type { StatsInitRepository } from '../../../application/ports/StatsInitRepository';

export class ApiStatsInitRepository implements StatsInitRepository {
  async initStats(): Promise<void> {
    try {
      const response = await axios.post(API_ENDPOINTS.initStats, {});
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      // 409 means stats already initialized — idempotent, not an error.
      if (err.response?.status === 409) return;
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido inicializar tus estadisticas. Vuelve a intentarlo en un momento.'
        )
      );
    }
  }
}
