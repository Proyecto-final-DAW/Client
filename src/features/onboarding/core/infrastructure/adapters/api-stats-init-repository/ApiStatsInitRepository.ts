import type { AxiosError } from 'axios';
import axios from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { StatsInitRepository } from '../../../application/ports/StatsInitRepository';

export class ApiStatsInitRepository implements StatsInitRepository {
  async initStats(): Promise<void> {
    try {
      const response = await axios.post(API_ENDPOINTS.initStats, {});
      return response.data;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      // 409 means stats already initialized — idempotent, not an error.
      if (err.response?.status === 409) return;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los logros';
      throw new Error(serverMessage);
    }
  }
}
