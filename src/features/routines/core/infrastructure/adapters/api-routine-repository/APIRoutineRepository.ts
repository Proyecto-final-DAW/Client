import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';
import type { GetRoutineDTO } from './dtos/GetRoutineDTO';
import { RoutinesFromDTO } from './mappers/RoutinesFromDTO';

export class APIRoutineRepository implements RoutineRepository {
  async getRoutines(): Promise<Routine[]> {
    try {
      const response = await axios.get<GetRoutineDTO[]>(API_ENDPOINTS.routines);
      return RoutinesFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar las rutinas';
      throw new Error(serverMessage);
    }
  }
  async createRoutine(name: string): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(API_ENDPOINTS.routines, {
        name: name.trim(),
      });
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al crear la rutina';
      throw new Error(serverMessage);
    }
  }
  async deleteRoutine(routineId: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.deleteRoutine(routineId));
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al eliminar la rutina';
      throw new Error(serverMessage);
    }
  }
  async addExercise(routineId: string, exerciseId: string): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(
        API_ENDPOINTS.addExerciseToRoutine(routineId),
        { exerciseId }
      );
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al añadir el ejercicio';
      throw new Error(serverMessage);
    }
  }
  async removeExercise(
    routineId: string,
    exerciseId: string
  ): Promise<Routine> {
    try {
      const response = await axios.delete<GetRoutineDTO>(
        API_ENDPOINTS.removeExerciseFromRoutine(routineId, exerciseId),
        {}
      );
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al eliminar el ejercicio';
      throw new Error(serverMessage);
    }
  }
  async reorderExercises(routineId: string, order: string[]): Promise<Routine> {
    try {
      const response = await axios.patch<GetRoutineDTO>(
        API_ENDPOINTS.reorderExercises(routineId),
        { order }
      );
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al reordenar los ejercicios';
      throw new Error(serverMessage);
    }
  }
}
