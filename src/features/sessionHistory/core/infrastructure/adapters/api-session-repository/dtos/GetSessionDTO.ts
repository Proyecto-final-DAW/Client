/**
 * Wire shape of `GET /sessions/history`. Server returns the paginated
 * envelope from `sessionService.getUserSessions`. Each session row
 * includes its nested exercises and sets, but the client-side history
 * view only consumes the top-level fields today.
 */
export interface SessionDTO {
  id: number;
  user_id: number;
  routine_id: number | null;
  date: string;
  created_at: string;
}

export interface GetSessionHistoryDTO {
  sessions: SessionDTO[];
  total: number;
  page: number;
  limit: number;
}

// Kept for backward compat with any external import; prefer SessionDTO.
export type GetSessionDTO = SessionDTO;
