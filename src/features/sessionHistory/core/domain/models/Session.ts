export interface Session {
  id: number;
  userId: number;
  routineId?: number | null;
  date: Date;
  notes?: string | null;
  createdAt: Date;
}
