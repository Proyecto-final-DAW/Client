import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

import type { WeeklySummaryRepository } from '../../../application/ports/WeeklySummaryRepository';
import type { WeeklySummary } from '../../../domain/models/WeeklySummary';
import type { GetWeeklySummaryDTO } from './dtos/GetWeeklySummaryDTO';
import { WeeklySummaryFromDTO } from './mappers/WeeklySummaryFromDTO';

export class APIWeeklySummaryRepository implements WeeklySummaryRepository {
  async getWeeklySummary(): Promise<WeeklySummary> {
    try {
      // 30s TTL. Workout save calls `invalidateCache` against this URL
      // so the weekly numbers refresh immediately after a session.
      const data = await cachedGet<GetWeeklySummaryDTO>(
        API_ENDPOINTS.getWeeklySummary
      );

      return WeeklySummaryFromDTO.fromDTO(data);
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
