import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';
import type { GetDietDTO } from './dtos/GetDietDTO';
import { DietFromDTO } from './mappers/DietFromDTO';

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
}
