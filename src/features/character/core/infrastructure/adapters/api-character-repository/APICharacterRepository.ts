import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { CharacterRepository } from '../../../application/ports/CharacterRepository';
import type {
  CharacterState,
  PendingChoiceTier,
} from '../../../domain/models/CharacterState';
import type { GetCharacterStateDTO } from './dtos/GetCharacterStateDTO';
import { CharacterStateFromDTO } from './mappers/CharacterStateFromDTO';

const CHARACTER_URL = `${API_BASE_URL}/character`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const handle = (error: unknown, fallback: string): Error => {
  const err = error as AxiosError<APIErrorResponse>;
  return new Error(err.response?.data?.message || fallback);
};

export class APICharacterRepository implements CharacterRepository {
  async getState(token?: string): Promise<CharacterState> {
    try {
      const response = await axios.get<GetCharacterStateDTO>(
        `${CHARACTER_URL}/state`,
        { headers: authHeaders(token) }
      );
      return CharacterStateFromDTO.fromDTO(response.data);
    } catch (error) {
      throw handle(error, 'Error al cargar el estado del personaje');
    }
  }

  async chooseClass(
    tier: PendingChoiceTier,
    classId: string,
    token?: string
  ): Promise<CharacterState> {
    try {
      // The choose endpoint returns the bare DB row; refetch to get full state.
      await axios.post(
        `${CHARACTER_URL}/choose`,
        { tier, classId },
        { headers: authHeaders(token) }
      );
      return this.getState(token);
    } catch (error) {
      throw handle(error, 'Error al elegir clase');
    }
  }
}
