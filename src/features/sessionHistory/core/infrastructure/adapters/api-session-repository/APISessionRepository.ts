import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type { Session } from '../../../domain/models/Session';
import type { GetSessionDTO } from './dtos/GetSessionDTO';
import { SessionsFromDTO } from './mappers/SessionsFromDTO';

const SESSIONS_URL = `${API_BASE_URL}/sessions/history`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export class APISessionRepository implements SessionRepository {
  async getUserSessions(token?: string): Promise<Session[]> {
    try {
      const response = await axios.get<GetSessionDTO[]>(SESSIONS_URL, {
        headers: authHeaders(token),
      });

      return SessionsFromDTO.fromDTOList(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message ||
        'Error al cargar el historial de sesiones';
      throw new Error(serverMessage);
    }
  }
}
