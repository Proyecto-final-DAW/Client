import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { WeeklySummaryRepository } from '../../../application/ports/WeeklySummaryRepository';
import type { WeeklySummary } from '../../../domain/models/WeeklySummary';
import type { GetWeeklySummaryDTO } from './dtos/GetWeeklySummaryDTO';
import { WeeklySummaryFromDTO } from './mappers/WeeklySummaryFromDTO';

export class APIWeeklySummaryRepository implements WeeklySummaryRepository {
  async getWeeklySummary(token: string): Promise<WeeklySummary> {
    try {
      const response = await axios.get<GetWeeklySummaryDTO>(
        API_ENDPOINTS.weeklySummary,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return WeeklySummaryFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar el resumen semanal';
      throw new Error(serverMessage);
    }
  }
}
