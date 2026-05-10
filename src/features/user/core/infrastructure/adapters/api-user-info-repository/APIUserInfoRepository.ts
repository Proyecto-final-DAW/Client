import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '@config/api';
import type { APIErrorResponse } from '@shared/api/error-response/APIErrorResponse';
import type { LoginResponse } from '@shared/core/domain/models/UserInfo';
import type { UserInfoRepository } from '../../../application/ports/UserInfoRepository';

/**
 * Maps the server's structured error responses to copy the user
 * actually wants to read. Server emits `{ code, message }` for the
 * known failure modes (see UserController.login + bruteforce
 * middleware); the code is the stable handle. Falls through to the
 * server's `message` (already Spanish post-hardening) and finally to
 * a friendly catch-all — so under no circumstance does the user see
 * a raw English string or "Error al iniciar sesion" with no signal
 * about WHAT went wrong.
 */
const loginMessageFor = (
  status: number | undefined,
  code: string | undefined,
  serverMessage: string | undefined
): string => {
  if (code === 'INVALID_CREDENTIALS') {
    return 'Contrasena incorrecta o email no registrado.';
  }
  if (code === 'TOO_MANY_LOGIN_ATTEMPTS') {
    return 'Demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.';
  }
  if (status === 429) {
    return 'Demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.';
  }
  if (status === 0 || status === undefined) {
    return 'No hemos podido contactar con el servidor. Comprueba tu conexion.';
  }
  if (status >= 500) {
    return 'El servidor no responde ahora mismo. Intentalo de nuevo en un momento.';
  }
  // Trust a Spanish server message if we got one; otherwise the
  // catch-all kicks in. Both branches stay actionable, never
  // "ha ocurrido un error".
  if (serverMessage && serverMessage.length > 0) return serverMessage;
  return 'No hemos podido iniciar sesion. Revisa los datos y vuelve a intentarlo.';
};

export class APIUserInfoRepository implements UserInfoRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });
      const data = response.data as unknown as Record<string, unknown>;

      const token = data.token as string | undefined;
      const user =
        (data.user as LoginResponse['user'] | undefined) ??
        ({
          id: data.id,
          name: data.name,
          email: data.email,
          onboarding_completed: data.onboarding_completed ?? false,
          profileImage: data.profileImage,
          created_at: data.created_at,
          updated_at: data.updated_at,
        } as LoginResponse['user']);

      if (!token) {
        throw new Error(
          'No hemos podido iniciar sesion. Revisa los datos y vuelve a intentarlo.'
        );
      }

      return {
        message: (data.message as string) ?? 'OK',
        token,
        user,
      };
    } catch (error) {
      const err = error as AxiosError<APIErrorResponse & { code?: string }>;
      const status = err.response?.status;
      const code = err.response?.data?.code;
      const serverMessage = err.response?.data?.message;
      throw new Error(loginMessageFor(status, code, serverMessage));
    }
  }
}
