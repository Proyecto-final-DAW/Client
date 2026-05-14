import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
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
import type { GetProgressDTO, RegisterWeightDTO } from './dtos/GetProgressDTO';
import { ExerciseProgressFromDTO } from './mappers/ExerciseProgressFromDTO';
import { PerformedExercisesFromDTO } from './mappers/PerformedExercisesFromDTO';
import { WeightHistoryFromDTO } from './mappers/WeightHistoryFromDTO';

const toIsoDate = (date: Date): string => date.toISOString().split('T')[0];

export class APIProgressRepository implements ProgressRepository {
  async getPerformedExercises(userId: number): Promise<PerformedExercise[]> {
    try {
      const response = await axios.get<GetPerformedExercisesDTO>(
        API_ENDPOINTS.getPerformedExercises(userId)
      );
      return PerformedExercisesFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los ejercicios';
      throw new Error(serverMessage);
    }
  }
  async getExerciseProgress(
    userId: number,
    exerciseId: string
  ): Promise<ExerciseProgressPoint[]> {
    try {
      const response = await axios.get<GetExerciseProgressDTO>(
        API_ENDPOINTS.getExerciseProgress(userId, exerciseId)
      );
      return ExerciseProgressFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar la progresion';
      throw new Error(serverMessage);
    }
  }
  async getWeightHistory(userId: number): Promise<Progress[]> {
    try {
      const response = await axios.get<GetProgressDTO[]>(
        API_ENDPOINTS.getWeightHistory(userId)
      );
      return WeightHistoryFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar el historial de peso';
      throw new Error(serverMessage);
    }
  }
  async registerWeight(
    userId: number,
    input: RegisterWeightInput
  ): Promise<Progress> {
    try {
      const body: RegisterWeightDTO = {
        weight: input.weight,
        date: toIsoDate(input.date),
      };
      const response = await axios.post<GetProgressDTO>(
        API_ENDPOINTS.getWeightHistory(userId),
        body
      );
      return WeightHistoryFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al registrar el peso';
      throw new Error(serverMessage);
    }
  }
}
