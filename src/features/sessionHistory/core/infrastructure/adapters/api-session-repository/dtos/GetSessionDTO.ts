export interface GetSessionDTO {
  id: number;
  user_id: number;
  routine_id?: number | null;
  date: string;
  notes?: string | null;
  created_at: string;
}
