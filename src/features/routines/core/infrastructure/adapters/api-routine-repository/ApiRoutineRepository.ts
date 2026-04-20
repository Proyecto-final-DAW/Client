import axios, { AxiosError } from 'axios';

import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';

const ROUTINES_URL = `${import.meta.env.VITE_API_URL}/routines`;

export class APIRoutineRepository implements RoutineRepository {
  async getRoutines(token: string): Promise<Routine[]> {
    try {
      const response = await axios.get<Routine[]>(ROUTINES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar las rutinas';
      throw new Error(serverMessage);
    }
  }
}
