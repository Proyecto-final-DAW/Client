import axios, { AxiosError } from 'axios';

import { API_BASE_URL, API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { ExerciseProgressPoint } from '../../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../../domain/models/PerformedExercise';
import type {
  Progress,
  RegisterWeightInput,
} from '../../../domain/models/Progress';
import type { GetExerciseProgressDTO } from './dtos/GetExerciseProgressDTO';
import type { GetPerformedExercisesDTO } from './dtos/GetPerformedExercisesDTO';
import type {
  GetProgressDTO,
  RegisterWeightRequestDTO,
} from './dtos/GetProgressDTO';
import { ExerciseProgressFromDTO } from './mappers/ExerciseProgressFromDTO';
import { PerformedExercisesFromDTO } from './mappers/PerformedExercisesFromDTO';
import { WeightHistoryFromDTO } from './mappers/WeightHistoryFromDTO';

const PROGRESS_URL = `${API_BASE_URL}/progress`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const toIsoDate = (date: Date): string => date.toISOString().split('T')[0];

export class APIProgressRepository implements ProgressRepository {
  async getPerformedExercises(
    userId: number,
    token: string
  ): Promise<PerformedExercise[]> {
    try {
      const response = await axios.get<GetPerformedExercisesDTO>(
        API_ENDPOINTS.performedExercises(userId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return PerformedExercisesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al cargar los ejercicios');
    }
  }

  async getExerciseProgress(
    userId: number,
    exerciseId: string,
    token: string
  ): Promise<ExerciseProgressPoint[]> {
    try {
      const response = await axios.get<GetExerciseProgressDTO>(
        API_ENDPOINTS.exerciseProgress(userId, exerciseId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return ExerciseProgressFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al cargar la progresión');
    }
  }

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
