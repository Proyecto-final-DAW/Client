import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type {
  CharacterRepository,
  CharacterStateOrOnboarding,
} from '../../../application/ports/CharacterRepository';
import type { PendingChoiceTier } from '../../../domain/models/CharacterState';
import {
  isOnboardingRequired,
  type GetCharacterStateDTO,
} from './dtos/GetCharacterStateDTO';
import { CharacterStateFromDTO } from './mappers/CharacterStateFromDTO';

const surface = (error: unknown, fallback: string): Error => {
  const err = error as AxiosError<APIErrorResponse>;
  return new Error(err.response?.data?.message || fallback);
};

const toResult = (dto: GetCharacterStateDTO): CharacterStateOrOnboarding => {
  if (isOnboardingRequired(dto)) {
    return { kind: 'requiresOnboarding' };
  }
  return { kind: 'state', state: CharacterStateFromDTO.fromDTO(dto) };
};

export class APICharacterRepository implements CharacterRepository {
  async getState(): Promise<CharacterStateOrOnboarding> {
    try {
      const response = await axios.get<GetCharacterStateDTO>(
        API_ENDPOINTS.getCharacterState
      );
      return toResult(response.data);
    } catch (error) {
      throw surface(error, 'Error al cargar el estado del personaje');
    }
  }

  async chooseClass(
    tier: PendingChoiceTier,
    classId: string
  ): Promise<CharacterStateOrOnboarding> {
    try {
      const response = await axios.post<GetCharacterStateDTO>(
        API_ENDPOINTS.chooseCharacterClass,
        { tier, classId }
      );
      return toResult(response.data);
    } catch (error) {
      throw surface(error, 'Error al elegir clase');
    }
  }
}
