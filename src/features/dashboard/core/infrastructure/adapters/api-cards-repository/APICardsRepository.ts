import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

import type { CardsRepository } from '../../../application/ports/CardsRepository';
import type { Cards } from '../../../domain/models/Cards';
import type { GetCardsDTO } from './dtos/GetCardsDTO';
import { CardsFromDTO } from './mappers/CardsFromDTO';

export class APICardsRepository implements CardsRepository {
  async getCards(): Promise<Cards> {
    try {
      // 30s TTL — dashboard re-mounts between navigations (StrictMode
      // double-mount in dev, sibling components requesting the same
      // payload) all collapse onto a single network call.
      const data = await cachedGet<GetCardsDTO>(
        API_ENDPOINTS.getDashboardCards
      );

      return CardsFromDTO.fromDTO(data);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar el panel. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
