export interface APIErrorResponse {
  message: string;
  /**
   * Optional stable error code the server emits for typed failures
   * (e.g. `INVALID_CREDENTIALS`, `TOO_MANY_LOGIN_ATTEMPTS`,
   * `EMAIL_ALREADY_REGISTERED`, `SESSION_ALREADY_LOGGED_TODAY`).
   * Repository adapters branch on the code to surface a personalised
   * Spanish message rather than relying on the server's `message`,
   * which may itself be terse or localised inconsistently across
   * endpoints.
   */
  code?: string;
}
