import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type {
  Progress,
  RegisterWeightInput,
} from '../../../domain/models/Progress';
import type {
  GetProgressDTO,
  RegisterWeightRequestDTO,
} from './dtos/GetProgressDTO';
import { WeightHistoryFromDTO } from './mappers/WeightHistoryFromDTO';

const PROGRESS_URL = `${API_BASE_URL}/progress`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const toIsoDate = (date: Date): string => date.toISOString().split('T')[0];

export class APIProgressRepository implements ProgressRepository {
  async getWeightHistory(userId: number, token?: string): Promise<Progress[]> {
    try {
      const response = await axios.get<GetProgressDTO[]>(
        `${PROGRESS_URL}/${userId}/weight`,
        { headers: authHeaders(token) }
      );

      return WeightHistoryFromDTO.fromDTOList(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al cargar el historial de peso');
    }
  }

  async registerWeight(
    userId: number,
    input: RegisterWeightInput,
    token?: string
  ): Promise<Progress> {
    try {
      const body: RegisterWeightRequestDTO = {
        weight: input.weight,
        date: toIsoDate(input.date),
      };

      const response = await axios.post<GetProgressDTO>(
        `${PROGRESS_URL}/${userId}/weight`,
        body,
        { headers: authHeaders(token) }
      );

      return WeightHistoryFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al registrar el peso');
    }
  }

  private handleError(error: unknown, fallbackMessage: string): Error {
    const err = error as AxiosError<APIErrorResponse>;
    const serverMessage = err.response?.data?.message || fallbackMessage;

    return new Error(serverMessage);
  }
}
