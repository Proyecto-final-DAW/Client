import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
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
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message ||
        'Error al cargar el historial de sesiones';
      throw new Error(serverMessage);
    }
  }
}
