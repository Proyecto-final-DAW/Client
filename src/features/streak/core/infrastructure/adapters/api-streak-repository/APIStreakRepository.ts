import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar la racha';

      throw new Error(serverMessage);
    }
  }
}
