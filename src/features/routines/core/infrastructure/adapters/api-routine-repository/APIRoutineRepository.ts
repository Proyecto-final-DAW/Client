import { API_BASE_URL } from '@config/api';
import type { Exercise } from '@features/exercises/core/domain/models/Exercise';
import { cachedGet, invalidateCache } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

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
  async getRoutines(_token?: string): Promise<Routine[]> {
    try {
      // 30s TTL. Every mutation below busts this cache so the list
      // stays consistent. The token param used to be threaded as an
      // explicit header but the global axios interceptor already
      // attaches the bearer — passing it again forced a bypass of
      // the cache wrapper for no benefit.
      const data = await cachedGet<GetRoutineDTO[]>(ROUTINES_URL);

      return RoutinesFromDTO.fromDTOList(data);
    } catch (error) {
      throw this.handleError(
        error,
        'No hemos podido cargar tus rutinas. Recarga la pagina o intentalo mas tarde.'
      );
    }
  }

  async createRoutine(name: string, token?: string): Promise<Routine> {
    try {
      const response = await axios.post<GetRoutineDTO>(
        ROUTINES_URL,
        { name, exercises: [] },
        { headers: authHeaders(token) }
      );

      invalidateCache(ROUTINES_URL);
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(
        error,
        'No hemos podido crear la rutina. Vuelve a intentarlo en un momento.'
      );
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
      'No hemos podido añadir el ejercicio. Vuelve a intentarlo.',
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
      'No hemos podido quitar el ejercicio. Vuelve a intentarlo.',
      token
    );
  }

  async reorderExercises(
    routine: Routine,
    exercises: Exercise[],
    token?: string
  ): Promise<Routine> {
    return this.replaceExercises(
      routine.id,
      exercises,
      'No hemos podido guardar el nuevo orden. Vuelve a intentarlo.',
      token
    );
  }

  async deleteRoutine(routineId: string, token?: string): Promise<void> {
    try {
      await axios.delete(`${ROUTINES_URL}/${routineId}`, {
        headers: authHeaders(token),
      });
      invalidateCache(ROUTINES_URL);
    } catch (error) {
      throw this.handleError(
        error,
        'No hemos podido borrar la rutina. Vuelve a intentarlo.'
      );
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

      invalidateCache(ROUTINES_URL);
      return RoutinesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, fallbackMessage);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): Error {
    return new Error(mapAxiosError(error, fallbackMessage));
  }
}
