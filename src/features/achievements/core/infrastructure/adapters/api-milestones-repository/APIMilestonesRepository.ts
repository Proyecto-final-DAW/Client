import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { MilestonesRepository } from '../../../application/ports/MilestonesRepository';
import type { Milestone } from '../../../domain/models/Milestone';
import type {
  GetAllMilestonesDTO,
  GetUnlockedMilestonesDTO,
} from './dtos/GetMilestonesDTO';
import { MilestonesFromDTO } from './mappers/MilestonesFromDTO';

export class APIMilestonesRepository implements MilestonesRepository {
  async getAllWithStatus(token: string): Promise<Milestone[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [allResponse, unlockedResponse] = await Promise.all([
        axios.get<GetAllMilestonesDTO>(API_ENDPOINTS.milestones, { headers }),
        axios.get<GetUnlockedMilestonesDTO>(API_ENDPOINTS.milestonesUnlocked, {
          headers,
        }),
      ]);

      return MilestonesFromDTO.fromDTO({
        all: allResponse.data,
        unlocked: unlockedResponse.data,
      });
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los logros';
      throw new Error(serverMessage);
    }
  }
}
