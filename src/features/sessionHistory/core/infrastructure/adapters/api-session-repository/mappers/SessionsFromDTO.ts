import type { Session } from '../../../../domain/models/Session';
import type { GetSessionDTO } from '../dtos/GetSessionDTO';

export class SessionFromDTO {
  static fromDTO(dto: GetSessionDTO): Session {
    return {
      id: dto.id,
      userId: dto.user_id,
      routineId: dto.routine_id ?? null,
      date: new Date(dto.date),
      notes: dto.notes ?? null,
      createdAt: new Date(dto.created_at),
    };
  }

  static fromDTOList(dtos: GetSessionDTO[]): Session[] {
    return dtos.map(SessionFromDTO.fromDTO);
  }
}
