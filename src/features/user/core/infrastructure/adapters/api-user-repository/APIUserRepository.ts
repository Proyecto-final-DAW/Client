import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '@config/api';
import type { APIErrorResponse } from '@shared/api/error-response/APIErrorResponse';
import type { UserRepository } from '../../../application/ports/UserRepository';
import type { User, RegisterResponse } from '../../../domain/models/User';

/**
 * Same code-driven dispatch as the login adapter — branch on the
 * server's stable `code` first, fall through to its `message` if
 * present, finally to a friendly catch-all. Never surface a generic
 * "ha ocurrido un error" with no signal about WHAT went wrong.
 */
const registerMessageFor = (
  status: number | undefined,
  code: string | undefined,
  serverMessage: string | undefined
): string => {
  if (code === 'EMAIL_ALREADY_REGISTERED') {
    return 'Ese email ya esta en uso. Inicia sesion en su lugar.';
  }
  if (code === 'TOO_MANY_REGISTER_ATTEMPTS' || status === 429) {
    return 'Demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.';
  }
  if (status === 0 || status === undefined) {
    return 'No hemos podido contactar con el servidor. Comprueba tu conexion.';
  }
  if (status >= 500) {
    return 'El servidor no responde ahora mismo. Intentalo de nuevo en un momento.';
  }
  if (serverMessage && serverMessage.length > 0) return serverMessage;
  return 'No hemos podido completar el registro. Revisa los datos y vuelve a intentarlo.';
};

export class APIUserRepository implements UserRepository {
  async register(payload: User): Promise<RegisterResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.register, payload);
      const data =
        (response.data as unknown as Record<string, unknown> | undefined) ?? {};

      return {
        message: data.message as string | undefined,
      };
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse & { code?: string }>;
      const status = err.response?.status;
      const code = err.response?.data?.code;
      const serverMessage = err.response?.data?.message;
      throw new Error(registerMessageFor(status, code, serverMessage));
    }
  }
}
