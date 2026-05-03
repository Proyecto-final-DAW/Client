import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los stats';
      throw new Error(serverMessage);
    }
  }
}
