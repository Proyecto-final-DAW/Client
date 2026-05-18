import { API_ENDPOINTS } from '@config/api';
import { cachedGet, invalidateCache } from '@shared/api/cachedGet';
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
      // 30s TTL. After `chooseClass`, the post-response we return is
      // authoritative (CharacterProvider stores it locally), but other
      // mounted components might still hit `getState` — invalidate the
      // cache there so they pick up the new state immediately.
      const data = await cachedGet<GetCharacterStateDTO>(
        API_ENDPOINTS.getCharacterState
      );
      return toResult(data);
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
      // Class progression is the one piece of state that branches every
      // dependent panel (rank pill, dashboard hero, ladder). Bust the
      // cache so a sibling `useCharacterState` reading via getState()
      // doesn't return the pre-choice payload for the next 30 seconds.
      invalidateCache(API_ENDPOINTS.getCharacterState);
      // Confirming a class can unlock the "first class" / "first
      // specialization" milestones server-side, and the dashboard hero
      // card renders the chosen class name — drop those caches too so
      // the achievement list and the dashboard reflect the choice
      // without a manual refresh.
      invalidateCache(API_ENDPOINTS.getMilestonesUnlocked);
      invalidateCache(API_ENDPOINTS.getDashboardCards);
      return toResult(response.data);
    } catch (error) {
      throw surface(
        error,
        'No hemos podido confirmar tu clase. Vuelve a intentarlo.'
      );
    }
  }

  // Catalog never changes between deployments — cache aggressively
  // (5 minutes) so the class-picker modal doesn't re-fetch the whole
  // 38-class catalog every time the user opens it.
  async getCatalog(): Promise<ClassCatalog> {
    try {
      return await cachedGet<ClassCatalog>(API_ENDPOINTS.getCharacterCatalog, {
        ttlMs: 5 * 60_000,
      });
    } catch (error) {
      throw surface(
        error,
        'No hemos podido cargar el catalogo de clases. Recarga la pagina.'
      );
    }
  }
}
