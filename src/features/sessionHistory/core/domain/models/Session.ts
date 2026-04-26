export interface Session {
  id: string;
  userId: string;
  routineId?: string | null;
  date: Date;
  notes?: string | null;
  createdAt: Date;
}
