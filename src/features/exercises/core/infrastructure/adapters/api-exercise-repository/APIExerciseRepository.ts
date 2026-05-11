import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type {
  ExerciseRepository,
  ExerciseSearchResult,
} from '../../../application/ports/ExerciseRepository';
import type { GetExercisesDTO } from './dtos/GetExercisesDTO';
import { ExercisesFromDTO } from './mappers/ExercisesFromDTO';

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

      const response = await axios.get<SearchResponse>(
        API_ENDPOINTS.getExercises,
        {
          params,
          headers,
          signal,
        }
      );

      return {
        data: ExercisesFromDTO.fromDTOList(response.data.data),
        total: response.data.total,
      };
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido buscar ejercicios. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
