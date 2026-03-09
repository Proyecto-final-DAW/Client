import axios, { AxiosError } from 'axios';

import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { ExerciseRepository } from '../../../application/ports/ExerciseRepository';
import type { Exercise } from '../../../domain/models/Exercise';
import type { GetExercisesDTO } from './dtos/GetExercisesDTO';
import { ExercisesFromDTO } from './mappers/ExercisesFromDTO';

const EXERCISES_URL = `${import.meta.env.VITE_API_URL}/exercises`;

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

      const response = await axios.get<GetExercisesDTO[]>(EXERCISES_URL, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
