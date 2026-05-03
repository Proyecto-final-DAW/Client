import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '../../../../../../config/api';
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

export class APISessionRepository implements SessionRepository {
  async createSession(input: CreateSessionInput): Promise<Session> {
    try {
      const body: CreateSessionRequestDTO = {
        exercises: input.exercises,
        ...(input.date ? { date: input.date } : {}),
      };
      const response = await axios.post<CreateSessionResponseDTO>(
        API_ENDPOINTS.createSession,
        body
      );
      return SessionFromDTO.fromDTO(response.data);
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse>;
      const serverMessage =
        err.response?.data?.message || 'Error al guardar la sesión';
      throw new Error(serverMessage);
    }
  }
}
