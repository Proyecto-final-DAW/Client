import axios, { AxiosError } from 'axios';

import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { StatsRepository } from '../../../application/ports/StatsRepository';
import type { UserStats } from '../../../domain/models/UserStats';
import type { GetStatsDTO } from './dtos/GetStatsDTO';
import { StatsFromDTO } from './mappers/StatsFromDTO';

// need to change this once the api is available, now we use the mocked
const STATS_URL = `${import.meta.env.VITE_API_URL}/users/stats`;

export class APIStatsRepository implements StatsRepository {
  async getStats(token: string): Promise<UserStats> {
    try {
      const response = await axios.get<GetStatsDTO>(STATS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return StatsFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los stats';
      throw new Error(serverMessage);
    }
  }
}
