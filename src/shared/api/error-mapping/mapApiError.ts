import type { AxiosError } from 'axios';

import type { APIErrorResponse } from '../error-response/APIErrorResponse';

/**
 * Single source of truth for translating server failures into Spanish
 * copy the user actually wants to read.
 *
 * Adapters used to each ship their own ad-hoc fallback ("Error al
 * cargar X"). That violated the project rule: every error path must
 * explain what went wrong AND what the user can do next, never a bare
 * "ha ocurrido un error". This helper centralises the dispatch:
 *
 *   1. Stable error codes (`INVALID_CREDENTIALS`, `TOO_MANY_*`, …) come
 *      first — they're the most specific signal the server gives us.
 *   2. HTTP status families come next — covers the cases where the
 *      server didn't bother to attach a code (legacy endpoints, 5xx,
 *      network failures with status 0/undefined).
 *   3. The server's own Spanish `message` field is honoured as a
 *      fallback because newer endpoints already write user-friendly
 *      copy server-side.
 *   4. Finally a context-specific fallback the caller supplies — e.g.
 *      "No hemos podido cargar tu progreso. Vuelve a intentarlo."
 *      Always includes a recovery hint.
 *
 * Project copy convention: Ñ stays, acute accents drop. So `contraseña`
 * keeps its Ñ but `sesion`, `dia`, `corazon` etc. ship without tildes.
 * The user reiterated this rule when reviewing onboarding copy: "no
 * quiero que no haya acentos PERO SI QUE ESTE LA Ñ".
 */

export interface MapApiErrorInput {
  status: number | undefined;
  code: string | undefined;
  serverMessage: string | undefined;
  /**
   * Last-resort copy if nothing else matches. MUST be in Spanish, MUST
   * include a recovery hint. Never a bare "Error al X".
   */
  fallback: string;
}

const CODE_MESSAGES: Record<string, string> = {
  // Auth
  INVALID_CREDENTIALS:
    'Email o contraseña incorrectos. Comprueba los datos y vuelve a intentarlo.',
  EMAIL_ALREADY_REGISTERED:
    'Ese email ya esta en uso. Inicia sesion en su lugar.',
  TOO_MANY_LOGIN_ATTEMPTS:
    'Demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.',
  TOO_MANY_REGISTER_ATTEMPTS:
    'Demasiados intentos de registro. Espera unos minutos antes de volver a intentarlo.',
  // Profile / change-password
  INVALID_PASSWORD: 'La contraseña actual no es correcta. Vuelve a intentarlo.',
  PASSWORD_TOO_SHORT: 'La nueva contraseña debe tener al menos 8 caracteres.',
  PASSWORD_REQUIRED:
    'Falta la contraseña actual o la nueva. Rellena ambos campos.',
  // Onboarding / state
  ONBOARDING_INCOMPLETE:
    'Tienes que terminar la configuracion inicial antes de continuar.',
  // Sessions
  SESSION_ALREADY_LOGGED_TODAY:
    'Ya entrenaste hoy. Solo cuenta una sesion por dia.',
  // Authorization
  FORBIDDEN_NOT_SELF: 'No tienes permiso para hacer esto.',
  // Character class
  CHARACTER_CHOICE_CONFLICT:
    'Ya tienes una clase elegida para este nivel. Recarga la pagina para ver tu estado actual.',
  CHARACTER_CHOICE_INVALID:
    'Esa clase no es valida para tu nivel actual. Elige otra opcion.',
};

const STATUS_MESSAGES = {
  network:
    'No hemos podido contactar con el servidor. Comprueba tu conexion e intentalo de nuevo.',
  unauthorized: 'Tu sesion ha caducado. Vuelve a iniciar sesion.',
  forbidden: 'No tienes permiso para hacer esto.',
  notFound: 'No hemos encontrado lo que buscas. Puede que se haya borrado.',
  rateLimited:
    'Demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.',
  serverError:
    'El servidor no responde ahora mismo. Intentalo de nuevo en un momento.',
} as const;

export function mapApiError({
  status,
  code,
  serverMessage,
  fallback,
}: MapApiErrorInput): string {
  if (code && code in CODE_MESSAGES) return CODE_MESSAGES[code];

  if (status === 0 || status === undefined) return STATUS_MESSAGES.network;
  if (status === 401) return STATUS_MESSAGES.unauthorized;
  if (status === 403) return STATUS_MESSAGES.forbidden;
  if (status === 404) return STATUS_MESSAGES.notFound;
  if (status === 429) return STATUS_MESSAGES.rateLimited;
  if (status >= 500) return STATUS_MESSAGES.serverError;

  if (serverMessage && serverMessage.length > 0) return serverMessage;
  return fallback;
}

/**
 * Convenience wrapper that pulls status / code / message out of an
 * AxiosError so adapters don't repeat the destructure boilerplate.
 */
export function mapAxiosError(error: unknown, fallback: string): string {
  const err = error as AxiosError<APIErrorResponse & { code?: string }>;
  const status = err.response?.status;
  const code = err.response?.data?.code;
  const serverMessage = err.response?.data?.message;
  return mapApiError({ status, code, serverMessage, fallback });
}
