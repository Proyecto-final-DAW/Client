import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { StreakRepository } from '../../../application/ports/StreakRepository';
import type { StreakStatus } from '../../../domain/models/StreakStatus';
import type { GetStreakStatusDTO } from './dtos/GetStreakStatusDTO';
import { StreakStatusFromDTO } from './mappers/StreakStatusFromDTO';

const STREAK_STATUS_URL = `${API_BASE_URL}/streak/status`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export class APIStreakRepository implements StreakRepository {
  async getStatus(token?: string): Promise<StreakStatus> {
    try {
      const response = await axios.get<GetStreakStatusDTO>(STREAK_STATUS_URL, {
        headers: authHeaders(token),
      });

      return StreakStatusFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar la racha';

      throw new Error(serverMessage);
    }
  }
}
