import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';
import type { GetRoutineDTO } from './dtos/GetRoutineDTO';
import { RoutinesFromDTO } from './mappers/RoutinesFromDTO';

const ROUTINES_URL = `${API_BASE_URL}/routines`;

const authHeaders = (token?: string) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export class APIRoutineRepository implements RoutineRepository {
  async getRoutines(token?: string): Promise<Routine[]> {
    try {
      const response = await axios.get<GetRoutineDTO[]>(
        ROUTINES_URL,
        authHeaders(token)
      );

      return RoutinesFromDTO.fromDTOList(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al cargar las rutinas');
    }
  }

  async createRoutine(name: string, token?: string): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(
        ROUTINES_URL,
        { name },
        authHeaders(token)
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al crear la rutina');
    }
  }

  async deleteRoutine(routineId: string, token?: string): Promise<void> {
    try {
      await axios.delete(`${ROUTINES_URL}/${routineId}`, authHeaders(token));
    } catch (error) {
      throw this.handleError(error, 'Error al eliminar la rutina');
    }
  }

  async addExercise(
    routineId: string,
    exerciseId: string,
    token?: string
  ): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(
        `${ROUTINES_URL}/${routineId}/exercises`,
        { exerciseId },
        authHeaders(token)
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al añadir el ejercicio');
    }
  }

  async removeExercise(
    routineId: string,
    exerciseId: string,
    token?: string
  ): Promise<Routine> {
    try {
      const response = await axios.delete<GetRoutineDTO>(
        `${ROUTINES_URL}/${routineId}/exercises/${exerciseId}`,
        authHeaders(token)
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al eliminar el ejercicio');
    }
  }

  async reorderExercises(
    routineId: string,
    order: string[],
    token?: string
  ): Promise<Routine> {
    try {
      const response = await axios.patch<GetRoutineDTO>(
        `${ROUTINES_URL}/${routineId}/exercises/reorder`,
        { order },
        authHeaders(token)
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al reordenar los ejercicios');
    }
  }

  private handleError(error: unknown, fallbackMessage: string): Error {
    const err = error as AxiosError<APIErrorResponse>;
    const serverMessage = err.response?.data?.message || fallbackMessage;

    return new Error(serverMessage);
  }
}
