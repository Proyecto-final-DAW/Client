import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type {
  ExerciseRepository,
  ExerciseSearchResult,
} from '../../../application/ports/ExerciseRepository';
import type { GetExercisesDTO } from './dtos/GetExercisesDTO';
import { ExercisesFromDTO } from './mappers/ExercisesFromDTO';

const EXERCISES_URL = `${API_BASE_URL}/exercises`;

interface SearchResponse {
  data: GetExercisesDTO[];
  total: number;
}

export class APIExerciseRepository implements ExerciseRepository {
  async searchExercises(
    search?: string,
    muscle?: string,
    token?: string,
    signal?: AbortSignal,
    page?: number,
    limit?: number
  ): Promise<ExerciseSearchResult> {
    try {
      const params: Record<string, string | number> = {};
      if (search) params.search = search;
      if (muscle) params.muscle = muscle;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get<SearchResponse>(EXERCISES_URL, {
        params,
        headers,
        signal,
      });

      return {
        data: ExercisesFromDTO.fromDTOList(response.data.data),
        total: response.data.total,
      };
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al buscar ejercicios';
      throw new Error(serverMessage);
    }
  }
}
