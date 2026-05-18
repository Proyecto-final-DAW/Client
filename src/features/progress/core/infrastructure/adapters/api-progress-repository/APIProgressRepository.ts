import { API_BASE_URL, API_ENDPOINTS } from '@config/api';
import { cachedGet, invalidateCache } from '@shared/api/cachedGet';
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
      // 60s TTL. The list of weighted exercises the user has ever
      // logged only grows on a new session save, which already busts
      // the cache via useFinishWorkout.
      const data = await cachedGet<GetPerformedExercisesDTO>(
        API_ENDPOINTS.getPerformedExercises(userId),
        { ttlMs: 60_000 }
      );
      return PerformedExercisesFromDTO.fromDTO(data);
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
      // 60s TTL. The PR chart for a given exercise only changes after
      // a new session for that exercise — also busted in useFinishWorkout.
      const data = await cachedGet<GetExerciseProgressDTO>(
        API_ENDPOINTS.getExerciseProgress(userId, exerciseId),
        { ttlMs: 60_000 }
      );
      return ExerciseProgressFromDTO.fromDTO(data);
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
      const data = await cachedGet<GetProgressDTO[]>(
        API_ENDPOINTS.getWeightHistory(userId),
        { ttlMs: 60_000 }
      );
      return WeightHistoryFromDTO.fromDTOList(data);
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
      // The weight log feeds the body-weight chart AND triggers a
      // server-side macro recalc on `users` — drop every cached read
      // that derives from either so the next mount of /diet, /profile,
      // or /dashboard reflects the new value the moment the form
      // resolves instead of waiting out the TTL.
      invalidateCache(API_ENDPOINTS.getWeightHistory(userId));
      invalidateCache(API_ENDPOINTS.getStats);
      invalidateCache(API_ENDPOINTS.profile);
      invalidateCache(API_ENDPOINTS.getDashboardCards);
      // Prefix-match every `/diet/...` key (covers both `/diet/:userId`
      // and `/diet/state`) so the diet macros card refreshes too.
      invalidateCache(`${API_BASE_URL}/diet/`);
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
