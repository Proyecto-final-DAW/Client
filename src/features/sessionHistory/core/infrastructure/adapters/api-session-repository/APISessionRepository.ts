import { API_ENDPOINTS } from '@config/api';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';

import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';
import type { GetSessionHistoryDTO } from './dtos/GetSessionDTO';
import { SessionsFromDTO } from './mappers/SessionsFromDTO';

export class APISessionRepository implements SessionRepository {
  async getUserSessions(): Promise<Session[]> {
    try {
      // 30s TTL. The session-history page only changes after a new
      // workout, which busts this cache via the SESSION_CHANGED_EVENT
      // flow in useFinishWorkout.
      const data = await cachedGet<GetSessionHistoryDTO>(
        API_ENDPOINTS.getSessionHistory
      );

      return SessionsFromDTO.fromDTOList(data.sessions);
    } catch (error) {
      throw new Error(
        mapAxiosError(
          error,
          'No hemos podido cargar tu historial de sesiones. Recarga la pagina o intentalo mas tarde.'
        )
      );
    }
  }
}
