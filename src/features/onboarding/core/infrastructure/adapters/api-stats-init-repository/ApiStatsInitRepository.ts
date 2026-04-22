import type { AxiosError } from 'axios';
import axios from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { StatsInitPort } from '../../../application/ports/StatsInitPort';

export class ApiStatsInitRepository implements StatsInitPort {
  async initStats(token: string): Promise<void> {
    try {
      await axios.post(
        API_ENDPOINTS.statsInit,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      const err = error as AxiosError;
      // 409 means stats already initialized — idempotent, not an error.
      if (err.response?.status === 409) return;
      throw err;
    }
  }
}
