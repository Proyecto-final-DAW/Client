import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { ExerciseProgressPoint } from '../../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../../domain/models/PerformedExercise';
import type { GetExerciseProgressDTO } from './dtos/GetExerciseProgressDTO';
import type { GetPerformedExercisesDTO } from './dtos/GetPerformedExercisesDTO';
import { ExerciseProgressFromDTO } from './mappers/ExerciseProgressFromDTO';
import { PerformedExercisesFromDTO } from './mappers/PerformedExercisesFromDTO';

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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los ejercicios';
      throw new Error(serverMessage);
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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar la progresión';
      throw new Error(serverMessage);
    }
  }
}
