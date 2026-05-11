import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import { toISODate } from '@shared/utils/date';
import axios from 'axios';

import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { ExerciseProgressPoint } from '../../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../../domain/models/PerformedExercise';
import type {
  Progress,
  RegisterWeightInput,
} from '../../../domain/models/Progress';
import type { GetExerciseProgressDTO } from './dtos/GetExerciseProgressDTO';
import type { GetPerformedExercisesDTO } from './dtos/GetPerformedExercisesDTO';
import type { GetProgressDTO, RegisterWeightDTO } from './dtos/GetProgressDTO';
import { ExerciseProgressFromDTO } from './mappers/ExerciseProgressFromDTO';
import { PerformedExercisesFromDTO } from './mappers/PerformedExercisesFromDTO';
import { WeightHistoryFromDTO } from './mappers/WeightHistoryFromDTO';

// Use the shared `toISODate` helper instead of the previous local
// `date.toISOString().split('T')[0]` — that variant is the exact UTC-
// shift bug the helper was created to avoid: a user in a TZ ahead of
// UTC who picks today's date can persist yesterday's date because the
// midnight-local parses to yesterday-UTC.

export class APIProgressRepository implements ProgressRepository {
  async getPerformedExercises(userId: number): Promise<PerformedExercise[]> {
    try {
      const response = await axios.get<GetPerformedExercisesDTO>(
        API_ENDPOINTS.getPerformedExercises(userId)
      );
      return PerformedExercisesFromDTO.fromDTO(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tus ejercicios. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
  async getExerciseProgress(
    userId: number,
    exerciseId: string
  ): Promise<ExerciseProgressPoint[]> {
    try {
      const response = await axios.get<GetExerciseProgressDTO>(
        API_ENDPOINTS.getExerciseProgress(userId, exerciseId)
      );
      return ExerciseProgressFromDTO.fromDTO(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu progresion. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
  async getWeightHistory(userId: number): Promise<Progress[]> {
    try {
      const response = await axios.get<GetProgressDTO[]>(
        API_ENDPOINTS.getWeightHistory(userId)
      );
      return WeightHistoryFromDTO.fromDTOList(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu historial de peso. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
  async registerWeight(
    userId: number,
    input: RegisterWeightInput
  ): Promise<Progress> {
    try {
      const body: RegisterWeightDTO = {
        weight: input.weight,
        date: toISODate(input.date),
      };
      const response = await axios.post<GetProgressDTO>(
        API_ENDPOINTS.getWeightHistory(userId),
        body
      );
      return WeightHistoryFromDTO.fromDTO(response.data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido guardar tu peso. Vuelve a intentarlo en un momento.'
        )
      );
    }
  }
}
