import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '@config/api';
import type { APIErrorResponse } from '@shared/api/error-response/APIErrorResponse';
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
      const response = await axios.get<GetDietDTO>(
        API_ENDPOINTS.getDiet(userId)
      );

      return DietFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los datos de dieta';

      throw new Error(serverMessage);
    }
  }

  async getStreakState(): Promise<DietStreakState> {
    try {
      const response = await axios.get<DietStateDTO>(API_ENDPOINTS.getDietState);
      return stateFromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const message =
        err.response?.data?.message || 'Error al cargar la racha de dieta';
      throw new Error(message);
    }
  }

  async logToday(): Promise<DietLogResult> {
    try {
      const response = await axios.post<DietLogDTO>(API_ENDPOINTS.logDietToday);
      return {
        state: stateFromLogDTO(response.data),
        gains: gainsFromLogDTO(response.data),
      };
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const message =
        err.response?.data?.message || 'Error al registrar la dieta';
      throw new Error(message);
    }
  }
}
