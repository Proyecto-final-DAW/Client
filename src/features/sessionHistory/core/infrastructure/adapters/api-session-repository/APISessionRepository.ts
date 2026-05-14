import { API_ENDPOINTS } from '@config/api';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';

import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';
import type { GetSessionHistoryDTO } from './dtos/GetSessionDTO';
import { SessionsFromDTO } from './mappers/SessionsFromDTO';

export class APISessionRepository implements SessionRepository {
  async getUserSessions(): Promise<Session[]> {
    try {
      const response = await axios.get<GetSessionHistoryDTO>(
        API_ENDPOINTS.getSessionHistory
      );

      return SessionsFromDTO.fromDTOList(response.data.sessions);
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
