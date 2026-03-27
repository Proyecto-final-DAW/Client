import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ExerciseRepository } from '../../../application/ports/ExerciseRepository';
import type { Exercise } from '../../../domain/models/Exercise';
import type { GetExercisesDTO } from './dtos/GetExercisesDTO';
import { ExercisesFromDTO } from './mappers/ExercisesFromDTO';

const EXERCISES_URL = `${API_BASE_URL}/exercises`;

export class APIExerciseRepository implements ExerciseRepository {
  async searchExercises(
    search?: string,
    muscle?: string,
    token?: string
  ): Promise<Exercise[]> {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (muscle) params.muscle = muscle;

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get<GetExercisesDTO[]>(EXERCISES_URL, {
        params,
        headers,
      });

      return ExercisesFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al buscar ejercicios';
      throw new Error(serverMessage);
    }
  }
}
