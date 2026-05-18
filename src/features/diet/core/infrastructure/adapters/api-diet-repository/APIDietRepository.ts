import { API_ENDPOINTS } from '@config/api';
import { cachedGet, invalidateCache } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';
import type {
  DietLogGains,
  DietLogResult,
} from '../../../domain/models/DietLogGains';
import type { DietStreakState } from '../../../domain/models/DietStreakState';
import type { GetDietDTO } from './dtos/GetDietDTO';
import { DietFromDTO } from './mappers/DietFromDTO';

interface DietStateDTO {
  diet_streak: number;
  best_diet_streak: number;
  last_diet_date: string | null;
  logged_today: boolean;
}

interface DietLogDTO {
  diet_streak: number;
  best_diet_streak: number;
  last_diet_date: string;
  already_logged_today: boolean;
  vigor_before_xp: number;
  vigor_before_level: number;
  vigor_after_xp: number;
  vigor_after_level: number;
  vigor_delta: number;
}

const stateFromDTO = (dto: DietStateDTO): DietStreakState => ({
  dietStreak: dto.diet_streak,
  bestDietStreak: dto.best_diet_streak,
  lastDietDate: dto.last_diet_date,
  loggedToday: dto.logged_today,
});

const stateFromLogDTO = (dto: DietLogDTO): DietStreakState => ({
  dietStreak: dto.diet_streak,
  bestDietStreak: dto.best_diet_streak,
  lastDietDate: dto.last_diet_date,
  // After a log call, "today is logged" iff the call processed (or
  // would have processed) today — which the server signals by either
  // updating last_diet_date to today or returning already_logged_today.
  loggedToday: true,
});

const gainsFromLogDTO = (dto: DietLogDTO): DietLogGains | null => {
  // No popup on idempotent re-taps: the server updates nothing, so the
  // bar would just sit at its current fill with no movement.
  if (dto.already_logged_today) return null;
  return {
    delta: dto.vigor_delta,
    beforeXp: dto.vigor_before_xp,
    beforeLevel: dto.vigor_before_level,
    afterXp: dto.vigor_after_xp,
    afterLevel: dto.vigor_after_level,
    streak: dto.diet_streak,
  };
};

export class APIDietRepository implements DietRepository {
  async getDiet(userId: number): Promise<Diet> {
    try {
      // Macros / goal don't change between navigations within a single
      // session — a 60s TTL keeps a tab-toggle from re-fetching the
      // full diet model.
      const data = await cachedGet<GetDietDTO>(API_ENDPOINTS.getDiet(userId), {
        ttlMs: 60_000,
      });

      return DietFromDTO.fromDTO(data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu dieta. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }

  async getStreakState(): Promise<DietStreakState> {
    try {
      const data = await cachedGet<DietStateDTO>(API_ENDPOINTS.getDietState);
      return stateFromDTO(data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu racha de dieta. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }

  async logToday(): Promise<DietLogResult> {
    try {
      const response = await axios.post<DietLogDTO>(API_ENDPOINTS.logDietToday);
      // Diet log bumps vigor XP and the diet-streak triplet. Bust the
      // cached reads that depend on either so the next dashboard or
      // diet-card render reflects the new values without staleness.
      invalidateCache(API_ENDPOINTS.getDietState);
      invalidateCache(API_ENDPOINTS.getStats);
      invalidateCache(API_ENDPOINTS.getDashboardCards);
      return {
        state: stateFromLogDTO(response.data),
        gains: gainsFromLogDTO(response.data),
      };
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido registrar la dieta de hoy. Vuelve a intentarlo en un momento.'
        )
      );
    }
  }
}
