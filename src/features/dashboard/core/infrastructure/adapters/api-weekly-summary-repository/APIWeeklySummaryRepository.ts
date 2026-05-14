import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { WeeklySummaryRepository } from '../../../application/ports/WeeklySummaryRepository';
import type { WeeklySummary } from '../../../domain/models/WeeklySummary';
import type { GetWeeklySummaryDTO } from './dtos/GetWeeklySummaryDTO';
import { WeeklySummaryFromDTO } from './mappers/WeeklySummaryFromDTO';

export class APIWeeklySummaryRepository implements WeeklySummaryRepository {
  async getWeeklySummary(): Promise<WeeklySummary> {
    try {
      const response = await axios.get<GetWeeklySummaryDTO>(
        API_ENDPOINTS.getWeeklySummary
      );

      return WeeklySummaryFromDTO.fromDTO(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu resumen semanal. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
