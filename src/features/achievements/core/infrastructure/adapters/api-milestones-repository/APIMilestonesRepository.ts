import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { MilestonesRepository } from '../../../application/ports/MilestonesRepository';
import type { Milestone } from '../../../domain/models/Milestone';
import type {
  GetAllMilestonesDTO,
  GetUnlockedMilestonesDTO,
} from './dtos/GetMilestonesDTO';
import { MilestonesFromDTO } from './mappers/MilestonesFromDTO';

export class APIMilestonesRepository implements MilestonesRepository {
  async getAllWithStatus(): Promise<Milestone[]> {
    try {
      const [allResponse, unlockedResponse] = await Promise.all([
        axios.get<GetAllMilestonesDTO>(API_ENDPOINTS.getMilestones),
        axios.get<GetUnlockedMilestonesDTO>(
          API_ENDPOINTS.getMilestonesUnlocked
        ),
      ]);

      return MilestonesFromDTO.fromDTO({
        all: allResponse.data,
        unlocked: unlockedResponse.data,
      });
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tus logros. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
