import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { Exercise } from '../../../../../exercises/core/domain/models/Exercise';
import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';
import type { GetRoutineDTO } from './dtos/GetRoutineDTO';
import type {
  UpdateRoutineExerciseRequestDTO,
  UpdateRoutineRequestDTO,
} from './dtos/UpdateRoutineRequestDTO';
import { RoutinesFromDTO } from './mappers/RoutinesFromDTO';

const ROUTINES_URL = `${API_BASE_URL}/routines`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const toExercisesRequestDTO = (
  exercises: Exercise[]
): UpdateRoutineExerciseRequestDTO[] =>
  exercises.map((exercise, index) => ({
    exercise_api_id: exercise.id,
    exercise_name: exercise.name || null,
    order_index: index,
  }));

export class APIRoutineRepository implements RoutineRepository {
  async getRoutines(token?: string): Promise<Routine[]> {
    try {
      const response = await axios.get<GetRoutineDTO[]>(ROUTINES_URL, {
        headers: authHeaders(token),
      });

      return RoutinesFromDTO.fromDTOList(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al cargar las rutinas');
    }
  }

  async createRoutine(name: string, token?: string): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(
        ROUTINES_URL,
        { name, exercises: [] },
        { headers: authHeaders(token) }
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al crear la rutina');
    }
  }

  async addExercise(
    routine: Routine,
    exercise: Exercise,
    token?: string
  ): Promise<Routine> {
    const alreadyExists = routine.exercises.some(
      (current) => current.id === exercise.id
    );
    if (alreadyExists) return routine;

    return this.replaceExercises(
      routine.id,
      [...routine.exercises, exercise],
      'Error al añadir el ejercicio',
      token
    );
  }

  async removeExercise(
    routine: Routine,
    exerciseId: string,
    token?: string
  ): Promise<Routine> {
    return this.replaceExercises(
      routine.id,
      routine.exercises.filter((exercise) => exercise.id !== exerciseId),
      'Error al eliminar el ejercicio',
      token
    );
  }

  async deleteRoutine(routineId: string, token?: string): Promise<void> {
    try {
      await axios.delete(`${ROUTINES_URL}/${routineId}`, {
        headers: authHeaders(token),
      });
    } catch (error) {
      throw this.handleError(error, 'Error al eliminar la rutina');
    }
  }

  private async replaceExercises(
    routineId: string,
    exercises: Exercise[],
    fallbackMessage: string,
    token?: string
  ): Promise<Routine> {
    try {
      const body: UpdateRoutineRequestDTO = {
        exercises: toExercisesRequestDTO(exercises),
      };

      const response = await axios.put<GetRoutineDTO>(
        `${ROUTINES_URL}/${routineId}`,
        body,
        { headers: authHeaders(token) }
      );

      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, fallbackMessage);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): Error {
    const err = error as AxiosError<APIErrorResponse>;
    const serverMessage = err.response?.data?.message || fallbackMessage;

    return new Error(serverMessage);
  }
}
