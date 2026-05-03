import type { Session } from '../../../../domain/models/Session';
import type { SessionDTO } from '../dtos/GetSessionDTO';

export class SessionsFromDTO {
  static fromDTO(dto: SessionDTO): Session {
    return {
      id: String(dto.id),
      userId: String(dto.user_id),
      routineId: dto.routine_id !== null ? String(dto.routine_id) : null,
      date: new Date(dto.date),
      notes: null,
      createdAt: new Date(dto.created_at),
    };
  }

  static fromDTOList(dtos: SessionDTO[]): Session[] {
    return dtos.map(SessionsFromDTO.fromDTO);
  }
}
