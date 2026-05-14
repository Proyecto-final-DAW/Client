import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { CardsRepository } from '../../../application/ports/CardsRepository';
import type { Cards } from '../../../domain/models/Cards';
import type { GetCardsDTO } from './dtos/GetCardsDTO';
import { CardsFromDTO } from './mappers/CardsFromDTO';

export class APICardsRepository implements CardsRepository {
  async getCards(): Promise<Cards> {
    try {
      const response = await axios.get<GetCardsDTO>(
        API_ENDPOINTS.getDashboardCards
      );

      return CardsFromDTO.fromDTO(response.data);
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
