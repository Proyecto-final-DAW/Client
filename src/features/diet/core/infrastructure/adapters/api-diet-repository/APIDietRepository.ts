import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';
import type { GetDietDTO } from './dtos/GetdietDTO';
import { DietFromDTO } from './mappers/DietFromDTO';

const DIET_URL = `${API_BASE_URL}/diet`;

const authHeaders = (token?: string) => ({
  Authorization: token ? `Bearer ${token}` : '',
});

export class APIDietRepository implements DietRepository {
  async getDiet(userId: string, token?: string): Promise<Diet> {
    try {
      const response = await axios.get<GetDietDTO>(`${DIET_URL}/${userId}`, {
        headers: authHeaders(token),
      });

      return DietFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al cargar los datos de dieta';

      throw new Error(serverMessage);
    }
  }
}
