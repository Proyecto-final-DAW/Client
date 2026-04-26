import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { Progress } from '../../../domain/models/Progress';
import type { GetProgressDTO } from './dtos/GetProgressDTO';
import { GetProgressFromDTO } from './mappers/GetProgressFromDTO';

const PROGRESS_URL = `${API_BASE_URL}/progress`;

export class APIProgressRepository implements ProgressRepository {
  async getWeightHistory(userId: string, token?: string): Promise<Progress[]> {
    try {
      const response = await axios.get<GetProgressDTO[]>(
        `${PROGRESS_URL}/${userId}/weight`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      return GetProgressFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar el historial de peso';

      throw new Error(serverMessage);
    }
  }
}
