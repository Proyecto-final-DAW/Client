import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

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
      // Catalog of milestones is effectively static between deployments
      // (5 min TTL). The "unlocked for this user" list changes only on
      // session save; useFinishWorkout already busts /stats and /cards,
      // so a stale 30s window on /milestones/me is acceptable — the
      // achievements page rarely sits open for that long.
      const [all, unlocked] = await Promise.all([
        cachedGet<GetAllMilestonesDTO>(API_ENDPOINTS.getMilestones, {
          ttlMs: 5 * 60_000,
        }),
        cachedGet<GetUnlockedMilestonesDTO>(
          API_ENDPOINTS.getMilestonesUnlocked
        ),
      ]);

      return MilestonesFromDTO.fromDTO({ all, unlocked });
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
