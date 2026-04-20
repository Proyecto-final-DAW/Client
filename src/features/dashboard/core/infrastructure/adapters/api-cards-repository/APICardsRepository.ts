import axios, { AxiosError } from 'axios';

import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { CardsRepository } from '../../../application/ports/CardsRepository';
import type { Cards } from '../../../domain/models/Cards';
import type { GetCardsDTO } from './dtos/GetCardsDTO';
import { CardsFromDTO } from './mappers/CardsFromDTO';

// need to change this once the api is available, now we use the mocked
const CARDS_URL = `${import.meta.env.VITE_API_URL}/users/cards`;

export class APICardsRepository implements CardsRepository {
  async getCards(token: string): Promise<Cards> {
    try {
      const response = await axios.get<GetCardsDTO>(CARDS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return CardsFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar las cards';
      throw new Error(serverMessage);
    }
  }
}
