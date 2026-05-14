import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type {
  CharacterRepository,
  CharacterStateOrOnboarding,
} from '../../../application/ports/CharacterRepository';
import type { PendingChoiceTier } from '../../../domain/models/CharacterState';
import type { ClassCatalog } from '../../../domain/models/ClassCatalog';
import {
  isOnboardingRequired,
  type GetCharacterStateDTO,
} from './dtos/GetCharacterStateDTO';
import { CharacterStateFromDTO } from './mappers/CharacterStateFromDTO';

const surface = (error: unknown, fallback: string): Error =>
  new Error(mapAxiosError(error, fallback));

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
      throw surface(
        error,
        'No hemos podido cargar tu personaje. Recarga la pagina o intentalo mas tarde.'
      );
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
      throw surface(
        error,
        'No hemos podido confirmar tu clase. Vuelve a intentarlo.'
      );
    }
  }

  // The server emits the catalog using the same shape the domain expects,
  // so no mapper is needed — only a typed read.
  async getCatalog(): Promise<ClassCatalog> {
    try {
      const response = await axios.get<ClassCatalog>(
        API_ENDPOINTS.getCharacterCatalog
      );
      return response.data;
    } catch (error) {
      throw surface(
        error,
        'No hemos podido cargar el catalogo de clases. Recarga la pagina.'
      );
    }
  }
}
