import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar las cards';
      throw new Error(serverMessage);
    }
  }
}
