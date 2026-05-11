import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { StreakRepository } from '../../../application/ports/StreakRepository';
import type { StreakStatus } from '../../../domain/models/StreakStatus';
import type { GetStreakStatusDTO } from './dtos/GetStreakStatusDTO';
import { StreakStatusFromDTO } from './mappers/StreakStatusFromDTO';

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export class APIStreakRepository implements StreakRepository {
  async getStatus(token?: string): Promise<StreakStatus> {
    try {
      const response = await axios.get<GetStreakStatusDTO>(
        API_ENDPOINTS.getStreakStatus,
        { headers: authHeaders(token) }
      );

      return StreakStatusFromDTO.fromDTO(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu racha. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
