import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';
import type { GetSessionDTO } from './dtos/GetSessionDTO';
import { SessionFromDTO } from './mappers/SessionsFromDTO';

const SESSIONS_URL = `${API_BASE_URL}/sessions/history`;

export class APISessionRepository implements SessionRepository {
  async getUserSessions(token: string): Promise<Session[]> {
    try {
      const response = await axios.get<GetSessionDTO[]>(SESSIONS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return SessionFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message ||
        'Error al cargar el historial de sesiones';
      throw new Error(serverMessage);
    }
  }
}
