import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../../../../../../config/api';
import type { APIErrorResponse } from '../../../../../../shared/api/error-response/APIErrorResponse';
import type { SessionRepository } from '../../../application/ports/SessionRepository';
import type {
  CreateSessionInput,
  Session,
} from '../../../domain/models/Session';
import type {
  CreateSessionRequestDTO,
  CreateSessionResponseDTO,
} from './dtos/CreateSessionDTO';
import { SessionFromDTO } from './mappers/SessionFromDTO';

const SESSIONS_URL = `${API_BASE_URL}/sessions`;

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export class APISessionRepository implements SessionRepository {
  async createSession(
    input: CreateSessionInput,
    token?: string
  ): Promise<Session> {
    try {
      const body: CreateSessionRequestDTO = {
        exercises: input.exercises,
        ...(input.date ? { date: input.date } : {}),
      };

      const response = await axios.post<CreateSessionResponseDTO>(
        SESSIONS_URL,
        body,
        { headers: authHeaders(token) }
      );

      return SessionFromDTO.fromDTO(response.data);
    } catch (error) {
      throw this.handleError(error, 'Error al guardar la sesión');
    }
  }

  private handleError(error: unknown, fallbackMessage: string): Error {
    const err = error as AxiosError<APIErrorResponse>;
    const serverMessage = err.response?.data?.message || fallbackMessage;

    return new Error(serverMessage);
  }
}
