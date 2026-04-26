export interface GetSessionDTO {
  id: string;
  user_id: string;
  routine_id?: string | null;
  date: string;
  notes?: string | null;
  created_at: string;
}
